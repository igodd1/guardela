import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bluetooth,
  BluetoothOff,
  BatteryFull,
  BatteryLow,
  Activity,
  Footprints,
  ShieldAlert,
  Volume2,
  VolumeX,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/guardian/AppShell";
import { useGuardian } from "@/lib/guardian/context";
import { requestMotionPermission } from "@/lib/guardian/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GuardEla — Painel" },
      {
        name: "description",
        content: "Painel principal do GuardEla: status da tag, alerta de pânico e detecções ativas.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const {
    config,
    bleStatus,
    battery,
    connect,
    disconnect,
    buzzerOn,
    triggerBuzzer,
    triggerAlert,
  } = useGuardian();
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    if (!config.onboarded) {
      void nav({ to: "/setup" });
    }
  }, [config.onboarded, nav]);

  useEffect(() => {
    if (config.onboarded) void requestMotionPermission();
  }, [config.onboarded]);

  if (!config.onboarded) return null;

  const startPress = () => {
    setPressing(true);
    const t = window.setTimeout(() => {
      triggerAlert("panic_critical");
      void triggerBuzzer(true);
      setPressing(false);
      setPressTimer(null);
    }, 5000);
    setPressTimer(t);
  };
  const endPress = () => {
    if (pressTimer) window.clearTimeout(pressTimer);
    setPressTimer(null);
    setPressing(false);
  };
  const doubleTap = () => triggerAlert("panic_short");

  const bleColor =
    bleStatus === "connected"
      ? "text-success"
      : bleStatus === "connecting"
        ? "text-warning"
        : "text-muted-foreground";

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Status card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {bleStatus === "connected" ? (
                <Bluetooth className={cn("w-5 h-5", bleColor)} />
              ) : (
                <BluetoothOff className={cn("w-5 h-5", bleColor)} />
              )}
              <div>
                <div className="text-sm font-medium">
                  {bleStatus === "connected" && "Tag conectada"}
                  {bleStatus === "connecting" && "Conectando…"}
                  {bleStatus === "disconnected" && "Desconectada"}
                  {bleStatus === "idle" && "Tag não pareada"}
                </div>
                {battery != null && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    {battery < 20 ? (
                      <BatteryLow className="w-3.5 h-3.5 text-warning" />
                    ) : (
                      <BatteryFull className="w-3.5 h-3.5" />
                    )}
                    Bateria: {battery}%
                  </div>
                )}
              </div>
            </div>
            {bleStatus === "connected" ? (
              <Button size="sm" variant="ghost" onClick={disconnect}>
                Sair
              </Button>
            ) : (
              <Button size="sm" onClick={connect}>
                Parear
              </Button>
            )}
          </div>
        </div>

        {/* Panic button */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Botão de emergência
          </div>
          <button
            onDoubleClick={doubleTap}
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            className={cn(
              "mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg shadow-2xl transition-transform active:scale-95",
              pressing && "scale-95 pulse-ring",
            )}
          >
            {pressing ? "Segure…" : "SOS"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            <strong>Duplo toque</strong>: envia alerta discreto.
            <br />
            <strong>Segurar 5s</strong>: aciona buzzer + alerta crítico.
          </p>
        </div>

        {/* Buzzer control (debug / manual) */}
        {bleStatus === "connected" && (
          <button
            onClick={() => {
              void triggerBuzzer(!buzzerOn);
              toast.info(buzzerOn ? "Buzzer desligado" : "Buzzer ativado");
            }}
            className="w-full rounded-2xl border border-border bg-card p-4 flex items-center justify-between hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              {buzzerOn ? (
                <Volume2 className="w-5 h-5 text-destructive" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                Buzzer {buzzerOn ? "ligado" : "desligado"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Detections row */}
        <div className="grid grid-cols-3 gap-3">
          <DetectionTile
            icon={Activity}
            label="Queda"
            active={config.detection.fall}
          />
          <DetectionTile
            icon={Footprints}
            label="Corrida"
            active={config.detection.run}
          />
          <DetectionTile
            icon={ShieldAlert}
            label="BLE off"
            active={config.detection.bleDisconnect}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          Para detecção de queda/corrida funcionar, conceda permissão de sensores e mantenha o
          aplicativo aberto.
        </p>
      </div>
    </AppShell>
  );
}

function DetectionTile({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-center",
        active ? "border-primary/40 bg-primary/5" : "border-border bg-card opacity-60",
      )}
    >
      <Icon className={cn("w-5 h-5 mx-auto", active ? "text-primary" : "text-muted-foreground")} />
      <div className="text-xs mt-1.5 font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground">{active ? "ativo" : "desligado"}</div>
    </div>
  );
}
