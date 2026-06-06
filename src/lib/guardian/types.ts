export type EventKind =
  | "panic_short"
  | "panic_critical"
  | "fall"
  | "suspicious_run"
  | "ble_disconnect";

export interface Contact {
  id: string;
  name: string;
  phone: string; // E.164 ish, only digits
}

export interface BleConfig {
  serviceUuid: string;
  txCharUuid: string; // notify from device -> phone
  rxCharUuid: string; // write from phone -> device (buzzer)
  // Protocol tokens the firmware sends
  shortPressToken: string;
  longPressToken: string;
  // Tokens to write back
  buzzerOnToken: string;
  buzzerOffToken: string;
}

export interface DetectionConfig {
  fall: boolean;
  run: boolean;
  bleDisconnect: boolean;
  countdownSeconds: number; // 15-30
}

export interface GuardianConfig {
  pin: string | null;
  contacts: Contact[];
  ble: BleConfig;
  detection: DetectionConfig;
  onboarded: boolean;
}

export const NUS_DEFAULT: BleConfig = {
  serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  txCharUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
  rxCharUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
  shortPressToken: "BTN_SHORT",
  longPressToken: "BTN_LONG",
  buzzerOnToken: "BUZZ_ON",
  buzzerOffToken: "BUZZ_OFF",
};

export const DEFAULT_CONFIG: GuardianConfig = {
  pin: null,
  contacts: [],
  ble: NUS_DEFAULT,
  detection: { fall: true, run: true, bleDisconnect: true, countdownSeconds: 20 },
  onboarded: false,
};
