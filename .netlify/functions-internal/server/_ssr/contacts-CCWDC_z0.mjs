import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-ogDP7hTu.mjs";
import { B as Button } from "./button-DAqmmfFf.mjs";
import { I as Input } from "./input-D4IawD5C.mjs";
import { u as useGuardian } from "./router-DZMyyuhO.mjs";
import "../_libs/sonner.mjs";
import { a as Trash2, U as UserPlus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Contacts() {
  const {
    config,
    update
  } = useGuardian();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const add = () => {
    const c = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone
    };
    update({
      contacts: [...config.contacts, c]
    });
    setName("");
    setPhone("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Contatos" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receberão seus alertas via WhatsApp com localização atual." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      config.contacts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: "Nenhum contato. Adicione abaixo." }),
      config.contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "+",
            c.phone
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => update({
          contacts: config.contacts.filter((x) => x.id !== c.id)
        }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })
      ] }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
        " Novo contato"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nome", value: name, onChange: (e) => setName(e.target.value), maxLength: 60 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Telefone com DDI (ex: 5511999999999)", value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "")), inputMode: "tel", maxLength: 15 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !name.trim() || phone.length < 10, onClick: add, children: "Adicionar" })
    ] })
  ] }) });
}
export {
  Contacts as component
};
