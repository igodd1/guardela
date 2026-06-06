import { DEFAULT_CONFIG, type GuardianConfig } from "./types";

const KEY = "guardela.config.v1";

export function loadConfig(): GuardianConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<GuardianConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      ble: { ...DEFAULT_CONFIG.ble, ...(parsed.ble ?? {}) },
      detection: { ...DEFAULT_CONFIG.detection, ...(parsed.detection ?? {}) },
      contacts: parsed.contacts ?? [],
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: GuardianConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(config));
}
