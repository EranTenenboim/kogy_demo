import { useState, type FormEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { formatUsd, type PricingTier } from '../mocks/pricing';

type Props = {
  open: boolean;
  tier: PricingTier | null;
  onClose: () => void;
  onSubmit: (data: { email: string; phone: string }) => void;
};

export function BookDemoDialog({ open, tier, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneOk = phone.trim().replace(/\D/g, '').length >= 7;
  const valid = emailOk && phoneOk;

  const handleClose = () => {
    setEmail('');
    setPhone('');
    setTouched(false);
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || !tier) return;
    onSubmit({ email: email.trim(), phone: phone.trim() });
    setEmail('');
    setPhone('');
    setTouched(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Book a demo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            {tier && (
              <Typography variant="body2" color="text.secondary">
                Selected plan:{' '}
                <strong>
                  {tier.name} · {formatUsd(tier.priceMonthly)}/community/mo
                </strong>
              </Typography>
            )}
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={touched && !emailOk}
              helperText={
                touched && !emailOk ? 'Enter a valid email address' : undefined
              }
            />
            <TextField
              label="Phone"
              type="tel"
              required
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={touched && !phoneOk}
              helperText={
                touched && !phoneOk
                  ? 'Enter a phone number (at least 7 digits)'
                  : undefined
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Request demo
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
