# Kogy demo domain reference

## Tenant account (mock)

```ts
type TenantScheduleItem = {
  id: string;
  kind: 'medical' | 'grocery' | 'outcall' | 'leisure';
  title: string;
  when: string;
  detail?: string;
};

type TenantAccount = {
  id: string;
  name: string;
  phone: string;
  language: string;
  autoOrderEnabled: boolean;
  maxAutoOrderPrice: number; // currency units
  walletBalance: number;
  groceryList: string[];
  schedule: TenantScheduleItem[];
  medicalNotes?: string;
};
```

## Call session

```ts
type CallMode = 'ai' | 'manual';
type ConnectionStatus = 'ringing' | 'connected' | 'thinking' | 'acting' | 'manual' | 'ended';

type CallSession = {
  id: string;
  tenantId: string;
  mode: CallMode;
  status: ConnectionStatus;
  transcript: TranscriptLine[];
  thinkingTree: ThinkingNode[];
  actions: ProposedAction[];
};
```

## Thinking tree

```ts
type ThinkingNode = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'blocked' | 'skipped';
  children?: ThinkingNode[];
  detail?: string;
};
```

### Grocery branch (milk)

1. Classify intent → grocery
2. Resolve item → milk
3. Add to grocery list
4. Schedule morning outcall reminder
5. Confirm to tenant

### Medical branch (foot)

1. Classify intent → medical
2. Assess urgency (emergency vs solvable)
3. If solvable → check physio auto-order eligibility
4. Order physiotherapy OR escalate / block with reason
5. Confirm to tenant

## Operator intervene

- Sets `mode` to `manual` and `status` to `manual`
- Freezes further AI thinking/actions
- Leaves transcript + tree visible for handoff context
