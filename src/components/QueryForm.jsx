import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const QueryForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackType, setSnackType] = useState('success'); // or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError('All fields are required');
      setSnackType('error');
      setSnackOpen(true);
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    const payload = { name, email, message };

    try {
      const res = await fetch('http://localhost:5000/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.autoReply || 'Your query is pending.');
        setSnackType('success');
        setSnackOpen(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to submit query');
        setSnackType('error');
        setSnackOpen(true);
      }
    } catch (err) {
      console.error('Error submitting query:', err);
      setError('An error occurred. Please try again later.');
      setSnackType('error');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Box
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '500px',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Submit Your Query
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Your Message"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Query'}
          </Button>
        </form>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackType}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackType === 'success' ? response : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QueryForm;
