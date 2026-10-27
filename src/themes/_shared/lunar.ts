/**
 * Vietnamese lunar calendar, UTC+7. Astronomical method described by Ho Ngoc Duc:
 * https://www.informatik.uni-leipzig.de/~duc/amlich/calrules.html
 * New moons use Meeus' epoch/polynomial and periodic corrections; month 11 contains
 * the winter solstice, and the first month without a major solar term is leap.
 * Supported Gregorian input: 1800–2199 (civil dates, not UTC instants).
 */
const TIME_ZONE = 7;
const SYNODIC_MONTH = 29.530588853;
const EPOCH = 2415021.076998695;
const RAD = Math.PI / 180;
const sin = (degrees: number) => Math.sin(degrees * RAD);

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  canChi: string;
}

function julianDay(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function newMoonDay(k: number): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const mean =
    2415020.75933 +
    SYNODIC_MONTH * k +
    0.0001178 * t2 -
    0.000000155 * t3 +
    0.00033 * sin(166.56 + 132.87 * t - 0.009173 * t2);
  const solar = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const lunar = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const latitude = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  const correction =
    (0.1734 - 0.000393 * t) * sin(solar) +
    0.0021 * sin(2 * solar) -
    0.4068 * sin(lunar) +
    0.0161 * sin(2 * lunar) -
    0.0004 * sin(3 * lunar) +
    0.0104 * sin(2 * latitude) -
    0.0051 * sin(solar + lunar) -
    0.0074 * sin(solar - lunar) +
    0.0004 * sin(2 * latitude + solar) -
    0.0004 * sin(2 * latitude - solar) -
    0.0006 * sin(2 * latitude + lunar) +
    0.001 * sin(2 * latitude - lunar) +
    0.0005 * sin(2 * lunar + solar);
  const delta =
    t < -11
      ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3
      : -0.000278 + 0.000265 * t + 0.000262 * t2;
  return Math.floor(mean + correction - delta + 0.5 + TIME_ZONE / 24);
}

/** Solar longitude sector at local midnight (12 major solar terms). */
function solarSector(jd: number): number {
  const t = (jd - 2451545.5 - TIME_ZONE / 24) / 36525;
  const anomaly = 357.5291 + 35999.0503 * t - 0.0001559 * t * t - 0.00000048 * t ** 3;
  const mean = 280.46645 + 36000.76983 * t + 0.0003032 * t * t;
  const longitude =
    mean +
    (1.9146 - 0.004817 * t - 0.000014 * t * t) * sin(anomaly) +
    (0.019993 - 0.000101 * t) * sin(2 * anomaly) +
    0.00029 * sin(3 * anomaly);
  return Math.floor((((longitude % 360) + 360) % 360) / 30);
}

function monthEleven(year: number): number {
  const k = Math.floor((julianDay(31, 12, year) - 2415021) / SYNODIC_MONTH);
  const moon = newMoonDay(k);
  return solarSector(moon) >= 9 ? newMoonDay(k - 1) : moon;
}

function leapOffset(a11: number): number {
  const k = Math.floor((a11 - EPOCH) / SYNODIC_MONTH + 0.5);
  let previous = solarSector(newMoonDay(k + 1));
  for (let i = 2; i < 14; i++) {
    const sector = solarSector(newMoonDay(k + i));
    if (sector === previous) return i - 1;
    previous = sector;
  }
  return 13;
}

export function solarToLunar(date: string): LunarDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new RangeError("Expected YYYY-MM-DD");
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    year < 1800 ||
    year > 2199 ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new RangeError("Expected a valid Gregorian date in 1800–2199");
  }
  const jd = julianDay(day, month, year);
  const k = Math.floor((jd - EPOCH) / SYNODIC_MONTH);
  let start = newMoonDay(k + 1);
  if (start > jd) start = newMoonDay(k);
  let a11 = monthEleven(year);
  let b11 = a11;
  let lunarYear = year;
  if (a11 >= start) a11 = monthEleven(year - 1);
  else {
    lunarYear++;
    b11 = monthEleven(year + 1);
  }
  const offset = Math.floor((start - a11) / 29);
  let lunarMonth = offset + 11;
  let leap = false;
  if (b11 - a11 > 365) {
    const leapMonth = leapOffset(a11);
    if (offset >= leapMonth) {
      lunarMonth = offset + 10;
      leap = offset === leapMonth;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && offset < 4) lunarYear--;
  const stems = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const branches = [
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
  ];
  return {
    day: jd - start + 1,
    month: lunarMonth,
    year: lunarYear,
    leap,
    canChi: `${stems[(lunarYear + 6) % 10]} ${branches[(lunarYear + 8) % 12]}`,
  };
}

export function formatLunarDate(date: LunarDate): string {
  return `tức ngày ${date.day} tháng ${date.month}${date.leap ? " nhuận" : ""} năm ${date.canChi}`;
}
