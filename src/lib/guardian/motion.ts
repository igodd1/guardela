// Heurísticas de detecção de queda e corrida suspeita via DeviceMotion.
// Tudo client-side, requer permissão (iOS) e https.

export interface MotionHandlers {
  onFall: () => void;
  onSuspiciousRun: () => void;
}

export interface MotionController {
  stop: () => void;
}

export async function requestMotionPermission(): Promise<boolean> {
  const anyDM = (window as any).DeviceMotionEvent;
  if (anyDM && typeof anyDM.requestPermission === "function") {
    try {
      const res = await anyDM.requestPermission();
      return res === "granted";
    } catch {
      return false;
    }
  }
  return true; // Android/desktop: no prompt needed
}

export function startMotionDetection(h: MotionHandlers): MotionController {
  const FALL_SPIKE = 25; // m/s² total accel spike
  const FALL_STILL_WINDOW = 1500; // ms of stillness after spike
  const FALL_STILL_THRESHOLD = 1.5; // m/s² variation considered "still"
  const RUN_WINDOW = 4000; // ms
  const RUN_PEAK_COUNT = 14; // peaks in window to flag intense pace
  const RUN_PEAK_THRESHOLD = 14; // m/s²
  const RUN_DIR_CHANGES = 4; // sharp orientation changes in window

  let lastSpikeAt = 0;
  let stillStartAt = 0;
  const peaks: number[] = [];
  const dirChanges: number[] = [];
  let lastAlpha: number | null = null;
  let lastFallFiredAt = 0;
  let lastRunFiredAt = 0;

  function onMotion(e: DeviceMotionEvent) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const linear = Math.abs(mag - 9.81);
    const now = Date.now();

    // Fall: spike then stillness
    if (linear > FALL_SPIKE) {
      lastSpikeAt = now;
      stillStartAt = 0;
    } else if (lastSpikeAt && now - lastSpikeAt < 4000) {
      if (linear < FALL_STILL_THRESHOLD) {
        if (!stillStartAt) stillStartAt = now;
        else if (now - stillStartAt > FALL_STILL_WINDOW && now - lastFallFiredAt > 30_000) {
          lastFallFiredAt = now;
          lastSpikeAt = 0;
          stillStartAt = 0;
          h.onFall();
        }
      } else {
        stillStartAt = 0;
      }
    }

    // Run: count peaks
    if (linear > RUN_PEAK_THRESHOLD) {
      peaks.push(now);
    }
    while (peaks.length && now - peaks[0] > RUN_WINDOW) peaks.shift();

    if (
      peaks.length >= RUN_PEAK_COUNT &&
      dirChanges.length >= RUN_DIR_CHANGES &&
      now - lastRunFiredAt > 45_000
    ) {
      lastRunFiredAt = now;
      peaks.length = 0;
      dirChanges.length = 0;
      h.onSuspiciousRun();
    }
  }

  function onOrient(e: DeviceOrientationEvent) {
    if (e.alpha == null) return;
    const now = Date.now();
    if (lastAlpha != null) {
      let d = Math.abs(e.alpha - lastAlpha);
      if (d > 180) d = 360 - d;
      if (d > 35) dirChanges.push(now);
    }
    lastAlpha = e.alpha;
    while (dirChanges.length && now - dirChanges[0] > RUN_WINDOW) dirChanges.shift();
  }

  window.addEventListener("devicemotion", onMotion);
  window.addEventListener("deviceorientation", onOrient);

  return {
    stop() {
      window.removeEventListener("devicemotion", onMotion);
      window.removeEventListener("deviceorientation", onOrient);
    },
  };
}
