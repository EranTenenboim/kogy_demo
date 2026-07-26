export type PricingTierId = 'community-299' | 'community-799' | 'community-1999';

export type PricingTier = {
  id: PricingTierId;
  name: string;
  priceMonthly: number;
  perResidentMonthly: number;
  bedsAssumed: number;
  highlight?: boolean;
};

/** Facility pricing — per community / month. Avg community size: 33 beds. */
export const AVERAGE_BEDS = 33;
export const RESIDENT_FACILITY_FEE = 6200;

export const pricingTiers: PricingTier[] = [
  {
    id: 'community-299',
    name: 'Starter',
    priceMonthly: 299,
    perResidentMonthly: 9,
    bedsAssumed: AVERAGE_BEDS,
  },
  {
    id: 'community-799',
    name: 'Growth',
    priceMonthly: 799,
    perResidentMonthly: 24,
    bedsAssumed: AVERAGE_BEDS,
    highlight: true,
  },
  {
    id: 'community-1999',
    name: 'Scale',
    priceMonthly: 1999,
    perResidentMonthly: 60,
    bedsAssumed: AVERAGE_BEDS,
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
