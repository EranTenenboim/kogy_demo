import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import type { ProposedAction } from '../types';

type Props = {
  actions: ProposedAction[];
};

const colorMap = {
  proposed: 'default',
  running: 'info',
  done: 'success',
  blocked: 'error',
  cancelled: 'warning',
} as const;

export function ActionsPanel({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No actions yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {actions.map((action) => (
        <Paper key={action.id} variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              {action.label}
            </Typography>
            <Chip size="small" label={action.status} color={colorMap[action.status]} />
          </Stack>
          {action.detail && (
            <Typography variant="caption" color="text.secondary">
              {action.detail}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
