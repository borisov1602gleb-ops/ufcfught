// SVG-пути фигуры Фемиды из дизайн-макета «ЛЕКС» (источник истины — handoff).
// len — приблизительная длина пути для дэш-паттерна бегущей обводки,
// delay — задержка старта анимации (эффект «оживающего чертежа»).
export interface ThemisPath {
  d: string;
  len: number;
  delay: number;
}

export const THEMIS_PATHS: ThemisPath[] = [
  { d: "M180 792 L420 792 L398 752 L202 752 Z", len: 700, delay: 0 },
  { d: "M212 752 L388 752 L374 716 L226 716 Z", len: 560, delay: 0.3 },
  { d: "M256 300 C236 430 214 580 198 712 L402 712 C386 580 364 430 344 300 Z", len: 1320, delay: 0.1 },
  { d: "M286 322 C279 470 273 590 269 706", len: 420, delay: 0.6 },
  { d: "M314 322 C321 470 327 590 331 706", len: 420, delay: 0.75 },
  { d: "M300 316 L300 708", len: 400, delay: 0.5 },
  { d: "M244 430 C252 552 252 630 232 706", len: 360, delay: 0.9 },
  { d: "M356 430 C348 552 348 630 368 706", len: 360, delay: 1.05 },
  { d: "M250 196 C245 242 250 282 256 300 L344 300 C350 282 355 242 350 196", len: 380, delay: 0.2 },
  { d: "M256 296 L344 296", len: 120, delay: 0.4 },
  { d: "M250 196 C276 180 324 180 350 196", len: 150, delay: 0.15 },
  { d: "M289 168 L289 190", len: 60, delay: 0.3 },
  { d: "M311 168 L311 190", len: 60, delay: 0.35 },
  { d: "M300 80 C271 80 255 103 255 130 C255 158 276 178 300 178 C324 178 345 158 345 130 C345 103 329 80 300 80 Z", len: 330, delay: 0.05 },
  { d: "M255 121 L345 117", len: 95, delay: 0.45 },
  { d: "M255 134 L345 130", len: 95, delay: 0.5 },
  { d: "M345 117 C361 112 374 119 386 110", len: 60, delay: 0.8 },
  { d: "M345 130 C362 132 376 140 388 136", len: 60, delay: 0.85 },
  { d: "M252 202 C219 206 193 196 174 176 C164 166 160 152 163 138", len: 230, delay: 0.25 },
  { d: "M58 132 L266 132", len: 210, delay: 0.55 },
  { d: "M163 132 L163 120", len: 30, delay: 0.6 },
  { d: "M74 132 L62 204", len: 80, delay: 0.9 },
  { d: "M74 132 L86 204", len: 80, delay: 0.95 },
  { d: "M54 204 C54 224 94 224 94 204", len: 95, delay: 1.0 },
  { d: "M250 132 L238 204", len: 80, delay: 1.05 },
  { d: "M250 132 L262 204", len: 80, delay: 1.1 },
  { d: "M230 204 C230 224 270 224 270 204", len: 95, delay: 1.15 },
  { d: "M348 202 C376 216 401 250 416 300 C426 340 429 400 429 442", len: 370, delay: 0.3 },
  { d: "M396 449 L470 443", len: 80, delay: 0.7 },
  { d: "M432 449 L436 414", len: 40, delay: 0.75 },
  { d: "M431 404 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", len: 50, delay: 0.8 },
  { d: "M422 452 L440 452 L431 760 Z", len: 640, delay: 0.4 },
  { d: "M431 456 L431 752", len: 300, delay: 0.9 },
];

// Плавающие частицы пыли (позиции/длительности из макета).
export interface Dust {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
}

export const DUST: Dust[] = [
  { left: 14, top: 70, size: 3, dur: 9, delay: 0 },
  { left: 22, top: 80, size: 2, dur: 11, delay: 2 },
  { left: 30, top: 65, size: 4, dur: 10, delay: 4 },
  { left: 38, top: 85, size: 2, dur: 13, delay: 1 },
  { left: 46, top: 75, size: 3, dur: 12, delay: 3 },
  { left: 18, top: 55, size: 2, dur: 14, delay: 5 },
  { left: 52, top: 60, size: 3, dur: 9, delay: 6 },
  { left: 8, top: 78, size: 4, dur: 15, delay: 2.5 },
  { left: 60, top: 82, size: 2, dur: 11, delay: 4.5 },
  { left: 26, top: 90, size: 3, dur: 10, delay: 7 },
  { left: 42, top: 50, size: 2, dur: 16, delay: 1.5 },
  { left: 34, top: 72, size: 3, dur: 12, delay: 5.5 },
  { left: 12, top: 62, size: 2, dur: 13, delay: 3.5 },
  { left: 48, top: 88, size: 3, dur: 9, delay: 6.5 },
];
