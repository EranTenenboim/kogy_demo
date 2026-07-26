import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BlockIcon from '@mui/icons-material/Block';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { ThinkingNode, NodeStatus } from '../types';

type Props = {
  nodes: ThinkingNode[];
};

function StatusIcon({ status }: { status: NodeStatus }) {
  switch (status) {
    case 'done':
      return <CheckCircleOutlineIcon fontSize="small" color="success" />;
    case 'active':
      return <RadioButtonCheckedIcon fontSize="small" color="primary" />;
    case 'blocked':
      return <BlockIcon fontSize="small" color="error" />;
    case 'skipped':
      return <RemoveCircleOutlineIcon fontSize="small" color="disabled" />;
    default:
      return <RadioButtonUncheckedIcon fontSize="small" color="disabled" />;
  }
}

function NodeRow({ node, depth }: { node: ThinkingNode; depth: number }) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{
          pl: depth * 2,
          py: 0.75,
          opacity: node.status === 'pending' || node.status === 'skipped' ? 0.55 : 1,
          bgcolor: node.status === 'active' ? 'action.hover' : 'transparent',
          borderRadius: 1,
          px: 1,
        }}
      >
        <Box mt={0.25}>
          <StatusIcon status={node.status} />
        </Box>
        <Box>
          <Typography
            variant="body2"
            fontWeight={node.status === 'active' ? 600 : 400}
          >
            {node.label}
          </Typography>
          {node.detail && (
            <Typography variant="caption" color="text.secondary">
              {node.detail}
            </Typography>
          )}
        </Box>
      </Stack>
      {node.children?.map((child) => (
        <NodeRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </Box>
  );
}

export function ThinkingTreePanel({ nodes }: Props) {
  if (nodes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Thinking tree appears when AI starts classifying the request.
      </Typography>
    );
  }

  return (
    <Stack spacing={0.5}>
      {nodes.map((node) => (
        <NodeRow key={node.id} node={node} depth={0} />
      ))}
    </Stack>
  );
}
