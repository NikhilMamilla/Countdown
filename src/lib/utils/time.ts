export interface HmsParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export function msToHms(ms: number): HmsParts {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}
