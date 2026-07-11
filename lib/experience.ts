/**
 * Self-updating experience engine.
 *
 * Career anchor: June 2021. Every experience claim in the portfolio computes
 * from this constant so the number increments automatically forever —
 * nothing to edit on anniversaries.
 *
 * Pure, React-free, deterministic given a date.
 */

/** Career start — June 1, 2021 (month is 0-indexed). */
export const CAREER_START = new Date(2021, 5, 1);

/** Floor of full years elapsed since CAREER_START. */
export function yearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const anniversaryPassed =
    now.getMonth() > CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() &&
      now.getDate() >= CAREER_START.getDate());
  if (!anniversaryPassed) years -= 1;
  return Math.max(0, years);
}

/** e.g. "5+ years" — floor plus a "+". */
export function experienceLabel(now?: Date): string {
  return `${yearsOfExperience(now)}+ years`;
}

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
] as const;

/** Capitalized word for a small count ("Five"); digits beyond twelve. */
export function yearsWord(years: number): string {
  return NUMBER_WORDS[years] ?? String(years);
}

/** e.g. "Five" — word form of the current floor, for prose copy. */
export function experienceYearsWord(now?: Date): string {
  return yearsWord(yearsOfExperience(now));
}
