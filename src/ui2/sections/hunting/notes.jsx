import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const Notes = () => {
  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <TextField
          type="text"
          variant="standard"
          minRows={10}
          placeholder="Notes..."
          fullWidth
          multiline
        />
      </Paper>
    </Box>
  );
};

export default Notes;
