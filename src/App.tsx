import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { OperatorDashboard } from './components/OperatorDashboard';
import { PricingPage } from './components/PricingPage';

type View = 'pricing' | 'operator';

export default function App() {
  const [view, setView] = useState<View>('pricing');
  const [pricingFocus, setPricingFocus] = useState(0);

  const goPricing = (fromBookDemo = false) => {
    setView('pricing');
    if (fromBookDemo) {
      setPricingFocus((n) => n + 1);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <SupportAgentIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography
            variant="h6"
            color="primary"
            sx={{ flexGrow: 1, fontWeight: 500, cursor: 'pointer' }}
            onClick={() => goPricing(false)}
          >
            Kogy
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              color={view === 'pricing' ? 'primary' : 'inherit'}
              variant={view === 'pricing' ? 'text' : 'text'}
              onClick={() => goPricing(false)}
              sx={{ fontWeight: view === 'pricing' ? 700 : 400 }}
            >
              Pricing
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => goPricing(true)}
            >
              Book a demo
            </Button>
            <Button
              color={view === 'operator' ? 'primary' : 'inherit'}
              variant={view === 'operator' ? 'outlined' : 'text'}
              onClick={() => setView('operator')}
            >
              Operator
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {view === 'pricing' ? (
        <PricingPage key={pricingFocus} focusRequest={pricingFocus > 0} />
      ) : (
        <OperatorDashboard />
      )}
    </Box>
  );
}
