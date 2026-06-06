import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, KeyRound, UserPlus, Bluetooth, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinPad } from "@/components/guardian/PinPad";
import { useGuardian } from "@/lib/guardian/context";
import { toast } from "sonner";
import type { Contact } from "@/lib/guardian/types";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [{ title: "GuardEla — Configuração inicial" }],
  }),
  component: Setup,
});

function Setup() {
  const nav = useNavigate();
  const { config, update, setPin, connect, bleStatus } = useGuardian();
  const [step, setStep] = useState(0);

  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pinError, setPinError] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const steps = ["PIN", "Contatos", "Tag", "Pronto"];

  const finish = () => {
    update({ onboarded: true });
    toast.success("GuardEla configurado!");
    void nav({ to: "/" });
  };

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 max-w-md mx-auto w-full">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold">
          Guard<span className="text-primary">Ela</span>
        </h1>
      </div>

      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Crie seu PIN</h2>
              <p className="text-sm text-muted-foreground">
                4 dígitos para cancelar alertas e desligar o buzzer.
              </p>
            </div>
          </div>
          <PinPad value={pin1} onChange={setPin1} label="Digite o PIN" />
          {pin1.length === 4 && (
            <PinPad value={pin2} onChange={setPin2} label="Confirme o PIN" error={pinError} />
          )}
          <Button
            className="w-full"
            disabled={pin1.length !== 4 || pin2.length !== 4}
            onClick={() => {
              if (pin1 !== pin2) {
                setPinError(true);
                setPin2("");
                return;
              }
              setPin(pin1);
              setStep(1);
            }}
          >
            Continuar
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Contatos de emergência</h2>
              <p className="text-sm text-muted-foreground">
                Quem recebe seus alertas via WhatsApp.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {config.contacts.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                </div>
                <button
                  className="text-xs text-destructive"
                  onClick={() =>
                    update({ contacts: config.contacts.filter((x) => x.id !== c.id) })
                  }
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Nome"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              maxLength={60}
            />
            <Input
              placeholder="Telefone com DDI (ex: 5511999999999)"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
              inputMode="tel"
              maxLength={15}
            />
            <Button
              variant="secondary"
              className="w-full"
              disabled={!contactName.trim() || contactPhone.length < 10}
              onClick={() => {
                const c: Contact = {
                  id: crypto.randomUUID(),
                  name: contactName.trim(),
                  phone: contactPhone,
                };
                update({ contacts: [...config.contacts, c] });
                setContactName("");
                setContactPhone("");
              }}
            >
              Adicionar contato
            </Button>
          </div>

          <Button
            className="w-full"
            disabled={config.contacts.length === 0}
            onClick={() => setStep(2)}
          >
            Continuar
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Bluetooth className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Conecte sua tag ESP32</h2>
              <p className="text-sm text-muted-foreground">
                Use Chrome ou Edge. Ligue sua tag e clique abaixo.
              </p>
            </div>
          </div>

          <Button onClick={connect} className="w-full" size="lg">
            {bleStatus === "connected" ? "Conectado ✓" : "Procurar tag"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Sem a tag agora? Você pode pular e parear depois nos Ajustes.
          </p>

          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setStep(3)}>
              Pular
            </Button>
            <Button
              className="flex-1"
              disabled={bleStatus !== "connected"}
              onClick={() => setStep(3)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
            <Check className="w-10 h-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tudo pronto!</h2>
            <p className="text-sm text-muted-foreground mt-2">
              GuardEla está cuidando de você. Mantenha o app aberto durante o uso.
            </p>
          </div>
          <Button onClick={finish} className="w-full" size="lg">
            Começar
          </Button>
        </div>
      )}
    </div>
  );
}
