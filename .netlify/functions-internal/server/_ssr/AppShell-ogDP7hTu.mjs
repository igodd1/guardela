import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as cn } from "./router-DZMyyuhO.mjs";
import { S as Shield, H as House, h as Users, i as Settings } from "../_libs/lucide-react.mjs";
const tabs = [
  { to: "/", label: "Início", icon: House },
  { to: "/contacts", label: "Contatos", icon: Users },
  { to: "/settings", label: "Ajustes", icon: Settings }
];
function BottomNav() {
  const loc = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md grid grid-cols-3", children: tabs.map((t) => {
    const active = loc.pathname === t.to;
    const Icon = t.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: t.to,
        className: cn(
          "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }),
          t.label
        ]
      },
      t.to
    );
  }) }) });
}
function AppShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-5 pt-6 pb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold tracking-tight", children: [
        "Guard",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Ela" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-5 pb-24 max-w-md w-full mx-auto", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  AppShell as A
};
