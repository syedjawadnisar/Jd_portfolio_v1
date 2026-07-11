"use client";

import { useEffect, useState } from "react";
import { yearsOfExperience } from "./experience";

/**
 * Current years-of-experience floor for display contexts.
 *
 * Initialized with the same computation the server ran, then re-derived on
 * the client after mount — so a page prerendered before an anniversary
 * self-corrects. A hydration mismatch is only possible across an exact
 * year boundary, which is acceptable.
 */
export function useExperienceYears(): number {
  const [years, setYears] = useState(() => yearsOfExperience());

  useEffect(() => {
    setYears(yearsOfExperience());
  }, []);

  return years;
}
