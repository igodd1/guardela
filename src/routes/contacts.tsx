import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { AppShell } from "@/components/guardian/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuardian } from "@/lib/guardian/context";
import type { Contact } from "@/lib/guardian/types";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "GuardEla — Contatos" }] }),
  component: Contacts,
});

function Contacts() {
  const { config, update } = useGuardian();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const add = () => {
    const c: Contact = { id: crypto.randomUUID(), name: name.trim(), phone };
    update({ contacts: [...config.contacts, c] });
    setName("");
    setPhone("");
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contatos</h2>
        <p className="text-sm text-muted-foreground">
          Receberão seus alertas via WhatsApp com localização atual.
        </p>

        <div className="space-y-2">
          {config.contacts.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhum contato. Adicione abaixo.
            </div>
          )}
          {config.contacts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-card p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">+{c.phone}</div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  update({ contacts: config.contacts.filter((x) => x.id !== c.id) })
                }
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Novo contato
          </div>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          <Input
            placeholder="Telefone com DDI (ex: 5511999999999)"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            inputMode="tel"
            maxLength={15}
          />
          <Button
            className="w-full"
            disabled={!name.trim() || phone.length < 10}
            onClick={add}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
