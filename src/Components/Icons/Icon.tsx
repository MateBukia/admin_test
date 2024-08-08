import * as React from 'react';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function AddIcon() {
  return (
    <Stack direction="row" spacing={3}>
      <AddCircleIcon sx={{ color: green[500], fontSize: 40}} />
    </Stack>
  );
}
