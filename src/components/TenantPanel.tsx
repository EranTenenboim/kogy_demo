import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import type { TenantAccount, TenantScheduleItem } from '../types';

type Props = {
  tenant: TenantAccount;
};

function kindLabel(kind: TenantScheduleItem['kind']): string {
  switch (kind) {
    case 'medical':
      return 'Medical';
    case 'grocery':
      return 'Grocery';
    case 'outcall':
      return 'Outcall';
    case 'leisure':
      return 'Leisure';
    default:
      return kind;
  }
}

function kindColor(
  kind: TenantScheduleItem['kind'],
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (kind) {
    case 'medical':
      return 'error';
    case 'grocery':
      return 'success';
    case 'outcall':
      return 'info';
    case 'leisure':
      return 'secondary';
    default:
      return 'default';
  }
}

export function TenantPanel({ tenant }: Props) {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Tenant
        </Typography>
        <Typography variant="h6">{tenant.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {tenant.id} · {tenant.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tenant.address}
        </Typography>
      </Box>

      <Divider />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          size="small"
          icon={<VerifiedOutlinedIcon />}
          label={tenant.autoOrderEnabled ? 'Auto-order on' : 'Auto-order off'}
          color={tenant.autoOrderEnabled ? 'success' : 'default'}
          variant="outlined"
        />
        <Chip
          size="small"
          icon={<AccountBalanceWalletOutlinedIcon />}
          label={`Wallet €${tenant.walletBalance}`}
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Max auto €${tenant.maxAutoOrderPrice}`}
          variant="outlined"
        />
      </Stack>

      <Box>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <EventNoteOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2">Schedule</Typography>
        </Stack>
        {tenant.schedule.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No upcoming items yet.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {tenant.schedule.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.25,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Chip
                    size="small"
                    label={kindLabel(item.kind)}
                    color={kindColor(item.kind)}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.when}
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500}>
                  {item.title}
                </Typography>
                {item.detail && (
                  <Typography variant="caption" color="text.secondary">
                    {item.detail}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <LocalGroceryStoreOutlinedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2">Grocery list</Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tenant.groceryList.map((item) => (
            <Chip key={item} label={item} size="small" />
          ))}
        </Stack>
      </Box>

      {tenant.medicalNotes && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Medical notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tenant.medicalNotes}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
