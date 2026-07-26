import type { PricingTierId } from '../mocks/pricing';

/** One logged “Book a demo” lead — shaped for later reporting by price level. */
export type DemoBookingCall = {
  id: string;
  /** Which price button / tier was selected */
  tierId: PricingTierId;
  tierName: string;
  priceMonthly: number;
  perResidentMonthly: number;
  email: string;
  phone: string;
  at: number;
  source: 'pricing-tier' | 'nav-book-demo';
};

export type DemoBookingLeadInput = {
  tierId: PricingTierId;
  tierName: string;
  priceMonthly: number;
  perResidentMonthly: number;
  email: string;
  phone: string;
  source?: DemoBookingCall['source'];
};

const STORAGE_KEY = 'kogy-demo-booking-calls';

function uid(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadDemoBookingCalls(): DemoBookingCall[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DemoBookingCall[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDemoBookingCalls(calls: DemoBookingCall[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
}

export function appendDemoBookingCall(
  existing: DemoBookingCall[],
  entry: DemoBookingLeadInput,
): DemoBookingCall[] {
  const next: DemoBookingCall[] = [
    {
      id: uid(),
      tierId: entry.tierId,
      tierName: entry.tierName,
      priceMonthly: entry.priceMonthly,
      perResidentMonthly: entry.perResidentMonthly,
      email: entry.email.trim(),
      phone: entry.phone.trim(),
      at: Date.now(),
      source: entry.source ?? 'pricing-tier',
    },
    ...existing,
  ];
  saveDemoBookingCalls(next);
  console.info('[kogy] demo booking lead logged', next[0]);
  return next;
}

export function clearDemoBookingCalls(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** CSV export for price-level reporting */
export function demoBookingCallsToCsv(calls: DemoBookingCall[]): string {
  const header = [
    'id',
    'at_iso',
    'tier_id',
    'tier_name',
    'price_monthly',
    'per_resident_monthly',
    'email',
    'phone',
    'source',
  ].join(',');
  const rows = calls.map((c) =>
    [
      c.id,
      new Date(c.at).toISOString(),
      c.tierId,
      csvEscape(c.tierName),
      c.priceMonthly,
      c.perResidentMonthly,
      csvEscape(c.email),
      csvEscape(c.phone),
      c.source,
    ].join(','),
  );
  return [header, ...rows].join('\n');
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
