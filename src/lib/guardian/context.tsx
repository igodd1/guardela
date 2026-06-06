import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { loadConfig, saveConfig } from "@/lib/guardian/storage";
import { DEFAULT_CONFIG, type GuardianConfig, type EventKind } from "@/lib/guardian/types";
import { connectBle, isBleSupported, type BleSession } from "@/lib/guardian/ble";
import { startMotionDetection, type MotionController } from "@/lib/guardian/motion";
import { buildAlertText, dispatchWhatsApp, getLocation } from "@/lib/guardian/alerts";

type BleStatus = "idle" | "connecting" | "connected" | "disconnected";

export interface PendingAlert {
  id: string;
  kind: EventKind;
  cancellable: boolean; // false for panic_short (sends immediately)
  expiresAt: number;
}

interface GuardianCtx {
  config: GuardianConfig;
  update: (patch: Partial<GuardianConfig>) => void;
  setPin: (pin: string) => void;
  bleStatus: BleStatus;
  battery: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  buzzerOn: boolean;
  triggerBuzzer: (on: boolean) => Promise<void>;
  pending: PendingAlert | null;
  triggerAlert: (kind: EventKind) => void;
  cancelPending: (pin: string) => boolean;
  sendNow: (kind: EventKind) => Promise<void>;
}

const Ctx = createContext<GuardianCtx | null>(null);

export function GuardianProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GuardianConfig>(DEFAULT_CONFIG);
  const [bleStatus, setBleStatus] = useState<BleStatus>("idle");
  const [battery, setBattery] = useState<number | null>(null);
  const [buzzerOn, setBuzzerOn] = useState(false);
  const [pending, setPending] = useState<PendingAlert | null>(null);
  const sessionRef = useRef<BleSession | null>(null);
  const motionRef = useRef<MotionController | null>(null);
  const disconnectTimerRef = useRef<number | null>(null);

  // Load config on mount
  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const update = useCallback((patch: Partial<GuardianConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveConfig(next);
      return next;
    });
  }, []);

  const setPin = useCallback((pin: string) => update({ pin }), [update]);

  // ───── Alert pipeline ─────
  const sendNow = useCallback(
    async (kind: EventKind) => {
      const loc = await getLocation();
      const text = buildAlertText(kind, loc);
      if (config.contacts.length === 0) {
        toast.error("Sem contatos de emergência cadastrados.");
        return;
      }
      dispatchWhatsApp(config.contacts, text);
      toast.success("Alerta enviado para contatos.");
    },
    [config.contacts],
  );

  const triggerAlert = useCallback(
    (kind: EventKind) => {
      // panic_short: send immediately, no countdown
      if (kind === "panic_short") {
        void sendNow(kind);
        return;
      }
      // Otherwise: countdown with PIN cancel
      setPending({
        id: crypto.randomUUID(),
        kind,
        cancellable: true,
        expiresAt: Date.now() + config.detection.countdownSeconds * 1000,
      });
    },
    [config.detection.countdownSeconds, sendNow],
  );

  // Countdown watcher
  useEffect(() => {
    if (!pending) return;
    const remaining = pending.expiresAt - Date.now();
    if (remaining <= 0) {
      void sendNow(pending.kind);
      setPending(null);
      return;
    }
    const t = window.setTimeout(() => {
      void sendNow(pending.kind);
      setPending(null);
    }, remaining);
    return () => window.clearTimeout(t);
  }, [pending, sendNow]);

  const cancelPending = useCallback(
    (pin: string) => {
      if (!pending) return true;
      if (!config.pin || pin !== config.pin) return false;
      setPending(null);
      // also stop buzzer if it was on
      if (buzzerOn) {
        void sessionRef.current?.sendBuzzer(false);
        setBuzzerOn(false);
      }
      toast.success("Alerta cancelado.");
      return true;
    },
    [pending, config.pin, buzzerOn],
  );

  // ───── BLE ─────
  const handleBleDisconnect = useCallback(() => {
    setBleStatus("disconnected");
    sessionRef.current = null;
    if (!config.detection.bleDisconnect) return;
    // wait up to 60s before alerting
    if (disconnectTimerRef.current) window.clearTimeout(disconnectTimerRef.current);
    disconnectTimerRef.current = window.setTimeout(() => {
      if (bleStatus !== "connected") triggerAlert("ble_disconnect");
    }, 60_000);
    toast.warning("Dispositivo desconectado. Aguardando reconexão…");
  }, [bleStatus, config.detection.bleDisconnect, triggerAlert]);

  const connect = useCallback(async () => {
    if (!isBleSupported()) {
      toast.error("Web Bluetooth não suportado neste navegador. Use Chrome/Edge.");
      return;
    }
    try {
      setBleStatus("connecting");
      const session = await connectBle(config.ble, {
        onEvent: (e) => {
          if (e.type === "short_press") triggerAlert("panic_short");
          else if (e.type === "long_press") {
            void session.sendBuzzer(true);
            setBuzzerOn(true);
            triggerAlert("panic_critical");
          } else if (e.type === "battery") setBattery(e.level);
        },
        onDisconnect: handleBleDisconnect,
      });
      sessionRef.current = session;
      setBleStatus("connected");
      if (disconnectTimerRef.current) {
        window.clearTimeout(disconnectTimerRef.current);
        disconnectTimerRef.current = null;
      }
      toast.success("Tag conectada.");
    } catch (err) {
      setBleStatus("idle");
      toast.error(err instanceof Error ? err.message : "Falha ao conectar.");
    }
  }, [config.ble, handleBleDisconnect, triggerAlert]);

  const disconnect = useCallback(() => {
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    setBleStatus("idle");
  }, []);

  const triggerBuzzer = useCallback(async (on: boolean) => {
    await sessionRef.current?.sendBuzzer(on);
    setBuzzerOn(on);
  }, []);

  // ───── Motion ─────
  useEffect(() => {
    if (!config.onboarded) return;
    if (!config.detection.fall && !config.detection.run) return;
    if (motionRef.current) motionRef.current.stop();
    motionRef.current = startMotionDetection({
      onFall: () => config.detection.fall && triggerAlert("fall"),
      onSuspiciousRun: () => config.detection.run && triggerAlert("suspicious_run"),
    });
    return () => {
      motionRef.current?.stop();
      motionRef.current = null;
    };
  }, [config.onboarded, config.detection.fall, config.detection.run, triggerAlert]);

  const value = useMemo<GuardianCtx>(
    () => ({
      config,
      update,
      setPin,
      bleStatus,
      battery,
      connect,
      disconnect,
      buzzerOn,
      triggerBuzzer,
      pending,
      triggerAlert,
      cancelPending,
      sendNow,
    }),
    [
      config,
      update,
      setPin,
      bleStatus,
      battery,
      connect,
      disconnect,
      buzzerOn,
      triggerBuzzer,
      pending,
      triggerAlert,
      cancelPending,
      sendNow,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGuardian() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGuardian must be used inside GuardianProvider");
  return ctx;
}
