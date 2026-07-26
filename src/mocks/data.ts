import type { DemoScenario, TenantAccount } from '../types';

/** Demo treats 3+ grocery items as enough to offer delivery vs morning call. */
export const GROCERY_DELIVERY_THRESHOLD = 3;

export const tenants: Record<string, TenantAccount> = {
  'tn-rosa': {
    id: 'tn-rosa',
    name: 'Rosa Müller',
    phone: '+49-170-1234567',
    language: 'German / English',
    address: '14 Müllerstraße, Berlin',
    autoOrderEnabled: true,
    maxAutoOrderPrice: 80,
    walletBalance: 240,
    groceryList: ['eggs', 'bread'],
    schedule: [],
    medicalNotes: 'Mild arthritis; prefers morning visits',
  },
  'tn-mira': {
    id: 'tn-mira',
    name: 'Mira Schneider',
    phone: '+49-151-9876543',
    language: 'German',
    address: '7 Maximilianstraße, Munich',
    autoOrderEnabled: true,
    maxAutoOrderPrice: 150,
    walletBalance: 220,
    groceryList: ['tea', 'yogurt'],
    schedule: [],
    medicalNotes: 'No known emergencies; physiotherapy allowed under auto-order',
  },
};

export const scenarios: DemoScenario[] = [
  {
    id: 'sc-milk',
    title: 'Milk running low',
    summary:
      'Listen → compassion → compare grocery providers → best price → deliver or morning call',
    intent: 'grocery',
    tenantId: 'tn-rosa',
    openingLine: 'The milk is about to end. Can you help me with that?',
    thinkingTree: [
      {
        id: 'g-listen',
        label: 'Listen & understand',
        status: 'pending',
        children: [
          { id: 'g-empathy', label: 'Respond with compassion', status: 'pending' },
          { id: 'g-intent', label: 'Intent: grocery / milk low', status: 'pending' },
        ],
      },
      {
        id: 'g-list',
        label: 'Update grocery list',
        status: 'pending',
        children: [
          { id: 'g-add', label: 'Add milk', status: 'pending' },
          {
            id: 'g-threshold',
            label: `List size ≥ ${GROCERY_DELIVERY_THRESHOLD} → offer delivery`,
            status: 'pending',
          },
        ],
      },
      {
        id: 'g-providers',
        label: 'Compare grocery providers',
        status: 'pending',
        children: [
          { id: 'g-rewe', label: 'Rewe — quote milk + basket', status: 'pending' },
          { id: 'g-bring', label: 'Bringmeister — quote', status: 'pending' },
          { id: 'g-flink', label: 'Flink — quote', status: 'pending' },
          { id: 'g-best', label: 'Pick best price', status: 'pending' },
        ],
      },
      {
        id: 'g-choice',
        label: 'Ask tenant: deliver now or morning call?',
        status: 'pending',
        children: [
          { id: 'g-ask', label: 'Present options', status: 'pending' },
          { id: 'g-answer', label: 'Tenant chooses delivery', status: 'pending' },
        ],
      },
      {
        id: 'g-act',
        label: 'Place order / confirm',
        status: 'pending',
      },
    ],
    steps: [
      { type: 'status', status: 'ringing', delayMs: 500 },
      { type: 'status', status: 'connected', delayMs: 800 },
      {
        type: 'transcript',
        speaker: 'system',
        text: 'Inbound call connected. Tenant profile loaded.',
        delayMs: 200,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Hello… the milk is about to end. Can you help me with that?',
        delayMs: 900,
      },
      { type: 'status', status: 'thinking', delayMs: 400 },
      { type: 'activate', nodeId: 'g-listen', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Of course, Rosa — I’m here with you. Running out of milk is annoying, especially if you rely on it every morning. Tell me a bit more: do you need it today, or is it okay if we plan for tomorrow?',
        delayMs: 1400,
      },
      {
        type: 'resolve',
        nodeId: 'g-empathy',
        status: 'done',
        detail: 'Acknowledged frustration; asked clarifying question',
        delayMs: 500,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'I just don’t want to forget. Eggs and bread are already on my list. If milk is added too, maybe it’s enough for a delivery… I’m not sure.',
        delayMs: 1200,
      },
      {
        type: 'resolve',
        nodeId: 'g-intent',
        status: 'done',
        detail: 'Grocery · milk low · open to delivery if list is full enough',
        delayMs: 700,
      },
      { type: 'resolve', nodeId: 'g-listen', status: 'done', delayMs: 200 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'That makes sense. I’ll add milk to your list, then check a few stores for the best price, and we’ll decide together — delivery now, or a gentle morning reminder call.',
        delayMs: 1100,
      },
      { type: 'activate', nodeId: 'g-list', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'g-add',
        status: 'done',
        detail: 'milk added',
        delayMs: 600,
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
      {
        type: 'resolve',
        nodeId: 'g-threshold',
        status: 'done',
        detail: `3 items ≥ ${GROCERY_DELIVERY_THRESHOLD} — delivery option unlocked`,
        delayMs: 700,
      },
      { type: 'resolve', nodeId: 'g-list', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-providers', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'I’m comparing a few providers for your basket now — one moment.',
        delayMs: 900,
      },
      {
        type: 'resolve',
        nodeId: 'g-rewe',
        status: 'done',
        detail: 'Rewe · basket ~€11.40 · delivery slot tomorrow PM',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'g-bring',
        status: 'done',
        detail: 'Bringmeister · basket ~€12.10 · same-day evening',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'g-flink',
        status: 'done',
        detail: 'Flink · basket ~€10.80 · 30–45 min · best price',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'g-best',
        status: 'done',
        detail: 'Best: Flink €10.80 (within max auto €80, wallet €240)',
        delayMs: 600,
      },
      {
        type: 'action',
        action: {
          label: 'Compare grocery providers',
          status: 'done',
          detail: 'Rewe €11.40 · Bringmeister €12.10 · Flink €10.80 ← best',
        },
        delayMs: 200,
      },
      { type: 'resolve', nodeId: 'g-providers', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-choice', delayMs: 400 },
      { type: 'status', status: 'thinking', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'g-ask',
        status: 'done',
        detail: 'Offer deliver now (Flink) vs morning outcall',
        delayMs: 500,
      },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Good news — with eggs, bread, and milk, your list is full enough for a delivery. The best price I found is Flink at about €10.80, arriving in roughly 30–45 minutes. Would you like me to order delivery now, or should I call you in the morning to confirm together?',
        delayMs: 1500,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Oh, that’s helpful. Yes — please deliver it now, if the price is really the best.',
        delayMs: 1100,
      },
      {
        type: 'resolve',
        nodeId: 'g-answer',
        status: 'done',
        detail: 'Tenant chose: deliver now (Flink)',
        delayMs: 600,
      },
      { type: 'resolve', nodeId: 'g-choice', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'g-act', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'action',
        action: {
          label: 'Place Flink delivery order',
          status: 'done',
          detail: '€10.80 · ETA 30–45 min · charged to tenant account',
        },
        delayMs: 700,
      },
      {
        type: 'tenant-patch',
        patch: {
          walletBalance: 229,
          schedule: [
            {
              id: 'sch-flink',
              kind: 'grocery',
              title: 'Flink grocery delivery',
              when: 'Today · ETA 30–45 min',
              detail: 'eggs, bread, milk · €10.80',
            },
          ],
        },
        delayMs: 100,
      },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Done. I placed the Flink order for about €10.80 — it should arrive in 30 to 45 minutes. I’ll stay available if anything else comes up. Take care, Rosa.',
        delayMs: 1200,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Thank you — that was kind of you.',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'g-act',
        status: 'done',
        detail: 'Order confirmed with tenant',
        delayMs: 400,
      },
      { type: 'status', status: 'connected', delayMs: 300 },
    ],
  },
  {
    id: 'sc-foot',
    title: 'Foot hurts',
    summary:
      'Listen → compassion → compare physiotherapists → ask if it helps → book or offer another',
    intent: 'medical',
    tenantId: 'tn-mira',
    openingLine: 'My foot hurts. It has been bothering me since yesterday.',
    thinkingTree: [
      {
        id: 'm-listen',
        label: 'Listen & understand',
        status: 'pending',
        children: [
          { id: 'm-empathy', label: 'Respond with compassion', status: 'pending' },
          { id: 'm-intent', label: 'Intent: medical · foot pain', status: 'pending' },
        ],
      },
      {
        id: 'm-assess',
        label: 'Assess urgency',
        status: 'pending',
        children: [
          {
            id: 'm-emergency',
            label: 'Emergency vs solvable (physio / clinic)',
            status: 'pending',
          },
        ],
      },
      {
        id: 'm-providers',
        label: 'Compare physiotherapists',
        status: 'pending',
        children: [
          { id: 'm-p1', label: 'Dr. Weber Physio — quote', status: 'pending' },
          { id: 'm-p2', label: 'Bewegung München — quote', status: 'pending' },
          { id: 'm-p3', label: 'HomeCare Physio — quote', status: 'pending' },
          { id: 'm-best', label: 'Rank by fit + price', status: 'pending' },
        ],
      },
      {
        id: 'm-consent',
        label: 'Ask tenant if this will help',
        status: 'pending',
        children: [
          { id: 'm-offer1', label: 'Offer first option', status: 'pending' },
          { id: 'm-decline', label: 'Tenant declines → ask about other', status: 'pending' },
          { id: 'm-offer2', label: 'Offer alternate physio', status: 'pending' },
          { id: 'm-accept', label: 'Tenant accepts alternate', status: 'pending' },
        ],
      },
      {
        id: 'm-order',
        label: 'Book selected physiotherapy',
        status: 'pending',
        children: [
          { id: 'm-auto', label: 'Check auto-order allowed', status: 'pending' },
          { id: 'm-price', label: 'Check price within limit', status: 'pending' },
          { id: 'm-wallet', label: 'Check wallet balance', status: 'pending' },
          { id: 'm-book', label: 'Confirm booking', status: 'pending' },
        ],
      },
    ],
    steps: [
      { type: 'status', status: 'ringing', delayMs: 500 },
      { type: 'status', status: 'connected', delayMs: 800 },
      {
        type: 'transcript',
        speaker: 'system',
        text: 'Inbound call connected. Tenant profile loaded.',
        delayMs: 200,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Hi… my foot hurts. It has been bothering me since yesterday. I’m a bit worried.',
        delayMs: 1000,
      },
      { type: 'status', status: 'thinking', delayMs: 400 },
      { type: 'activate', nodeId: 'm-listen', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'I’m sorry you’re in pain, Mira — that sounds uncomfortable. I’m listening. Can you tell me if it started after a fall or twist, or did it come on more gradually? And is the pain sharp, or more of an ache?',
        delayMs: 1500,
      },
      {
        type: 'resolve',
        nodeId: 'm-empathy',
        status: 'done',
        detail: 'Compassion + clarifying questions',
        delayMs: 500,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'No fall. It just started aching yesterday when I walked more than usual. Not sharp — just sore when I stand.',
        delayMs: 1200,
      },
      {
        type: 'resolve',
        nodeId: 'm-intent',
        status: 'done',
        detail: 'Medical · foot ache · non-trauma wording',
        delayMs: 700,
      },
      { type: 'resolve', nodeId: 'm-listen', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-assess', delayMs: 400 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Thank you for explaining. From what you describe, this doesn’t sound like an emergency, but I don’t want you to keep walking on it if it’s sore. Physiotherapy at home can often help with this kind of strain. Shall I look at a few physiotherapists and prices for you?',
        delayMs: 1500,
      },
      {
        type: 'resolve',
        nodeId: 'm-emergency',
        status: 'done',
        detail: 'Not emergency — candidate for physiotherapy',
        delayMs: 700,
      },
      { type: 'resolve', nodeId: 'm-assess', status: 'done', delayMs: 200 },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Yes, please — but I want to understand the options before you book anything.',
        delayMs: 1000,
      },
      { type: 'activate', nodeId: 'm-providers', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Absolutely. I’ll compare a few providers connected to your account — one moment.',
        delayMs: 900,
      },
      {
        type: 'resolve',
        nodeId: 'm-p1',
        status: 'done',
        detail: 'Dr. Weber Physio · clinic visit €135 · tomorrow 14:00',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'm-p2',
        status: 'done',
        detail: 'Bewegung München · clinic €110 · day after tomorrow',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'm-p3',
        status: 'done',
        detail: 'HomeCare Physio · home visit €120 · tomorrow 10:00',
        delayMs: 800,
      },
      {
        type: 'resolve',
        nodeId: 'm-best',
        status: 'done',
        detail: 'Ranked: HomeCare (fit) · Bewegung (price) · Weber (premium)',
        delayMs: 600,
      },
      {
        type: 'action',
        action: {
          label: 'Compare physiotherapists',
          status: 'done',
          detail:
            'Weber €135 · Bewegung €110 · HomeCare €120 home visit ← recommended first',
        },
        delayMs: 200,
      },
      { type: 'resolve', nodeId: 'm-providers', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-consent', delayMs: 400 },
      { type: 'status', status: 'thinking', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'm-offer1',
        status: 'done',
        detail: 'Offer HomeCare Physio home visit €120',
        delayMs: 500,
      },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'The strongest match for you is HomeCare Physio — a home visit tomorrow at 10:00 for €120. That fits your preference for morning visits. Do you feel that would help, and may I book it?',
        delayMs: 1400,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Hmm… I’m not sure about HomeCare. Could we look at another option?',
        delayMs: 1100,
      },
      {
        type: 'resolve',
        nodeId: 'm-decline',
        status: 'done',
        detail: 'Tenant declined first option → explore alternate',
        delayMs: 600,
      },
      {
        type: 'resolve',
        nodeId: 'm-offer2',
        status: 'done',
        detail: 'Offer Bewegung München €110 clinic',
        delayMs: 500,
      },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Of course — thank you for saying so. Another good option is Bewegung München at €110 in the clinic, day after tomorrow. It’s a bit cheaper. Would that work better for you?',
        delayMs: 1400,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Yes, that sounds better. Please book Bewegung München.',
        delayMs: 1000,
      },
      {
        type: 'resolve',
        nodeId: 'm-accept',
        status: 'done',
        detail: 'Tenant accepted Bewegung München',
        delayMs: 600,
      },
      { type: 'resolve', nodeId: 'm-consent', status: 'done', delayMs: 200 },
      { type: 'activate', nodeId: 'm-order', delayMs: 400 },
      { type: 'status', status: 'acting', delayMs: 200 },
      {
        type: 'resolve',
        nodeId: 'm-auto',
        status: 'done',
        detail: 'autoOrderEnabled = true',
        delayMs: 500,
      },
      {
        type: 'resolve',
        nodeId: 'm-price',
        status: 'done',
        detail: '€110 ≤ max auto €150',
        delayMs: 600,
      },
      {
        type: 'resolve',
        nodeId: 'm-wallet',
        status: 'done',
        detail: 'Balance €220 ≥ €110',
        delayMs: 600,
      },
      {
        type: 'resolve',
        nodeId: 'm-book',
        status: 'done',
        detail: 'Bewegung München · day after tomorrow · clinic',
        delayMs: 700,
      },
      {
        type: 'action',
        action: {
          label: 'Book Bewegung München physiotherapy',
          status: 'done',
          detail: '€110 · clinic · day after tomorrow · charged to tenant account',
        },
        delayMs: 200,
      },
      {
        type: 'tenant-patch',
        patch: {
          walletBalance: 110,
          schedule: [
            {
              id: 'sch-physio',
              kind: 'medical',
              title: 'Physiotherapy — Bewegung München',
              when: 'Day after tomorrow · clinic',
              detail: 'Foot pain follow-up · €110',
            },
          ],
        },
        delayMs: 100,
      },
      {
        type: 'transcript',
        speaker: 'ai',
        text: 'Booked. Bewegung München is set for the day after tomorrow at €110 on your account. If the pain suddenly gets much worse, swelling, or numbness appears, please tell me or call emergency services. Otherwise, rest the foot when you can. I’m glad we found an option you’re comfortable with.',
        delayMs: 1500,
      },
      {
        type: 'transcript',
        speaker: 'tenant',
        text: 'Thank you — I feel better knowing someone looked at the choices with me.',
        delayMs: 900,
      },
      { type: 'resolve', nodeId: 'm-order', status: 'done', delayMs: 400 },
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
    schedule: tenant.schedule.map((item) => ({ ...item })),
  };
}
