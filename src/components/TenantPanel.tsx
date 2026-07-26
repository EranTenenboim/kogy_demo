import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import type { TenantAccount } from '../types';

type Props = {
  tenant: TenantAccount;
};

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
          label={`Wallet ₪${tenant.walletBalance}`}
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Max auto ₪${tenant.maxAutoOrderPrice}`}
          variant="outlined"
        />
      </Stack>

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
