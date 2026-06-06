import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DAqmmfFf.mjs";
import { A as AppShell } from "./AppShell-ogDP7hTu.mjs";
import { u as useGuardian, r as requestMotionPermission, c as cn } from "./router-DZMyyuhO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Bluetooth, b as BluetoothOff, c as BatteryLow, d as BatteryFull, V as Volume2, e as VolumeX, f as ChevronRight, A as Activity, F as Footprints, g as ShieldAlert } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tailwind-merge.mjs";
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
    triggerAlert
  } = useGuardian();
  const [pressTimer, setPressTimer] = reactExports.useState(null);
  const [pressing, setPressing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!config.onboarded) {
      void nav({
        to: "/setup"
      });
    }
  }, [config.onboarded, nav]);
  reactExports.useEffect(() => {
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
    }, 5e3);
    setPressTimer(t);
  };
  const endPress = () => {
    if (pressTimer) window.clearTimeout(pressTimer);
    setPressTimer(null);
    setPressing(false);
  };
  const doubleTap = () => triggerAlert("panic_short");
  const bleColor = bleStatus === "connected" ? "text-success" : bleStatus === "connecting" ? "text-warning" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        bleStatus === "connected" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bluetooth, { className: cn("w-5 h-5", bleColor) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BluetoothOff, { className: cn("w-5 h-5", bleColor) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
            bleStatus === "connected" && "Tag conectada",
            bleStatus === "connecting" && "Conectando…",
            bleStatus === "disconnected" && "Desconectada",
            bleStatus === "idle" && "Tag não pareada"
          ] }),
          battery != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
            battery < 20 ? /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryLow, { className: "w-3.5 h-3.5 text-warning" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryFull, { className: "w-3.5 h-3.5" }),
            "Bateria: ",
            battery,
            "%"
          ] })
        ] })
      ] }),
      bleStatus === "connected" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: disconnect, children: "Sair" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: connect, children: "Parear" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-4", children: "Botão de emergência" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onDoubleClick: doubleTap, onMouseDown: startPress, onMouseUp: endPress, onMouseLeave: endPress, onTouchStart: startPress, onTouchEnd: endPress, className: cn("mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg shadow-2xl transition-transform active:scale-95", pressing && "scale-95 pulse-ring"), children: pressing ? "Segure…" : "SOS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Duplo toque" }),
        ": envia alerta discreto.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Segurar 5s" }),
        ": aciona buzzer + alerta crítico."
      ] })
    ] }),
    bleStatus === "connected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      void triggerBuzzer(!buzzerOn);
      toast.info(buzzerOn ? "Buzzer desligado" : "Buzzer ativado");
    }, className: "w-full rounded-2xl border border-border bg-card p-4 flex items-center justify-between hover:bg-secondary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        buzzerOn ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-5 h-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
          "Buzzer ",
          buzzerOn ? "ligado" : "desligado"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DetectionTile, { icon: Activity, label: "Queda", active: config.detection.fall }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DetectionTile, { icon: Footprints, label: "Corrida", active: config.detection.run }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DetectionTile, { icon: ShieldAlert, label: "BLE off", active: config.detection.bleDisconnect })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center px-4", children: "Para detecção de queda/corrida funcionar, conceda permissão de sensores e mantenha o aplicativo aberto." })
  ] }) });
}
function DetectionTile({
  icon: Icon,
  label,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border p-3 text-center", active ? "border-primary/40 bg-primary/5" : "border-border bg-card opacity-60"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("w-5 h-5 mx-auto", active ? "text-primary" : "text-muted-foreground") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-1.5 font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: active ? "ativo" : "desligado" })
  ] });
}
export {
  Dashboard as component
};
