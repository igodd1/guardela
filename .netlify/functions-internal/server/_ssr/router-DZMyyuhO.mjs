import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast, T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { T as TriangleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-B0CjdJDR.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const NUS_DEFAULT = {
  serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  txCharUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
  rxCharUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
  shortPressToken: "BTN_SHORT",
  longPressToken: "BTN_LONG",
  buzzerOnToken: "BUZZ_ON",
  buzzerOffToken: "BUZZ_OFF"
};
const DEFAULT_CONFIG = {
  pin: null,
  contacts: [],
  ble: NUS_DEFAULT,
  detection: { fall: true, run: true, bleDisconnect: true, countdownSeconds: 20 },
  onboarded: false
};
const KEY = "guardela.config.v1";
function loadConfig() {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      ble: { ...DEFAULT_CONFIG.ble, ...parsed.ble ?? {} },
      detection: { ...DEFAULT_CONFIG.detection, ...parsed.detection ?? {} },
      contacts: parsed.contacts ?? []
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}
function saveConfig(config) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(config));
}
function isBleSupported() {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}
async function connectBle(cfg, handlers) {
  if (!isBleSupported()) throw new Error("Web Bluetooth não disponível neste navegador.");
  const nav = navigator;
  const device = await nav.bluetooth.requestDevice({
    filters: [{ services: [cfg.serviceUuid] }],
    optionalServices: [cfg.serviceUuid]
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(cfg.serviceUuid);
  const txChar = await service.getCharacteristic(cfg.txCharUuid);
  const rxChar = await service.getCharacteristic(cfg.rxCharUuid).catch(() => null);
  const decoder = new TextDecoder();
  txChar.addEventListener("characteristicvaluechanged", (ev) => {
    const value = ev.target.value;
    if (!value) return;
    const text = decoder.decode(value).trim();
    if (text === cfg.shortPressToken) handlers.onEvent({ type: "short_press" });
    else if (text === cfg.longPressToken) handlers.onEvent({ type: "long_press" });
    else if (text.startsWith("BAT:")) {
      const lvl = parseInt(text.slice(4), 10);
      if (!isNaN(lvl)) handlers.onEvent({ type: "battery", level: lvl });
    } else handlers.onEvent({ type: "raw", text });
  });
  await txChar.startNotifications();
  device.addEventListener("gattserverdisconnected", handlers.onDisconnect);
  const encoder = new TextEncoder();
  return {
    device,
    disconnect: () => {
      try {
        device.gatt?.disconnect();
      } catch {
      }
    },
    sendBuzzer: async (on) => {
      if (!rxChar) return;
      const token = on ? cfg.buzzerOnToken : cfg.buzzerOffToken;
      await rxChar.writeValueWithoutResponse(encoder.encode(token));
    }
  };
}
async function requestMotionPermission() {
  const anyDM = window.DeviceMotionEvent;
  if (anyDM && typeof anyDM.requestPermission === "function") {
    try {
      const res = await anyDM.requestPermission();
      return res === "granted";
    } catch {
      return false;
    }
  }
  return true;
}
function startMotionDetection(h) {
  const FALL_SPIKE = 25;
  const FALL_STILL_WINDOW = 1500;
  const FALL_STILL_THRESHOLD = 1.5;
  const RUN_WINDOW = 4e3;
  const RUN_PEAK_COUNT = 14;
  const RUN_PEAK_THRESHOLD = 14;
  const RUN_DIR_CHANGES = 4;
  let lastSpikeAt = 0;
  let stillStartAt = 0;
  const peaks = [];
  const dirChanges = [];
  let lastAlpha = null;
  let lastFallFiredAt = 0;
  let lastRunFiredAt = 0;
  function onMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const linear = Math.abs(mag - 9.81);
    const now = Date.now();
    if (linear > FALL_SPIKE) {
      lastSpikeAt = now;
      stillStartAt = 0;
    } else if (lastSpikeAt && now - lastSpikeAt < 4e3) {
      if (linear < FALL_STILL_THRESHOLD) {
        if (!stillStartAt) stillStartAt = now;
        else if (now - stillStartAt > FALL_STILL_WINDOW && now - lastFallFiredAt > 3e4) {
          lastFallFiredAt = now;
          lastSpikeAt = 0;
          stillStartAt = 0;
          h.onFall();
        }
      } else {
        stillStartAt = 0;
      }
    }
    if (linear > RUN_PEAK_THRESHOLD) {
      peaks.push(now);
    }
    while (peaks.length && now - peaks[0] > RUN_WINDOW) peaks.shift();
    if (peaks.length >= RUN_PEAK_COUNT && dirChanges.length >= RUN_DIR_CHANGES && now - lastRunFiredAt > 45e3) {
      lastRunFiredAt = now;
      peaks.length = 0;
      dirChanges.length = 0;
      h.onSuspiciousRun();
    }
  }
  function onOrient(e) {
    if (e.alpha == null) return;
    const now = Date.now();
    if (lastAlpha != null) {
      let d = Math.abs(e.alpha - lastAlpha);
      if (d > 180) d = 360 - d;
      if (d > 35) dirChanges.push(now);
    }
    lastAlpha = e.alpha;
    while (dirChanges.length && now - dirChanges[0] > RUN_WINDOW) dirChanges.shift();
  }
  window.addEventListener("devicemotion", onMotion);
  window.addEventListener("deviceorientation", onOrient);
  return {
    stop() {
      window.removeEventListener("devicemotion", onMotion);
      window.removeEventListener("deviceorientation", onOrient);
    }
  };
}
const MESSAGES = {
  panic_short: "🚨 GuardEla: a usuária acionou o botão de emergência e solicita ajuda.",
  panic_critical: "🚨 GuardEla — EMERGÊNCIA CRÍTICA: alarme sonoro ativado. A usuária precisa de socorro imediato.",
  fall: "⚠️ GuardEla: possível QUEDA detectada. Não houve confirmação da usuária.",
  suspicious_run: "⚠️ GuardEla: padrão de CORRIDA SUSPEITA detectado. Sem confirmação da usuária.",
  ble_disconnect: "⚠️ GuardEla: o dispositivo foi SEPARADO do celular sem confirmação da usuária."
};
function getEventMessage(kind) {
  return MESSAGES[kind];
}
async function getLocation(timeoutMs = 8e3) {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 5e3 }
    );
  });
}
function buildAlertText(kind, loc) {
  const base = getEventMessage(kind);
  const time = (/* @__PURE__ */ new Date()).toLocaleString("pt-BR");
  if (!loc) {
    return `${base}

Horário: ${time}
Localização: indisponível.`;
  }
  const map = `https://maps.google.com/?q=${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`;
  return `${base}

Horário: ${time}
Localização: ${map}`;
}
function whatsappLink(phone, text) {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
function dispatchWhatsApp(contacts, text) {
  if (contacts.length === 0) return;
  contacts.forEach((c, i) => {
    const url = whatsappLink(c.phone, text);
    if (i === 0) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  });
}
const Ctx = reactExports.createContext(null);
function GuardianProvider({ children }) {
  const [config, setConfig] = reactExports.useState(DEFAULT_CONFIG);
  const [bleStatus, setBleStatus] = reactExports.useState("idle");
  const [battery, setBattery] = reactExports.useState(null);
  const [buzzerOn, setBuzzerOn] = reactExports.useState(false);
  const [pending, setPending] = reactExports.useState(null);
  const sessionRef = reactExports.useRef(null);
  const motionRef = reactExports.useRef(null);
  const disconnectTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setConfig(loadConfig());
  }, []);
  const update = reactExports.useCallback((patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveConfig(next);
      return next;
    });
  }, []);
  const setPin = reactExports.useCallback((pin) => update({ pin }), [update]);
  const sendNow = reactExports.useCallback(
    async (kind) => {
      const loc = await getLocation();
      const text = buildAlertText(kind, loc);
      if (config.contacts.length === 0) {
        toast.error("Sem contatos de emergência cadastrados.");
        return;
      }
      dispatchWhatsApp(config.contacts, text);
      toast.success("Alerta enviado para contatos.");
    },
    [config.contacts]
  );
  const triggerAlert = reactExports.useCallback(
    (kind) => {
      if (kind === "panic_short") {
        void sendNow(kind);
        return;
      }
      setPending({
        id: crypto.randomUUID(),
        kind,
        cancellable: true,
        expiresAt: Date.now() + config.detection.countdownSeconds * 1e3
      });
    },
    [config.detection.countdownSeconds, sendNow]
  );
  reactExports.useEffect(() => {
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
  const cancelPending = reactExports.useCallback(
    (pin) => {
      if (!pending) return true;
      if (!config.pin || pin !== config.pin) return false;
      setPending(null);
      if (buzzerOn) {
        void sessionRef.current?.sendBuzzer(false);
        setBuzzerOn(false);
      }
      toast.success("Alerta cancelado.");
      return true;
    },
    [pending, config.pin, buzzerOn]
  );
  const handleBleDisconnect = reactExports.useCallback(() => {
    setBleStatus("disconnected");
    sessionRef.current = null;
    if (!config.detection.bleDisconnect) return;
    if (disconnectTimerRef.current) window.clearTimeout(disconnectTimerRef.current);
    disconnectTimerRef.current = window.setTimeout(() => {
      if (bleStatus !== "connected") triggerAlert("ble_disconnect");
    }, 6e4);
    toast.warning("Dispositivo desconectado. Aguardando reconexão…");
  }, [bleStatus, config.detection.bleDisconnect, triggerAlert]);
  const connect = reactExports.useCallback(async () => {
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
        onDisconnect: handleBleDisconnect
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
  const disconnect = reactExports.useCallback(() => {
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    setBleStatus("idle");
  }, []);
  const triggerBuzzer = reactExports.useCallback(async (on) => {
    await sessionRef.current?.sendBuzzer(on);
    setBuzzerOn(on);
  }, []);
  reactExports.useEffect(() => {
    if (!config.onboarded) return;
    if (!config.detection.fall && !config.detection.run) return;
    if (motionRef.current) motionRef.current.stop();
    motionRef.current = startMotionDetection({
      onFall: () => config.detection.fall && triggerAlert("fall"),
      onSuspiciousRun: () => config.detection.run && triggerAlert("suspicious_run")
    });
    return () => {
      motionRef.current?.stop();
      motionRef.current = null;
    };
  }, [config.onboarded, config.detection.fall, config.detection.run, triggerAlert]);
  const value = reactExports.useMemo(
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
      sendNow
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
      sendNow
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useGuardian() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useGuardian must be used inside GuardianProvider");
  return ctx;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function PinPad({ length = 4, value, onChange, onComplete, error, label }) {
  const inputRef = reactExports.useRef(null);
  const [focused, setFocused] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (value.length === length && onComplete) onComplete(value);
  }, [value, length, onComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 select-none", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "flex gap-3",
        onClick: () => inputRef.current?.focus(),
        children: Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-14 w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-semibold transition-all",
                error ? "border-destructive" : filled ? "border-primary bg-primary/10" : "border-border bg-card",
                focused && i === value.length && "ring-2 ring-primary"
              ),
              children: filled ? "●" : ""
            },
            i
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "tel",
        inputMode: "numeric",
        autoComplete: "one-time-code",
        pattern: "[0-9]*",
        value,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        onChange: (e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, length);
          onChange(v);
        },
        className: "sr-only"
      }
    )
  ] });
}
function AlertOverlay() {
  const { pending, cancelPending } = useGuardian();
  const [pin, setPin] = reactExports.useState("");
  const [error, setError] = reactExports.useState(false);
  const [remaining, setRemaining] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!pending) {
      setPin("");
      setError(false);
      return;
    }
    const tick = () => setRemaining(Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1e3)));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [pending]);
  if (!pending) return null;
  const tryCancel = (v) => {
    const ok = cancelPending(v);
    if (!ok) {
      setError(true);
      setPin("");
      window.setTimeout(() => setError(false), 600);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center px-6 animate-in fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full text-center space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center pulse-ring", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-destructive" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Alerta detectado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground text-sm", children: getEventMessage(pending.kind) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-6xl font-bold tabular-nums text-primary", children: [
      remaining,
      "s"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Digite seu PIN para CANCELAR. Sem confirmação, o alerta será enviado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PinPad, { value: pin, onChange: setPin, onComplete: tryCancel, error })
  ] }) });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Página não encontrada." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Voltar ao início"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Tentar novamente"
      }
    )
  ] }) });
}
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#2a1240" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "GuardEla" },
      { title: "GuardEla — sua segurança em um toque" },
      {
        name: "description",
        content: "GuardEla conecta sua tag Bluetooth ao celular para enviar alertas de emergência com localização aos seus contatos de confiança."
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$4.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GuardianProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) });
}
const $$splitComponentImporter$3 = () => import("./setup-WFVvNS_B.mjs");
const Route$3 = createFileRoute("/setup")({
  head: () => ({
    meta: [{
      title: "GuardEla — Configuração inicial"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./settings-BlRfAw3A.mjs");
const Route$2 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "GuardEla — Ajustes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./contacts-CCWDC_z0.mjs");
const Route$1 = createFileRoute("/contacts")({
  head: () => ({
    meta: [{
      title: "GuardEla — Contatos"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-C7RQ8qbk.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "GuardEla — Painel"
    }, {
      name: "description",
      content: "Painel principal do GuardEla: status da tag, alerta de pânico e detecções ativas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SetupRoute = Route$3.update({
  id: "/setup",
  path: "/setup",
  getParentRoute: () => Route$4
});
const SettingsRoute = Route$2.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$4
});
const ContactsRoute = Route$1.update({
  id: "/contacts",
  path: "/contacts",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  ContactsRoute,
  SettingsRoute,
  SetupRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  NUS_DEFAULT as N,
  PinPad as P,
  router as a,
  cn as c,
  requestMotionPermission as r,
  useGuardian as u
};
