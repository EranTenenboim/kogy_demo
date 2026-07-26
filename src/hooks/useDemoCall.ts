import { useCallback, useEffect, useRef, useState } from 'react';
import { cloneTenant, getScenario, scenarios } from '../mocks/data';
import { cloneTree, freezeTree, setNodeStatus } from '../lib/thinkingTree';
import type {
  CallSession,
  ConnectionStatus,
  ProposedAction,
  TenantAccount,
  TranscriptLine,
} from '../types';

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useDemoCall() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [session, setSession] = useState<CallSession | null>(null);
  const [tenant, setTenant] = useState<TenantAccount | null>(null);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const wait = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const id = window.setTimeout(() => resolve(), ms);
      timersRef.current.push(id);
    });
  }, []);

  const stopPlayback = useCallback(() => {
    cancelRef.current = true;
    clearTimers();
    setRunning(false);
  }, [clearTimers]);

  const intervene = useCallback(() => {
    stopPlayback();
    setSession((prev) => {
      if (!prev || prev.mode === 'manual') return prev;
      const handoff: TranscriptLine = {
        id: uid('line'),
        speaker: 'operator',
        text: 'Operator intervened — call switched to manual.',
        at: Date.now(),
      };
      return {
        ...prev,
        mode: 'manual',
        status: 'manual',
        thinkingTree: freezeTree(prev.thinkingTree),
        actions: prev.actions.map((a) =>
          a.status === 'proposed' || a.status === 'running'
            ? { ...a, status: 'cancelled', detail: 'Cancelled by operator intervene' }
            : a,
        ),
        transcript: [...prev.transcript, handoff],
      };
    });
  }, [stopPlayback]);

  const startScenario = useCallback(
    async (scenarioId: string) => {
      stopPlayback();
      cancelRef.current = false;

      const scenario = getScenario(scenarioId);
      const nextTenant = cloneTenant(scenario.tenantId);
      const nextSession: CallSession = {
        id: uid('call'),
        scenarioId: scenario.id,
        tenantId: scenario.tenantId,
        mode: 'ai',
        status: 'idle',
        transcript: [],
        thinkingTree: cloneTree(scenario.thinkingTree),
        actions: [],
        startedAt: Date.now(),
      };

      setActiveScenarioId(scenario.id);
      setTenant(nextTenant);
      setSession(nextSession);
      setRunning(true);

      for (const step of scenario.steps) {
        if (cancelRef.current) break;
        await wait(step.delayMs);
        if (cancelRef.current) break;

        if (step.type === 'status') {
          setSession((prev) =>
            prev && prev.mode === 'ai'
              ? { ...prev, status: step.status as ConnectionStatus }
              : prev,
          );
        } else if (step.type === 'transcript') {
          const line: TranscriptLine = {
            id: uid('line'),
            speaker: step.speaker,
            text: step.text,
            at: Date.now(),
          };
          setSession((prev) =>
            prev ? { ...prev, transcript: [...prev.transcript, line] } : prev,
          );
        } else if (step.type === 'activate') {
          setSession((prev) =>
            prev && prev.mode === 'ai'
              ? {
                  ...prev,
                  thinkingTree: setNodeStatus(prev.thinkingTree, step.nodeId, 'active'),
                }
              : prev,
          );
        } else if (step.type === 'resolve') {
          setSession((prev) =>
            prev && prev.mode === 'ai'
              ? {
                  ...prev,
                  thinkingTree: setNodeStatus(
                    prev.thinkingTree,
                    step.nodeId,
                    step.status,
                    step.detail,
                  ),
                }
              : prev,
          );
        } else if (step.type === 'action') {
          const action: ProposedAction = {
            id: uid('act'),
            ...step.action,
          };
          setSession((prev) =>
            prev && prev.mode === 'ai'
              ? { ...prev, actions: [...prev.actions, action] }
              : prev,
          );
        } else if (step.type === 'tenant-patch') {
          setTenant((prev) => (prev ? { ...prev, ...step.patch } : prev));
        }
      }

      if (!cancelRef.current) {
        setRunning(false);
      }
    },
    [stopPlayback, wait],
  );

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  return {
    scenarios,
    activeScenarioId,
    session,
    tenant,
    running,
    startScenario,
    intervene,
    reset: () => {
      stopPlayback();
      setSession(null);
      setTenant(null);
      setActiveScenarioId(null);
    },
  };
}
