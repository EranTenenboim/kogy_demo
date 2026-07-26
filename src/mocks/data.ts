import type { DemoScenario, TenantAccount } from '../types';

export const tenants: Record<string, TenantAccount> = {
  'tn-rosa': {
    id: 'tn-rosa',
    name: 'Rosa Ben-David',
    phone: '+972-50-123-4567',
    language: 'Hebrew / English',
    address: '14 HaShalom St, Tel Aviv',
    autoOrderEnabled: true,
    maxAutoOrderPrice: 80,
    walletBalance: 240,
    groceryList: ['eggs', 'bread'],
    medicalNotes: 'Mild arthritis; prefers morning visits',
  },
  'tn-mira': {
    id: 'tn-mira',
    name: 'Mira Cohen',
    phone: '+972-52-987-6543',
    language: 'Hebrew',
    address: '7 Rothschild Blvd, Tel Aviv',
    autoOrderEnabled: true,
    maxAutoOrderPrice: 150,
    walletBalance: 220,
    groceryList: ['tea', 'yogurt'],
    medicalNotes: 'No known emergencies; physiotherapy allowed under auto-order',
  },
};

export const scenarios: DemoScenario[] = [
  {
    id: 'sc-milk',
    title: 'Milk running low',
    summary: 'Grocery intent → add milk → morning outcall reminder',
    intent: 'grocery',
    tenantId: 'tn-rosa',
    openingLine: 'The milk is about to end. Can you help me with that?',
    thinkingTree: [
      {
        id: 'g-classify',
        label: 'Classify tenant request',
        status: 'pending',
        children: [
          { id: 'g-intent', label: 'Intent: grocery', status: 'pending' },
          { id: 'g-item', label: 'Item: milk', status: 'pending' },
        ],
      },
      {
        id: 'g-list',
        label: 'Update grocery list',
        status: 'pending',
        children: [
          { id: 'g-add', label: 'Add milk to tenant grocery list', status: 'pending' },
        ],
      },
      {
        id: 'g-schedule',
        label: 'Schedule outcall reminder',
        status: 'pending',
        children: [
          {
            id: 'g-morning',
            label: 'Morning reminder: confirm milk pickup / delivery',
            status: 'pending',
          },
        ],
      },
      {
        id: 'g-confirm',
        label: 'Confirm plan with tenant',
        status: 'pending',
      },
    ],
    steps: [
      { type: 'status', status: 'ringing', delayMs: 600 },
      { type: 'status', status: 'connected', delayMs: 900 },
      {
        type: 'transcript',
        speaker: 'system',
        text: 'Inbound call connected. Tenant profile loaded.',
        delayMs: 200,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'The milk is about to end. Can you help me with that?',
        delayMs: 800,
      },
      { type: 'status', status: 'thinking', delayMs: 400 },
      { type: 'activate', nodeId: 'g-classify', delayMs: 500 },
      {
        type: 'resolve',
        nodeId: 'g-intent',
        status: 'done',
        detail: 'Grocery / household supply',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'g-item',
        status: 'done',
        detail: 'Milk — low stock signal',
        delayMs: 600,
      },
      { type: 'resolve', nodeId: 'g-classify', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-list', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'g-add',
        status: 'done',
        detail: 'milk added',
        delayMs: 700,
      },
      {
        type: 'tenant-patch',
        patch: { groceryList: ['eggs', 'bread', 'milk'] },
        delayMs: 100,
      },
      {
        type: 'action',
        action: {
          label: 'Add milk to grocery list',
          status: 'done',
          detail: 'List: eggs, bread, milk',
        },
        delayMs: 200,
      },
      { type: 'resolve', nodeId: 'g-list', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-schedule', delayMs: 400 },
      {
        type: 'resolve',
        nodeId: 'g-morning',
        status: 'done',
        detail: 'Tomorrow 08:30 outcall',
        delayMs: 800,
      },
      {
        type: 'action',
        action: {
          label: 'Schedule morning outcall reminder',
          status: 'done',
          detail: '08:30 — remind about milk / grocery run',
        },
        delayMs: 200,
      },
      { type: 'resolve', nodeId: 'g-schedule', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-confirm', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'I added milk to your grocery list and scheduled a morning reminder call so we can confirm delivery.',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'g-confirm',
        status: 'done',
        detail: 'Tenant informed',
        delayMs: 400,
      },
      { type: 'status', status: 'connected', delayMs: 300 },
    ],
  },
  {
    id: 'sc-foot',
    title: 'Foot hurts',
    summary: 'Medical intent → urgency check → physiotherapy auto-order',
    intent: 'medical',
    tenantId: 'tn-mira',
    openingLine: 'My foot hurts. It has been bothering me since yesterday.',
    thinkingTree: [
      {
        id: 'm-classify',
        label: 'Classify tenant request',
        status: 'pending',
        children: [
          { id: 'm-intent', label: 'Intent: medical', status: 'pending' },
          { id: 'm-symptom', label: 'Symptom: foot pain', status: 'pending' },
        ],
      },
      {
        id: 'm-assess',
        label: 'Assess urgency',
        status: 'pending',
        children: [
          {
            id: 'm-emergency',
            label: 'Emergency vs solvable at home / clinic',
            status: 'pending',
          },
        ],
      },
      {
        id: 'm-order',
        label: 'Physiotherapy auto-order',
        status: 'pending',
        children: [
          { id: 'm-auto', label: 'Check auto-order allowed', status: 'pending' },
          { id: 'm-price', label: 'Check price within limit', status: 'pending' },
          { id: 'm-wallet', label: 'Check wallet balance', status: 'pending' },
          { id: 'm-book', label: 'Book physiotherapy visit', status: 'pending' },
        ],
      },
      {
        id: 'm-confirm',
        label: 'Confirm plan with tenant',
        status: 'pending',
      },
    ],
    steps: [
      { type: 'status', status: 'ringing', delayMs: 600 },
      { type: 'status', status: 'connected', delayMs: 900 },
      {
        type: 'transcript',
        speaker: 'system',
        text: 'Inbound call connected. Tenant profile loaded.',
        delayMs: 200,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'My foot hurts. It has been bothering me since yesterday.',
        delayMs: 800,
      },
      { type: 'status', status: 'thinking', delayMs: 400 },
      { type: 'activate', nodeId: 'm-classify', delayMs: 500 },
      {
        type: 'resolve',
        nodeId: 'm-intent',
        status: 'done',
        detail: 'Medical / musculoskeletal',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'm-symptom',
        status: 'done',
        detail: 'Foot pain — non-trauma wording',
        delayMs: 600,
      },
      { type: 'resolve', nodeId: 'm-classify', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-assess', delayMs: 400 },
      {
        type: 'resolve',
        nodeId: 'm-emergency',
        status: 'done',
        detail: 'Not emergency — solvable with physiotherapy',
        delayMs: 900,
      },
      { type: 'resolve', nodeId: 'm-assess', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-order', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'm-auto',
        status: 'done',
        detail: 'autoOrderEnabled = true',
        delayMs: 600,
      },
      {
        type: 'resolve',
        nodeId: 'm-price',
        status: 'done',
        detail: 'Physio visit ₪120 ≤ max ₪150',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'm-wallet',
        status: 'done',
        detail: 'Balance ₪220 ≥ ₪120',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'm-book',
        status: 'done',
        detail: 'Tomorrow 10:00 — home physiotherapy',
        delayMs: 800,
      },
      {
        type: 'action',
        action: {
          label: 'Order physiotherapy',
          status: 'done',
          detail: '₪120 · tomorrow 10:00 · charged to tenant account',
        },
        delayMs: 200,
      },
      {
        type: 'tenant-patch',
        patch: { walletBalance: 100 },
        delayMs: 100,
      },
      { type: 'resolve', nodeId: 'm-order', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-confirm', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'This does not look like an emergency. I booked a physiotherapy visit for tomorrow morning on your account.',
        delayMs: 700,
      },
      {
        type: 'resolve',
        nodeId: 'm-confirm',
        status: 'done',
        detail: 'Tenant informed',
        delayMs: 400,
      },
      { type: 'status', status: 'connected', delayMs: 300 },
    ],
  },
];

export function getScenario(id: string): DemoScenario {
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) throw new Error(`Unknown scenario: ${id}`);
  return scenario;
}

export function cloneTenant(id: string): TenantAccount {
  const tenant = tenants[id];
  if (!tenant) throw new Error(`Unknown tenant: ${id}`);
  return {
    ...tenant,
    groceryList: [...tenant.groceryList],
  };
}
