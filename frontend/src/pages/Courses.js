import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await coursesAPI.getAllCourses(params);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Browse Courses
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Web Development">Web Development</MenuItem>
            <MenuItem value="Mobile Development">Mobile Development</MenuItem>
            <MenuItem value="Data Science">Data Science</MenuItem>
            <MenuItem value="Machine Learning">Machine Learning</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    sx={{ height: 200, backgroundColor: '#e0e0e0' }}
                    image={course.image || 'https://via.placeholder.com/300x200'}
                    title={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {course.description.substring(0, 100)}...
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {course.category}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {'$' + (course.price || 0)}
                    </Typography>
                    <Typography variant="caption">
                      👥 {course.students?.length || 0} students
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      to={`/courses/${course._id}`}
                      variant="contained"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                No courses found
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Courses;
