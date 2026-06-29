import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';

const CreateAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('dueDate', formData.dueDate);
    if (attachment) data.append('attachment', attachment);

    try {
      await coursesAPI.createAssignment(id, data);
      setSuccess('Assignment created successfully! Redirecting...');
      setTimeout(() => navigate(`/courses/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Add Assignment
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Assignment Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Attachment
            <input type="file" hidden accept="application/pdf,image/*,video/*" onChange={handleFileChange} />
          </Button>
          {attachment && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {attachment.name}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            Add Assignment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAssignment;
