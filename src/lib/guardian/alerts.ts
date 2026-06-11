import type { Contact, EventKind } from "./types";

const MESSAGES: Record<EventKind, string> = {
  panic_short: "🚨 GuardEla: a usuária acionou o botão de emergência e solicita ajuda.",
  panic_critical:
    "🚨 GuardEla — EMERGÊNCIA CRÍTICA: alarme sonoro ativado. A usuária precisa de socorro imediato.",
  fall: "⚠️ GuardEla: possível QUEDA detectada. Não houve confirmação da usuária.",
  suspicious_run:
    "⚠️ GuardEla: padrão de CORRIDA SUSPEITA detectado. Sem confirmação da usuária.",
  ble_disconnect:
    "⚠️ GuardEla: o dispositivo foi SEPARADO do celular sem confirmação da usuária.",
};

export function getEventMessage(kind: EventKind): string {
  return MESSAGES[kind];
}

export interface AlertLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export async function getLocation(timeoutMs = 8000): Promise<AlertLocation | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 5000 },
    );
  });
}

export function buildAlertText(kind: EventKind, loc: AlertLocation | null): string {
  const base = getEventMessage(kind);
  const time = new Date().toLocaleString("pt-BR");
  if (!loc) {
    return `${base}\n\nHorário: ${time}\nLocalização: indisponível.`;
  }
  const map = `https://maps.google.com/?q=${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`;
  return `${base}\n\nHorário: ${time}\nLocalização: ${map}`;
}

export function whatsappLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function dispatchWhatsApp(contacts: Contact[], text: string) {
  // Abre em nova aba/janela para não matar o app
  if (contacts.length === 0) return;
  contacts.forEach((c) => {
    const url = whatsappLink(c.phone, text);
    window.open(url, "_blank");
  });
}
