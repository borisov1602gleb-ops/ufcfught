// Декоративные данные хаба из дизайн-макета (водяной знак «весы» + частицы).

export interface ScalePath {
  d: string;
  len: number;
  delay: number;
}

export const SCALE_PATHS: ScalePath[] = [
  { d: "M150 70 L150 230", len: 170, delay: 0 },
  { d: "M70 110 L230 110", len: 170, delay: 0.3 },
  { d: "M150 78 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0", len: 60, delay: 0.5 },
  { d: "M70 110 L52 180", len: 80, delay: 0.6 },
  { d: "M70 110 L88 180", len: 80, delay: 0.65 },
  { d: "M44 180 C44 204 96 204 96 180", len: 120, delay: 0.9 },
  { d: "M230 110 L212 180", len: 80, delay: 0.7 },
  { d: "M230 110 L248 180", len: 80, delay: 0.75 },
  { d: "M204 180 C204 204 256 204 256 180", len: 120, delay: 1.0 },
  { d: "M110 230 L190 230 L178 252 L122 252 Z", len: 200, delay: 0.4 },
];

export interface Dust {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
}

export const DUST: Dust[] = [
  { left: 14, top: 30, size: 3, dur: 10, delay: 0 },
  { left: 24, top: 62, size: 2, dur: 12, delay: 2 },
  { left: 40, top: 74, size: 3, dur: 11, delay: 4 },
  { left: 58, top: 40, size: 2, dur: 14, delay: 1 },
  { left: 70, top: 66, size: 3, dur: 13, delay: 3 },
  { left: 84, top: 34, size: 2, dur: 15, delay: 5 },
  { left: 8, top: 80, size: 3, dur: 12, delay: 6 },
  { left: 48, top: 24, size: 2, dur: 16, delay: 2.5 },
  { left: 64, top: 84, size: 3, dur: 10, delay: 4.5 },
  { left: 32, top: 48, size: 2, dur: 13, delay: 7 },
  { left: 90, top: 58, size: 3, dur: 11, delay: 1.5 },
  { left: 18, top: 54, size: 2, dur: 15, delay: 5.5 },
];

// Падежи для счётчика навыков (1 навык, 2-4 навыка, 5+ навыков).
export function skillsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = "навыков";
  if (mod10 === 1 && mod100 !== 11) word = "навык";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = "навыка";
  return `${n} ${word}`;
}
