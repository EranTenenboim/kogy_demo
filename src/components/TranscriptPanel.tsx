import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
type Props = {
  lines: {
    id: string;
    speaker: 'tenant' | 'ai' | 'operator' | 'system';
    text: string;
  }[];
};

const speakerLabel = {
  tenant: 'Tenant',
  ai: 'AI',
  operator: 'Operator',
  system: 'System',
} as const;

const speakerColor = {
  tenant: 'primary.main',
  ai: 'success.main',
  operator: 'error.main',
  system: 'text.secondary',
} as const;

export function TranscriptPanel({ lines }: Props) {
  return (
    <Stack spacing={1.5} sx={{ maxHeight: 480, overflow: 'auto', pr: 1 }}>
      {lines.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Waiting for call transcript…
        </Typography>
      )}
      {lines.map((line) => (
        <Paper
          key={line.id}
          variant="outlined"
          sx={{
            p: 1.5,
            bgcolor:
              line.speaker === 'operator'
                ? 'rgba(217, 48, 37, 0.06)'
                : line.speaker === 'ai'
                  ? 'rgba(24, 128, 56, 0.06)'
                  : 'background.paper',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: speakerColor[line.speaker], fontWeight: 600 }}
          >
            {speakerLabel[line.speaker]}
          </Typography>
          <Box mt={0.5}>
            <Typography variant="body2">{line.text}</Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
