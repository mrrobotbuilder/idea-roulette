// Weekly build streaks. Pure: the API and scripts/check.ts both use these.
const DAY = 86_400_000;

// ISO week of a timestamp, in UTC, as "YYYY-Www". The ISO year is the year of that week's Thursday.
export const isoWeek = (ms: number): string => {
  const d = new Date(ms);
  const thu = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + (3 - ((d.getUTCDay() + 6) % 7)) * DAY;
  const year = new Date(thu).getUTCFullYear();
  const week = 1 + Math.floor((thu - Date.UTC(year, 0, 1)) / DAY / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
};

// "YYYY-MM" in UTC, the monthly leaderboard bucket.
export const monthOf = (ms: number) => new Date(ms).toISOString().slice(0, 7);

// Weeks since the Monday of 1970-01-05, so consecutive ISO weeks differ by exactly 1 even
// across a year boundary or a week 53. NaN for anything that is not a real ISO week.
export const weekIndex = (w: string): number => {
  const m = /^(\d{4})-W(\d{2})$/.exec(w);
  if (!m) return NaN;
  const jan4 = Date.UTC(Number(m[1]), 0, 4);
  const monday = jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * DAY + (Number(m[2]) - 1) * 7 * DAY;
  return isoWeek(monday) === w ? Math.round((monday - Date.UTC(1970, 0, 5)) / DAY / 7) : NaN;
};

// Current streak: consecutive built weeks ending this week, or last week (a streak survives
// until a whole week passes with nothing built). Longest: the longest run ever.
export const streaks = (weeks: string[], now: number) => {
  const set = new Set(weeks.map(weekIndex).filter((i) => !Number.isNaN(i)));
  const sorted = [...set].sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  sorted.forEach((w, i) => {
    run = i > 0 && sorted[i - 1] === w - 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  });
  const cur = weekIndex(isoWeek(now));
  const end = set.has(cur) ? cur : set.has(cur - 1) ? cur - 1 : null;
  let current = 0;
  while (end !== null && set.has(end - current)) current++;
  return { current, longest };
};
