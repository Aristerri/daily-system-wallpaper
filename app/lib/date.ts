export function datePartsInZone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function dayOfYear(year: number, month: number, day: number) {
  const current = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 1);
  return Math.floor((current - start) / 86400000) + 1;
}

export function daysUntilBirthday(
  year: number,
  month: number,
  day: number,
  birthday: string
) {
  const [birthdayMonthRaw, birthdayDayRaw] = birthday.split("-");
  const birthdayMonth = Math.max(1, Math.min(12, Number(birthdayMonthRaw) || 1));
  const birthdayDay = Math.max(1, Math.min(31, Number(birthdayDayRaw) || 1));

  const today = Date.UTC(year, month - 1, day);
  let target = Date.UTC(year, birthdayMonth - 1, birthdayDay);

  if (target < today) {
    target = Date.UTC(year + 1, birthdayMonth - 1, birthdayDay);
  }

  return Math.round((target - today) / 86400000);
}
