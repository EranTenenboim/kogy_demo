import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import HealingIcon from '@mui/icons-material/Healing';
import { useDemoCall } from '../hooks/useDemoCall';
import { ConnectionBadge } from './ConnectionBadge';
import { TenantPanel } from './TenantPanel';
import { TranscriptPanel } from './TranscriptPanel';
import { ThinkingTreePanel } from './ThinkingTreePanel';
import { ActionsPanel } from './ActionsPanel';

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

export function OperatorDashboard() {
  const {
    scenarios,
    activeScenarioId,
    session,
    tenant,
    running,
    startScenario,
    intervene,
    reset,
  } = useDemoCall();

  const canIntervene = Boolean(session && session.mode === 'ai');

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
          mb={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={500}>
              Operator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Demo dashboard · AI call assist with manual takeover
            </Typography>
          </Box>
          {session && (
            <Stack direction="row" spacing={1} alignItems="center">
              <ConnectionBadge status={session.status} mode={session.mode} />
              <Button
                color="error"
                variant="outlined"
                startIcon={<CallEndIcon />}
                disabled={!canIntervene}
                onClick={intervene}
              >
                Intervene → manual
              </Button>
            </Stack>
          )}
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Panel title="Demo calls">
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Trigger a mock inbound tenant call. Outside systems are simulated.
                </Typography>
                {scenarios.map((scenario) => {
                  const selected = activeScenarioId === scenario.id;
                  const Icon =
                    scenario.intent === 'grocery'
                      ? LocalGroceryStoreIcon
                      : HealingIcon;
                  return (
                    <Paper
                      key={scenario.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderColor: selected ? 'primary.main' : 'divider',
                        bgcolor: selected
                          ? 'rgba(26, 115, 232, 0.08)'
                          : 'background.paper',
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon fontSize="small" color="primary" />
                          <Typography variant="subtitle2">{scenario.title}</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {scenario.summary}
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          “{scenario.openingLine}”
                        </Typography>
                        <Button
                          size="small"
                          variant={selected && running ? 'outlined' : 'contained'}
                          startIcon={<PlayArrowIcon />}
                          onClick={() => startScenario(scenario.id)}
                        >
                          {selected && running ? 'Replay' : 'Start call'}
                        </Button>
                      </Stack>
                    </Paper>
                  );
                })}
                <Button
                  size="small"
                  startIcon={<RestartAltIcon />}
                  onClick={reset}
                  disabled={!session}
                >
                  Clear session
                </Button>
              </Stack>
            </Panel>
          </Grid>

          <Grid item xs={12} md={9}>
            {!session || !tenant ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <SupportAgentIcon
                  sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Waiting for an inbound call
                </Typography>
                <Typography color="text.secondary">
                  Start a demo call on the left to load tenant data, watch the AI
                  thinking tree, and practice intervening to manual.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {session.mode === 'manual' && (
                  <Alert severity="warning">
                    Call is on manual control. AI thinking and actions are frozen.
                    Continue the conversation as the operator.
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Panel title="Tenant account">
                      <TenantPanel tenant={tenant} />
                    </Panel>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Panel
                      title="Live transcript"
                      action={
                        <ConnectionBadge
                          status={session.status}
                          mode={session.mode}
                        />
                      }
                    >
                      <TranscriptPanel lines={session.transcript} />
                    </Panel>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Panel title="AI thinking tree">
                      <ThinkingTreePanel nodes={session.thinkingTree} />
                    </Panel>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Panel title="Actions">
                      <ActionsPanel actions={session.actions} />
                    </Panel>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
