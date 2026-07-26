import { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {
  AVERAGE_BEDS,
  RESIDENT_FACILITY_FEE,
  formatUsd,
  pricingAnchors,
  pricingTiers,
  type PricingTier,
} from '../mocks/pricing';
import {
  appendDemoBookingCall,
  loadDemoBookingCalls,
} from '../lib/demoBookingLog';
import { BookDemoDialog } from './BookDemoDialog';

type Props = {
  focusRequest?: boolean;
};

export function PricingPage({ focusRequest = false }: Props) {
  const tiersRef = useRef<HTMLDivElement | null>(null);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [justBooked, setJustBooked] = useState<string | null>(null);

  useEffect(() => {
    if (focusRequest) {
      tiersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusRequest]);

  const openBookDemo = (tier: PricingTier) => {
    setSelectedTier(tier);
    setDialogOpen(true);
  };

  const submitLead = (data: { email: string; phone: string }) => {
    if (!selectedTier) return;
    // Persist for Operator reporting only — never shown on this client page
    appendDemoBookingCall(loadDemoBookingCalls(), {
      tierId: selectedTier.id,
      tierName: selectedTier.name,
      priceMonthly: selectedTier.priceMonthly,
      perResidentMonthly: selectedTier.perResidentMonthly,
      email: data.email,
      phone: data.phone,
      source: 'pricing-tier',
    });
    setJustBooked(selectedTier.name);
    setDialogOpen(false);
    setSelectedTier(null);
  };

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100%', pb: 6 }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ opacity: 0.9 }}>
            Kogsy for communities
          </Typography>
          <Typography variant="h3" component="h1" fontWeight={500} gutterBottom>
            Pricing that feels small next to what residents already pay
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 720, fontWeight: 400, opacity: 0.95 }}
          >
            {formatUsd(299)} / {formatUsd(799)} / {formatUsd(1999)} per community
            per month — about {formatUsd(9)} / {formatUsd(24)} / {formatUsd(60)}{' '}
            per resident in an average {AVERAGE_BEDS}-bed home, against{' '}
            {formatUsd(RESIDENT_FACILITY_FEE)} they already pay the facility.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4 }}>
        {justBooked && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setJustBooked(null)}
          >
            Thanks — we received your demo request for{' '}
            <strong>{justBooked}</strong>. Our team will reach out shortly.
          </Alert>
        )}

        <Box ref={tiersRef}>
          <Grid container spacing={2}>
            {pricingTiers.map((tier) => (
              <Grid item xs={12} md={4} key={tier.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: tier.highlight ? 'primary.main' : 'divider',
                    borderWidth: tier.highlight ? 2 : 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">{tier.name}</Typography>
                      {tier.highlight && (
                        <Chip size="small" color="primary" label="Most chosen" />
                      )}
                    </Stack>
                    <Box>
                      <Typography variant="h3" component="p" fontWeight={500}>
                        {formatUsd(tier.priceMonthly)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per community / month
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      ~{formatUsd(tier.perResidentMonthly)} per resident / month
                    </Typography>
                    <Typography variant="subtitle2" color="primary.main">
                      {tier.tagline}
                    </Typography>
                    <Stack spacing={0.75} sx={{ flexGrow: 1 }}>
                      {tier.includes.map((line) => (
                        <Typography
                          key={line}
                          variant="body2"
                          sx={{ display: 'flex', gap: 1 }}
                        >
                          <Box component="span" color="primary.main">
                            •
                          </Box>
                          <Box component="span">{line}</Box>
                        </Typography>
                      ))}
                    </Stack>
                    <Button
                      variant={tier.highlight ? 'contained' : 'outlined'}
                      size="large"
                      fullWidth
                      startIcon={<EventAvailableIcon />}
                      onClick={() => openBookDemo(tier)}
                    >
                      Book a demo
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Why communities choose Scale
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Put the investment in context of what families and facilities already
            spend for far narrower help.
          </Typography>
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            {pricingAnchors.map((anchor) => (
              <Box key={anchor.name}>
                <Typography variant="subtitle2">{anchor.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {anchor.detail}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>

      <BookDemoDialog
        open={dialogOpen}
        tier={selectedTier}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTier(null);
        }}
        onSubmit={submitLead}
      />
    </Box>
  );
}
