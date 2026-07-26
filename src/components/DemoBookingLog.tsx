import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { formatUsd } from '../mocks/pricing';
import {
  clearDemoBookingCalls,
  demoBookingCallsToCsv,
  type DemoBookingCall,
} from '../lib/demoBookingLog';

type Props = {
  calls: DemoBookingCall[];
  onClear: () => void;
};

function formatWhen(at: number): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(at));
}

function downloadCsv(calls: DemoBookingCall[]) {
  const blob = new Blob([demoBookingCallsToCsv(calls)], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kogy-demo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DemoBookingLog({ calls, onClear }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        mb={1.5}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            Demo request log
          </Typography>
          <Chip size="small" label={`${calls.length}`} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            disabled={calls.length === 0}
            onClick={() => downloadCsv(calls)}
          >
            Export CSV
          </Button>
          <Button
            size="small"
            color="inherit"
            startIcon={<DeleteOutlineIcon />}
            disabled={calls.length === 0}
            onClick={() => {
              clearDemoBookingCalls();
              onClear();
            }}
          >
            Clear log
          </Button>
        </Stack>
      </Stack>

      {calls.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No demo requests yet. Each Book a demo submit logs email, phone, and
          which price level was selected.
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>When</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Price level</TableCell>
              <TableCell align="right">Community / mo</TableCell>
              <TableCell>Tier id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>{formatWhen(call.at)}</TableCell>
                <TableCell>{call.email}</TableCell>
                <TableCell>{call.phone}</TableCell>
                <TableCell>{call.tierName}</TableCell>
                <TableCell align="right">
                  {formatUsd(call.priceMonthly)}
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {call.tierId}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
