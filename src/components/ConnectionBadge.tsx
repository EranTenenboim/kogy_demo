import Chip from '@mui/material/Chip';
import type { ConnectionStatus, CallMode } from '../types';

const labels: Record<ConnectionStatus, string> = {
  idle: 'Idle',
  ringing: 'Ringing',
  connected: 'AI connected',
  thinking: 'AI thinking',
  acting: 'AI acting',
  manual: 'Manual',
  ended: 'Ended',
};

const colors: Record<
  ConnectionStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
> = {
  idle: 'default',
  ringing: 'warning',
  connected: 'success',
  thinking: 'info',
  acting: 'primary',
  manual: 'error',
  ended: 'default',
};

type Props = {
  status: ConnectionStatus;
  mode: CallMode;
};

export function ConnectionBadge({ status, mode }: Props) {
  const effective = mode === 'manual' ? 'manual' : status;
  return (
    <Chip
      label={labels[effective]}
      color={colors[effective]}
      variant={effective === 'idle' ? 'outlined' : 'filled'}
      size="small"
    />
  );
}
