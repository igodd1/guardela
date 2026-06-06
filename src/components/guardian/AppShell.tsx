import { Link, useLocation } from "@tanstack/react-router";
import { Shield, Users, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/contacts", label: "Contatos", icon: Users },
  { to: "/settings", label: "Ajustes", icon: Settings },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-md grid grid-cols-3">
        {tabs.map((t) => {
          const active = loc.pathname === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-5 pt-6 pb-3 flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">
          Guard<span className="text-primary">Ela</span>
        </h1>
      </header>
      <main className="flex-1 px-5 pb-24 max-w-md w-full mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
