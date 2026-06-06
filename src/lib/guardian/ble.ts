import type { BleConfig } from "./types";

export type BleEvent =
  | { type: "short_press" }
  | { type: "long_press" }
  | { type: "battery"; level: number }
  | { type: "raw"; text: string };

export interface BleSession {
  device: any;
  disconnect: () => void;
  sendBuzzer: (on: boolean) => Promise<void>;
}

export function isBleSupported(): boolean {
  return typeof navigator !== "undefined" && !!(navigator as any).bluetooth;
}

export async function connectBle(
  cfg: BleConfig,
  handlers: {
    onEvent: (e: BleEvent) => void;
    onDisconnect: () => void;
  },
): Promise<BleSession> {
  if (!isBleSupported()) throw new Error("Web Bluetooth não disponível neste navegador.");

  const nav = navigator as Navigator & { bluetooth: any };
  const device: any = await nav.bluetooth.requestDevice({
    filters: [{ services: [cfg.serviceUuid] }],
    optionalServices: [cfg.serviceUuid],
  });

  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(cfg.serviceUuid);
  const txChar = await service.getCharacteristic(cfg.txCharUuid);
  const rxChar = await service.getCharacteristic(cfg.rxCharUuid).catch(() => null);

  const decoder = new TextDecoder();
  txChar.addEventListener("characteristicvaluechanged", (ev: Event) => {
    const value = (ev.target as any).value as DataView | undefined;
    if (!value) return;
    const text = decoder.decode(value).trim();
    if (text === cfg.shortPressToken) handlers.onEvent({ type: "short_press" });
    else if (text === cfg.longPressToken) handlers.onEvent({ type: "long_press" });
    else if (text.startsWith("BAT:")) {
      const lvl = parseInt(text.slice(4), 10);
      if (!isNaN(lvl)) handlers.onEvent({ type: "battery", level: lvl });
    } else handlers.onEvent({ type: "raw", text });
  });
  await txChar.startNotifications();

  device.addEventListener("gattserverdisconnected", handlers.onDisconnect);

  const encoder = new TextEncoder();
  return {
    device,
    disconnect: () => {
      try {
        device.gatt?.disconnect();
      } catch {}
    },
    sendBuzzer: async (on: boolean) => {
      if (!rxChar) return;
      const token = on ? cfg.buzzerOnToken : cfg.buzzerOffToken;
      await rxChar.writeValueWithoutResponse(encoder.encode(token));
    },
  };
}
