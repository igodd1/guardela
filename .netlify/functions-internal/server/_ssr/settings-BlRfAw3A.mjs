import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-ogDP7hTu.mjs";
import { B as Button } from "./button-DAqmmfFf.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { u as useGuardian, P as PinPad, N as NUS_DEFAULT, c as cn } from "./router-DZMyyuhO.mjs";
import { S as Slider$1, a as SliderTrack, b as SliderRange, c as SliderThumb } from "../_libs/radix-ui__react-slider.mjs";
import { I as Input } from "./input-D4IawD5C.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-collection.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Slider$1,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderTrack, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SliderRange, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Slider$1.displayName;
function Settings() {
  const nav = useNavigate();
  const {
    config,
    update,
    sendNow,
    triggerAlert
  } = useGuardian();
  const [showPin, setShowPin] = reactExports.useState(false);
  const [newPin, setNewPin] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Ajustes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Detecções automáticas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Detecção de queda", description: "Aceleração brusca seguida de imobilidade", checked: config.detection.fall, onChange: (v) => update({
        detection: {
          ...config.detection,
          fall: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Corrida suspeita", description: "Padrão de fuga: passos rápidos e mudanças de direção", checked: config.detection.run, onChange: (v) => update({
        detection: {
          ...config.detection,
          run: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Desconexão Bluetooth", description: "Alerta se a tag se separar do celular por mais de 1 min", checked: config.detection.bleDisconnect, onChange: (v) => update({
        detection: {
          ...config.detection,
          bleDisconnect: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tempo para cancelar alerta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            config.detection.countdownSeconds,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { value: [config.detection.countdownSeconds], min: 15, max: 30, step: 1, onValueChange: (v) => update({
          detection: {
            ...config.detection,
            countdownSeconds: v[0]
          }
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "PIN de segurança" }),
      !showPin ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", className: "w-full", onClick: () => setShowPin(true), children: "Alterar PIN" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PinPad, { value: newPin, onChange: setNewPin, label: "Novo PIN (4 dígitos)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "flex-1", onClick: () => {
            setShowPin(false);
            setNewPin("");
          }, children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", disabled: newPin.length !== 4, onClick: () => {
            update({
              pin: newPin
            });
            setShowPin(false);
            setNewPin("");
            toast.success("PIN atualizado");
          }, children: "Salvar" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Tag Bluetooth (ESP32)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "UUIDs padrão Nordic UART. Ajuste se seu firmware usar outros." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Service UUID", value: config.ble.serviceUuid, onChange: (v) => update({
        ble: {
          ...config.ble,
          serviceUuid: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "TX (notify)", value: config.ble.txCharUuid, onChange: (v) => update({
        ble: {
          ...config.ble,
          txCharUuid: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "RX (write - buzzer)", value: config.ble.rxCharUuid, onChange: (v) => update({
        ble: {
          ...config.ble,
          rxCharUuid: v
        }
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Token toque curto", value: config.ble.shortPressToken, onChange: (v) => update({
          ble: {
            ...config.ble,
            shortPressToken: v
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Token toque longo", value: config.ble.longPressToken, onChange: (v) => update({
          ble: {
            ...config.ble,
            longPressToken: v
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Buzzer ON", value: config.ble.buzzerOnToken, onChange: (v) => update({
          ble: {
            ...config.ble,
            buzzerOnToken: v
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Buzzer OFF", value: config.ble.buzzerOffToken, onChange: (v) => update({
          ble: {
            ...config.ble,
            buzzerOffToken: v
          }
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", onClick: () => update({
        ble: NUS_DEFAULT
      }), children: "Restaurar UUIDs padrão" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Testar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", className: "w-full", onClick: () => triggerAlert("fall"), children: "Simular detecção de queda (com countdown)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", onClick: () => void sendNow("panic_short"), children: "Enviar alerta de teste agora" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full text-destructive", onClick: () => {
      if (confirm("Refazer a configuração inicial?")) {
        update({
          onboarded: false
        });
        void nav({
          to: "/setup"
        });
      }
    }, children: "Refazer configuração" })
  ] }) });
}
function Row({
  label,
  description,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked, onCheckedChange: onChange })
  ] });
}
function Field({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => onChange(e.target.value), className: "mt-1 text-xs font-mono" })
  ] });
}
export {
  Settings as component
};
