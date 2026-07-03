/**
 * ZOLVEX Frontend — Business Hours Config
 * Mirrors the backend config. Must stay in sync with src/config/business-hours.ts.
 * This is the single frontend source of truth for calendar rendering.
 */
export const BUSINESS_HOURS = {
  START_HOUR: 8,
  END_HOUR: 20,
  SLOT_DURATION_MINUTES: 60,
  TIMEZONE: 'Asia/Kolkata',
} as const;
