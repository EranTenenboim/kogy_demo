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
  type DemoBookingCall,
} from '../lib/demoBookingLog';
import { BookDemoDialog } from './BookDemoDialog';
import { DemoBookingLog } from './DemoBookingLog';

type Props = {
  focusRequest?: boolean;
};

export function PricingPage({ focusRequest = false }: Props) {
  const tiersRef = useRef<HTMLDivElement | null>(null);
  const [calls, setCalls] = useState<DemoBookingCall[]>([]);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [justBooked, setJustBooked] = useState<string | null>(null);

  useEffect(() => {
    setCalls(loadDemoBookingCalls());
  }, []);

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
    setCalls((prev) =>
      appendDemoBookingCall(prev, {
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        priceMonthly: selectedTier.priceMonthly,
        perResidentMonthly: selectedTier.perResidentMonthly,
        email: data.email,
        phone: data.phone,
        source: 'pricing-tier',
      }),
    );
    setJustBooked(
      `${selectedTier.name} (${formatUsd(selectedTier.priceMonthly)})`,
    );
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
            Kogy for communities
          </Typography>
          <Typography variant="h3" component="h1" fontWeight={500} gutterBottom>
            Pricing
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 640, fontWeight: 400, opacity: 0.95 }}
          >
            Per community per month. At an average {AVERAGE_BEDS}-bed community,
            that is roughly {formatUsd(9)} / {formatUsd(24)} / {formatUsd(60)}{' '}
            per resident — against {formatUsd(RESIDENT_FACILITY_FEE)} the resident
            already pays the facility.
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
            Demo request received for <strong>{justBooked}</strong>. Contact and
            price level are in the log below for reporting.
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
                        <Chip size="small" color="primary" label="Popular" />
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
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {' '}
                        (avg {tier.bedsAssumed} beds)
                      </Typography>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
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
            Why {formatUsd(1999)} is defensible
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Anchors that make {formatUsd(1999)} defensible:
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

        <Box mt={3}>
          <DemoBookingLog
            calls={calls}
            onClear={() => {
              setCalls([]);
              setJustBooked(null);
            }}
          />
        </Box>
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
