import React, { useState, useEffect, useCallback } from 'react';
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
  LinearProgress,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const fetchStudentDashboard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const allResponse = await coursesAPI.getAllCourses();
      const courses = allResponse.data.courses || [];
      setAllCourses(courses);

      const courseMatch = (course) =>
        course.students?.some((student) =>
          student?._id?.toString() === user.id || student?.toString() === user.id
        );

      try {
        const enrolledResponse = await coursesAPI.getEnrolledCourses();
        const enrolled = enrolledResponse.data.enrollments || [];
        if (enrolled.length > 0) {
          setEnrollments(enrolled);
        } else {
          const studentCourses = courses.filter(courseMatch);
          setEnrollments(studentCourses.map((course) => ({ _id: course._id, course, progress: 0, completed: false })));
        }
      } catch (enrollError) {
        console.warn('Failed to fetch enrolled courses:', enrollError);
        const studentCourses = courses.filter(courseMatch);
        setEnrollments(studentCourses.map((course) => ({ _id: course._id, course, progress: 0, completed: false })));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Unable to load your dashboard. Please refresh or try again later.');
      setEnrollments([]);
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchInstructorCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await coursesAPI.getInstructorCourses();
      setInstructorCourses(response.data.courses);
    } catch (error) {
      console.error('Failed to fetch instructor courses:', error);
      setError('Unable to load your dashboard. Please refresh or try again later.');
      setInstructorCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'instructor') {
      fetchInstructorCourses();
    } else {
      fetchStudentDashboard();
    }
  }, [user, fetchStudentDashboard, fetchInstructorCourses]);

  const handleUnenroll = async (courseId) => {
    try {
      await coursesAPI.unenrollCourse(courseId);
      fetchStudentDashboard();
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await coursesAPI.deleteCourse(courseId);
      fetchInstructorCourses();
    } catch (error) {
      console.error('Failed to remove course:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await coursesAPI.enrollCourse(courseId);
      fetchStudentDashboard();
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome, {user?.fullName}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user?.role === 'instructor' ? 'Instructor Dashboard' : 'Student Dashboard'}
        </Typography>
        {user?.role === 'student' && (
          <Button
            variant="contained"
            component={Link}
            to="/my-submissions"
            sx={{ mt: 2 }}
          >
            View My Submissions
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Courses" id="tab-0" aria-controls="tabpanel-0" />
          {user?.role === 'instructor' && <Tab label="Instructor Tools" id="tab-1" aria-controls="tabpanel-1" />}
          <Tab
            label="Profile"
            id={`tab-${user?.role === 'instructor' ? 2 : 1}`}
            aria-controls={`tabpanel-${user?.role === 'instructor' ? 2 : 1}`}
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {user?.role === 'instructor' ? (
              instructorCourses.length > 0 ? (
                <Grid container spacing={3}>
                  {instructorCourses.map((course) => (
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
                          <Button
                            size="small"
                            component={Link}
                            to={`/courses/${course._id}`}
                          >
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
                <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                  No courses created yet.{' '}
                  <Link to="/create-course" style={{ color: '#1976d2' }}>
                    Add your first course
                  </Link>
                </Typography>
              )
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  My Courses
                </Typography>
                <Grid container spacing={3}>
                  {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                      <Grid item xs={12} sm={6} md={4} key={enrollment._id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {enrollment.course?.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {enrollment.course?.instructor?.fullName}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Progress
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={enrollment.progress || 0}
                              sx={{ mb: 2 }}
                            />
                            <Typography variant="caption">
                              {enrollment.progress || 0}%
                            </Typography>
                            {enrollment.completed && (
                              <Typography variant="body2" sx={{ mt: 2, color: 'green' }}>
                                ✓ Completed
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              component={Link}
                              to={`/courses/${enrollment.course?._id}`}
                            >
                              View Course
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUnenroll(enrollment.course?._id)}
                            >
                              Cancel Enrollment
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    allCourses.filter((course) =>
                      course.students?.some(
                        (student) => student._id?.toString() === user.id || student.toString() === user.id
                      )
                    ).map((course) => (
                      <Grid item xs={12} sm={6} md={4} key={course._id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {course.instructor?.fullName}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Progress
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={0}
                              sx={{ mb: 2 }}
                            />
                            <Typography variant="caption">
                              0%
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              component={Link}
                              to={`/courses/${course._id}`}
                            >
                              View Course
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUnenroll(course._id)}
                            >
                              Cancel Enrollment
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Available Courses
                  </Typography>
                  {allCourses.filter((course) => !enrollments.some((enrollment) => enrollment.course?._id === course._id)).length > 0 ? (
                    <Grid container spacing={3}>
                      {allCourses.filter((course) => !enrollments.some((enrollment) => enrollment.course?._id === course._id)).map((course) => (
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
                                Instructor: {course.instructor?.fullName || 'Unknown'}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                size="small"
                                component={Link}
                                to={`/courses/${course._id}`}
                              >
                                View Course
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleEnroll(course._id)}
                              >
                                Enroll
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No available courses at the moment.
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </TabPanel>

      {user?.role === 'instructor' && (
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3, mb: 3 }}>
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
              Manage Courses
            </Button>
          </Paper>
          <Typography variant="body1">
            Your instructor tools give you the ability to create courses, add assignments, and upload learning materials.
          </Typography>
        </TabPanel>
      )}

      <TabPanel value={tabValue} index={user?.role === 'instructor' ? 2 : 1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Profile Information
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Full Name
            </Typography>
            <Typography variant="body1">{user?.fullName}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Role
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default Dashboard;
