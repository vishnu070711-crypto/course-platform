import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert
} from '@mui/material';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price || 0);
    if (thumbnail) {
      data.append('image', thumbnail);
    }

    try {
      await coursesAPI.createCourse(data);
      setSuccess('Course created successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create New Course
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Course Title"
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              required
            >
              <MenuItem value="Web Development">Web Development</MenuItem>
              <MenuItem value="Mobile Development">Mobile Development</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Machine Learning">Machine Learning</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Price (USD)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 1 }}
            inputProps={{ min: 0, step: '0.01' }}
            helperText="Set 0 for a free course. Paid courses will require payment before enrollment."
          />
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload Course Thumbnail
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {thumbnail && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {thumbnail.name}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            Create Course
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCourse;
