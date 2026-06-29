import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchInstructorCourses();
  }, [user]);

  const fetchInstructorCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await coursesAPI.getInstructorCourses();
      const fetchedCourses = Array.isArray(response?.data?.courses)
        ? response.data.courses
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];
      setCourses(fetchedCourses);
    } catch (fetchError) {
      console.error('Failed to load instructor courses:', fetchError);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await coursesAPI.deleteCourse(courseId);
      fetchInstructorCourses();
    } catch (deleteError) {
      console.error('Failed to remove course:', deleteError);
      setError('Unable to remove the course. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome, {user?.fullName}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Instructor Dashboard
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Instructor Actions
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/create-course"
          sx={{ mr: 2, mb: 2 }}
        >
          Add New Course
        </Button>
        <Button variant="outlined" component={Link} to="/courses">
          Browse Courses
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : courses.length > 0 ? (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {course.category}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {course.students?.length || 0} students enrolled
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/courses/${course._id}`}>
                    View Course
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Remove Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No courses created yet.
          </Typography>
          <Button variant="contained" component={Link} to="/create-course">
            Add your first course
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default InstructorDashboard;
