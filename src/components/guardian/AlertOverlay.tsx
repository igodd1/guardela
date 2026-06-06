import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuardian } from "@/lib/guardian/context";
import { PinPad } from "./PinPad";
import { getEventMessage } from "@/lib/guardian/alerts";

export function AlertOverlay() {
  const { pending, cancelPending } = useGuardian();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!pending) {
      setPin("");
      setError(false);
      return;
    }
    const tick = () => setRemaining(Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [pending]);

  if (!pending) return null;

  const tryCancel = (v: string) => {
    const ok = cancelPending(v);
    if (!ok) {
      setError(true);
      setPin("");
      window.setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center px-6 animate-in fade-in">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center pulse-ring">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Alerta detectado</h2>
          <p className="mt-2 text-muted-foreground text-sm">{getEventMessage(pending.kind)}</p>
        </div>
        <div className="text-6xl font-bold tabular-nums text-primary">{remaining}s</div>
        <p className="text-sm text-muted-foreground">
          Digite seu PIN para CANCELAR. Sem confirmação, o alerta será enviado.
        </p>
        <PinPad value={pin} onChange={setPin} onComplete={tryCancel} error={error} />
      </div>
    </div>
  );
}
