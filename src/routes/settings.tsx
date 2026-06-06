import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/guardian/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { PinPad } from "@/components/guardian/PinPad";
import { useGuardian } from "@/lib/guardian/context";
import { NUS_DEFAULT } from "@/lib/guardian/types";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "GuardEla — Ajustes" }] }),
  component: Settings,
});

function Settings() {
  const nav = useNavigate();
  const { config, update, sendNow, triggerAlert } = useGuardian();
  const [showPin, setShowPin] = useState(false);
  const [newPin, setNewPin] = useState("");

  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Ajustes</h2>

        {/* Detection */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <h3 className="font-semibold">Detecções automáticas</h3>
          <Row
            label="Detecção de queda"
            description="Aceleração brusca seguida de imobilidade"
            checked={config.detection.fall}
            onChange={(v) => update({ detection: { ...config.detection, fall: v } })}
          />
          <Row
            label="Corrida suspeita"
            description="Padrão de fuga: passos rápidos e mudanças de direção"
            checked={config.detection.run}
            onChange={(v) => update({ detection: { ...config.detection, run: v } })}
          />
          <Row
            label="Desconexão Bluetooth"
            description="Alerta se a tag se separar do celular por mais de 1 min"
            checked={config.detection.bleDisconnect}
            onChange={(v) =>
              update({ detection: { ...config.detection, bleDisconnect: v } })
            }
          />
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tempo para cancelar alerta</span>
              <span className="text-muted-foreground">
                {config.detection.countdownSeconds}s
              </span>
            </div>
            <Slider
              value={[config.detection.countdownSeconds]}
              min={15}
              max={30}
              step={1}
              onValueChange={(v) =>
                update({ detection: { ...config.detection, countdownSeconds: v[0] } })
              }
            />
          </div>
        </section>

        {/* PIN */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-semibold">PIN de segurança</h3>
          {!showPin ? (
            <Button variant="secondary" className="w-full" onClick={() => setShowPin(true)}>
              Alterar PIN
            </Button>
          ) : (
            <div className="space-y-3">
              <PinPad value={newPin} onChange={setNewPin} label="Novo PIN (4 dígitos)" />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setShowPin(false);
                    setNewPin("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  disabled={newPin.length !== 4}
                  onClick={() => {
                    update({ pin: newPin });
                    setShowPin(false);
                    setNewPin("");
                    toast.success("PIN atualizado");
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* BLE config */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-semibold">Tag Bluetooth (ESP32)</h3>
          <p className="text-xs text-muted-foreground">
            UUIDs padrão Nordic UART. Ajuste se seu firmware usar outros.
          </p>
          <Field
            label="Service UUID"
            value={config.ble.serviceUuid}
            onChange={(v) => update({ ble: { ...config.ble, serviceUuid: v } })}
          />
          <Field
            label="TX (notify)"
            value={config.ble.txCharUuid}
            onChange={(v) => update({ ble: { ...config.ble, txCharUuid: v } })}
          />
          <Field
            label="RX (write - buzzer)"
            value={config.ble.rxCharUuid}
            onChange={(v) => update({ ble: { ...config.ble, rxCharUuid: v } })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Token toque curto"
              value={config.ble.shortPressToken}
              onChange={(v) => update({ ble: { ...config.ble, shortPressToken: v } })}
            />
            <Field
              label="Token toque longo"
              value={config.ble.longPressToken}
              onChange={(v) => update({ ble: { ...config.ble, longPressToken: v } })}
            />
            <Field
              label="Buzzer ON"
              value={config.ble.buzzerOnToken}
              onChange={(v) => update({ ble: { ...config.ble, buzzerOnToken: v } })}
            />
            <Field
              label="Buzzer OFF"
              value={config.ble.buzzerOffToken}
              onChange={(v) => update({ ble: { ...config.ble, buzzerOffToken: v } })}
            />
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => update({ ble: NUS_DEFAULT })}
          >
            Restaurar UUIDs padrão
          </Button>
        </section>

        {/* Test */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <h3 className="font-semibold">Testar</h3>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => triggerAlert("fall")}
          >
            Simular detecção de queda (com countdown)
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void sendNow("panic_short")}
          >
            Enviar alerta de teste agora
          </Button>
        </section>

        <Button
          variant="ghost"
          className="w-full text-destructive"
          onClick={() => {
            if (confirm("Refazer a configuração inicial?")) {
              update({ onboarded: false });
              void nav({ to: "/setup" });
            }
          }}
        >
          Refazer configuração
        </Button>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 text-xs font-mono"
      />
    </label>
  );
}
