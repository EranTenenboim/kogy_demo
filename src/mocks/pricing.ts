export type PricingTierId = 'community-299' | 'community-799' | 'community-1999';

export type PricingTier = {
  id: PricingTierId;
  name: string;
  tagline: string;
  priceMonthly: number;
  perResidentMonthly: number;
  bedsAssumed: number;
  highlight?: boolean;
  /** What this plan includes — shown on the pricing card */
  includes: string[];
};

/** Facility pricing — per community / month. Avg community size: 33 beds. */
export const AVERAGE_BEDS = 33;
export const RESIDENT_FACILITY_FEE = 6200;

export const pricingTiers: PricingTier[] = [
  {
    id: 'community-299',
    name: 'Starter',
    tagline: 'Essentials for day-to-day resident support',
    priceMonthly: 299,
    perResidentMonthly: 9,
    bedsAssumed: AVERAGE_BEDS,
    includes: [
      'AI inbound calls with listen → understand → act',
      'Essentials only: grocery list + basic medical triage',
      'Limited provider set (1–2 grocery / care options)',
      'Morning outcall reminders',
      'Operator intervene to manual',
    ],
  },
  {
    id: 'community-799',
    name: 'Growth',
    tagline: 'More providers and better everyday offers',
    priceMonthly: 799,
    perResidentMonthly: 24,
    bedsAssumed: AVERAGE_BEDS,
    highlight: true,
    includes: [
      'Everything in Starter',
      'More providers — compare prices across stores & clinics',
      'Best-price suggestions before ordering',
      'Leisure basics: local activities & outing booking',
      'Delivery vs morning-call choice when the list is full',
      'Physio / care booking with tenant consent loops',
    ],
  },
  {
    id: 'community-1999',
    name: 'Scale',
    tagline: 'Full network, leisure, and premium offers',
    priceMonthly: 1999,
    perResidentMonthly: 60,
    bedsAssumed: AVERAGE_BEDS,
    includes: [
      'Everything in Growth',
      'Full provider network for grocery, medical, and leisure',
      'Better offers: leisure, culture, and lifestyle bookings — not just essentials',
      'Premium concierge-style negotiation across vendors',
      'Priority scheduling & richer tenant calendar sync',
      'Multi-community reporting on demo leads & plan mix',
    ],
  },
];

export const pricingAnchors = [
  {
    name: 'GoGoGrandparent',
    detail:
      'Charges individual consumers up to $409 per month for human-operated concierge-by-phone.',
  },
  {
    name: 'After Hour Solutions',
    detail:
      'Charges facilities $2,000 to $4,500 per month for AI that only books tours.',
  },
] as const;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
