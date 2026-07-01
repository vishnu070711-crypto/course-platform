import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, BACKEND_URL } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Grid,
  Stack
} from '@mui/material';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await coursesAPI.getCourseById(id);
      const courseData = response.data.course;
      setCourse(courseData);
      if (user) {
        const enrolled = courseData.students?.some((student) => {
          if (!student) return false;
          return student._id?.toString() === user.id || student.toString() === user.id;
        });
        setIsEnrolled(Boolean(enrolled));
      } else {
        setIsEnrolled(false);
      }
    } catch (err) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchAssignments = useCallback(async () => {
    setLoadingAssignments(true);
    try {
      const response = await coursesAPI.getCourseAssignments(id);
      setAssignments(response.data.assignments || []);
    } catch (err) {
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  useEffect(() => {
    if (user) fetchAssignments();
  }, [fetchAssignments, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const coursePrice = Number(course?.price || 0);
    const requiresPayment = coursePrice > 0;

    if (requiresPayment) {
      const confirmed = window.confirm(`This course costs $${coursePrice}. Proceed with payment and enroll?`);
      if (!confirmed) {
        return;
      }
    }

    try {
      setEnrolling(true);
      await coursesAPI.enrollCourse(id, requiresPayment);
      alert(requiresPayment ? 'Payment received and enrollment complete!' : 'Successfully enrolled in course!');
      setIsEnrolled(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await coursesAPI.unenrollCourse(id);
      alert('Successfully canceled enrollment.');
      setIsEnrolled(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel enrollment');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                backgroundColor: '#e0e0e0',
                height: 400,
                mb: 3,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              {course.title}
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Rating value={course.rating} readOnly />
              <Typography variant="body2">({course.students?.length || 0} students)</Typography>
            </Box>

            <Chip label={course.category} color="primary" sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              About this course
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              {course.description}
            </Typography>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Instructor
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {course.instructor?.fullName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {course.instructor?.email}
              </Typography>
            </Paper>

            {user?.role === 'instructor' && user.id === course.instructor?._id && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Enrolled Students ({course.students?.length || 0})
                </Typography>
                {course.students?.length > 0 ? (
                  course.students.map((student) => (
                    <Paper key={student._id} sx={{ p: 2, mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {student.fullName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Email: {student.email || 'No email available'}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No students enrolled yet.
                  </Typography>
                )}
              </Box>
            )}

            {course.modules && course.modules.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 'bold' }}>
                  Course Content
                </Typography>
                {course.modules.map((module, idx) => (
                  <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Module {idx + 1}: {module.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {module.lessons?.length || 0} lessons
                    </Typography>
                  </Paper>
                ))}
              </>
            )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Assignments
              </Typography>

              {loadingAssignments ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : assignments.length > 0 ? (
                <Grid container spacing={2}>
                  {assignments.map((assignment) => (
                    <Grid item xs={12} key={assignment._id}>
                      <Paper sx={{ p: 2 }}>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {assignment.title}
                          </Typography>
                          <Typography variant="body2">{assignment.description}</Typography>
                          {assignment.dueDate && (
                            <Typography variant="caption" color="textSecondary">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Typography>
                          )}

                          {assignment.attachment && (
                            <Button
                              size="small"
                              href={assignment.attachment.startsWith('http') ? assignment.attachment : `${BACKEND_URL}${assignment.attachment}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Attachment
                            </Button>
                          )}

                          {user?.role === 'student' && (
                            <Button size="small" variant="contained" component={Link} to={`/assignments/${assignment._id}/submit`}>
                              Submit Assignment
                            </Button>
                          )}
                          {user?.role === 'instructor' && user.id === course.instructor?._id && (
                            <Button size="small" variant="outlined" component={Link} to={`/assignments/${assignment._id}/submissions`}>
                              View Submissions
                            </Button>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">No assignments available yet.</Typography>
              )}

              {user?.role === 'instructor' && user.id === course.instructor?._id && (
                <Box sx={{ mt: 3 }}>
                  <Button component={Link} to={`/courses/${id}/add-assignment`} variant="contained">Add Assignment</Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{'$' + (course.price || 0)}</Typography>
            {user?.role !== 'instructor' && (
              isEnrolled ? (
                <Button variant="outlined" color="error" size="large" fullWidth onClick={handleUnenroll} disabled={enrolling} sx={{ mb: 2 }}>
                  {enrolling ? 'Processing...' : 'Cancel Enrollment'}
                </Button>
              ) : (
                <Button variant="contained" size="large" fullWidth onClick={handleEnroll} disabled={enrolling} sx={{ mb: 2 }}>
                  {enrolling ? 'Processing...' : Number(course?.price || 0) > 0 ? 'Pay & Enroll' : 'Enroll Now'}
                </Button>
              )
            )}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>✓ Lifetime access</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>✓ Certificate of completion</Typography>
              <Typography variant="body2">✓ 30-day money-back guarantee</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;
