import React, { useMemo } from 'react';
import { SolarSystem } from './SolarSystem';

export default function SolarSystemScene({ countryState }) {
  // Map budget -> Earth color (blue ➜ green ➜ red as budget grows)
  const earthColor = useMemo(() => {
    if (!countryState) return '#2d5f9b';
    const maxBudget = 2_000_000;
    const ratio = Math.min(countryState.budget / maxBudget, 1);
    // interpolate between blue (0) and green (0.5) and red (1)
    if (ratio < 0.5) {
      // blue -> green
      const g = Math.floor(95 + ratio * 2 * (150 - 95));
      return `rgb(45,${g},155)`; // keep blue channel high, vary green
    }
    // green -> red
    const r = Math.floor(45 + (ratio - 0.5) * 2 * (210 - 45));
    const b = Math.floor(155 - (ratio - 0.5) * 2 * 155);
    return `rgb(${r},95,${b})`;
  }, [countryState]);

  return <SolarSystem earthColor={earthColor} />;
}