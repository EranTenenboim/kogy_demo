export type PricingTierId = 'community-299' | 'community-799' | 'community-1999';

export type PricingTier = {
  id: PricingTierId;
  name: string;
  tagline: string;
  priceMonthly: number;
  perResidentMonthly: number;
  bedsAssumed: number;
  highlight?: boolean;
  /** Client-facing benefits — persuasive, not internal ops language */
  includes: string[];
};

/** Facility pricing — per community / month. Avg community size: 33 beds. */
export const AVERAGE_BEDS = 33;
export const RESIDENT_FACILITY_FEE = 6200;

export const pricingTiers: PricingTier[] = [
  {
    id: 'community-299',
    name: 'Starter',
    tagline: 'Warm, reliable AI for everyday essentials',
    priceMonthly: 299,
    perResidentMonthly: 9,
    bedsAssumed: AVERAGE_BEDS,
    includes: [
      'Compassionate AI calls — listen, understand, then act',
      'Essentials coverage: grocery lists and basic care triage',
      'Core API connections to your resident & facility systems',
      'Clear German / English conversation for daily needs',
      'Human operator takeover whenever a call needs a person',
    ],
  },
  {
    id: 'community-799',
    name: 'Growth',
    tagline: 'Smarter language, more APIs, better offers',
    priceMonthly: 799,
    perResidentMonthly: 24,
    bedsAssumed: AVERAGE_BEDS,
    highlight: true,
    includes: [
      'Everything in Starter, with richer AI conversation style',
      'More API integrations — groceries, clinics, delivery partners',
      'Multi-provider price compare so residents get better deals',
      'Leisure & outing bookings — beyond essentials',
      'Delivery vs morning-call choices that feel natural on the phone',
      'Consent-aware care booking (physio and similar services)',
    ],
  },
  {
    id: 'community-1999',
    name: 'Scale',
    tagline: 'Full API network and premium AI language',
    priceMonthly: 1999,
    perResidentMonthly: 60,
    bedsAssumed: AVERAGE_BEDS,
    includes: [
      'Everything in Growth, tuned for larger communities',
      'Broadest API surface — grocery, medical, leisure, lifestyle',
      'Best-in-class AI language: more natural, patient, and persuasive',
      'Premium offers across leisure, culture, and concierge-style help',
      'Deep calendar sync so every booking shows on the resident schedule',
      'Priority routing and multi-community oversight for your ops team',
    ],
  },
];

export const pricingAnchors = [
  {
    name: 'Compared with consumer concierge phones',
    detail:
      'Services like GoGoGrandparent charge individuals up to $409 per month for human-operated phone help — Kogsy brings that care model to the whole community.',
  },
  {
    name: 'Compared with facility AI that only books tours',
    detail:
      'Tour-only AI tools often run $2,000–$4,500 per month. Scale covers living support, not just admissions marketing.',
  },
] as const;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
