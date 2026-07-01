import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            📚 Welcome to CourseHub
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Learn from the best instructors and unlock your potential
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: '#fff', color: '#667eea' }}
              component={Link}
              to="/courses"
            >
              Browse Courses
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                sx={{ borderColor: '#fff', color: '#fff' }}
                component={Link}
                to="/register"
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
          Why Choose CourseHub?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  👨‍🏫
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Expert Instructors
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Learn from industry professionals with years of experience
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  ⏰
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Learn at Your Pace
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Lifetime access to all course materials
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  🏆
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Certificates
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Earn recognized certificates upon completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Start Learning?
          </Typography>
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" component={Link} to="/register" size="large">
                Sign Up Free
              </Button>
              <Button variant="outlined" component={Link} to="/login" size="large">
                Login
              </Button>
            </Box>
          ) : (
            <Button variant="contained" component={Link} to="/courses" size="large">
              Start Exploring
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
