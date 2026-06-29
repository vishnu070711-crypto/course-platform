import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Box
} from '@mui/material';

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please upload a PDF, image, or video file.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    try {
      await coursesAPI.submitAssignment(assignmentId, data);
      setSuccess('Assignment submitted successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Submit Assignment
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Submission File
            <input type="file" hidden accept="application/pdf,image/*,video/*" onChange={handleFileChange} />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            Submit Assignment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubmitAssignment;
