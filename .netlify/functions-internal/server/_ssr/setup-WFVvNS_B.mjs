import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DAqmmfFf.mjs";
import { I as Input } from "./input-D4IawD5C.mjs";
import { u as useGuardian, P as PinPad } from "./router-DZMyyuhO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Shield, K as KeyRound, U as UserPlus, B as Bluetooth, C as Check } from "../_libs/lucide-react.mjs";
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
function Setup() {
  const nav = useNavigate();
  const {
    config,
    update,
    setPin,
    connect,
    bleStatus
  } = useGuardian();
  const [step, setStep] = reactExports.useState(0);
  const [pin1, setPin1] = reactExports.useState("");
  const [pin2, setPin2] = reactExports.useState("");
  const [pinError, setPinError] = reactExports.useState(false);
  const [contactName, setContactName] = reactExports.useState("");
  const [contactPhone, setContactPhone] = reactExports.useState("");
  const steps = ["PIN", "Contatos", "Tag", "Pronto"];
  const finish = () => {
    update({
      onboarded: true
    });
    toast.success("GuardEla configurado!");
    void nav({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh flex flex-col px-6 py-8 max-w-md mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold", children: [
        "Guard",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Ela" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 mb-8", children: steps.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}` }, i)) }),
    step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Crie seu PIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "4 dígitos para cancelar alertas e desligar o buzzer." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PinPad, { value: pin1, onChange: setPin1, label: "Digite o PIN" }),
      pin1.length === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(PinPad, { value: pin2, onChange: setPin2, label: "Confirme o PIN", error: pinError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: pin1.length !== 4 || pin2.length !== 4, onClick: () => {
        if (pin1 !== pin2) {
          setPinError(true);
          setPin2("");
          return;
        }
        setPin(pin1);
        setStep(1);
      }, children: "Continuar" })
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Contatos de emergência" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Quem recebe seus alertas via WhatsApp." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: config.contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.phone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-destructive", onClick: () => update({
          contacts: config.contacts.filter((x) => x.id !== c.id)
        }), children: "Remover" })
      ] }, c.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nome", value: contactName, onChange: (e) => setContactName(e.target.value), maxLength: 60 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Telefone com DDI (ex: 5511999999999)", value: contactPhone, onChange: (e) => setContactPhone(e.target.value.replace(/\D/g, "")), inputMode: "tel", maxLength: 15 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", className: "w-full", disabled: !contactName.trim() || contactPhone.length < 10, onClick: () => {
          const c = {
            id: crypto.randomUUID(),
            name: contactName.trim(),
            phone: contactPhone
          };
          update({
            contacts: [...config.contacts, c]
          });
          setContactName("");
          setContactPhone("");
        }, children: "Adicionar contato" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: config.contacts.length === 0, onClick: () => setStep(2), children: "Continuar" })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bluetooth, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Conecte sua tag ESP32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Use Chrome ou Edge. Ligue sua tag e clique abaixo." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: connect, className: "w-full", size: "lg", children: bleStatus === "connected" ? "Conectado ✓" : "Procurar tag" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Sem a tag agora? Você pode pular e parear depois nos Ajustes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "flex-1", onClick: () => setStep(3), children: "Pular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", disabled: bleStatus !== "connected", onClick: () => setStep(3), children: "Continuar" })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 flex-1 flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-success/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-10 h-10 text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Tudo pronto!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "GuardEla está cuidando de você. Mantenha o app aberto durante o uso." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: finish, className: "w-full", size: "lg", children: "Começar" })
    ] })
  ] });
}
export {
  Setup as component
};
