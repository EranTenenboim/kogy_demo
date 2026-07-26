export type CallMode = 'ai' | 'manual';

export type ConnectionStatus =
  | 'idle'
  | 'ringing'
  | 'connected'
  | 'thinking'
  | 'acting'
  | 'manual'
  | 'ended';

export type NodeStatus = 'pending' | 'active' | 'done' | 'blocked' | 'skipped';

export type IntentKind = 'grocery' | 'medical';

export type TenantAccount = {
  id: string;
  name: string;
  phone: string;
  language: string;
  address: string;
  autoOrderEnabled: boolean;
  maxAutoOrderPrice: number;
  walletBalance: number;
  groceryList: string[];
  medicalNotes?: string;
};

export type ThinkingNode = {
  id: string;
  label: string;
  status: NodeStatus;
  detail?: string;
  children?: ThinkingNode[];
};

export type TranscriptLine = {
  id: string;
  speaker: 'tenant' | 'ai' | 'operator' | 'system';
  text: string;
  at: number;
};

export type ProposedAction = {
  id: string;
  label: string;
  status: 'proposed' | 'running' | 'done' | 'blocked' | 'cancelled';
  detail?: string;
};

export type DemoScenario = {
  id: string;
  title: string;
  summary: string;
  intent: IntentKind;
  tenantId: string;
  openingLine: string;
  thinkingTree: ThinkingNode[];
  steps: DemoStep[];
};

export type DemoStep =
  | { type: 'status'; status: ConnectionStatus; delayMs: number }
  | { type: 'transcript'; speaker: TranscriptLine['speaker']; text: string; delayMs: number }
  | { type: 'activate'; nodeId: string; delayMs: number }
  | { type: 'resolve'; nodeId: string; status: NodeStatus; detail?: string; delayMs: number }
  | { type: 'action'; action: Omit<ProposedAction, 'id'>; delayMs: number }
  | { type: 'tenant-patch'; patch: Partial<TenantAccount>; delayMs: number };

export type CallSession = {
  id: string;
  scenarioId: string;
  tenantId: string;
  mode: CallMode;
  status: ConnectionStatus;
  transcript: TranscriptLine[];
  thinkingTree: ThinkingNode[];
  actions: ProposedAction[];
  startedAt: number;
};
