import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Stack,
  Alert
} from '@mui/material';

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await coursesAPI.getAssignmentSubmissions(assignmentId);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, grade, feedback, idx) => {
    try {
      await coursesAPI.gradeSubmission(submissionId, { grade, feedback });
      const updated = [...submissions];
      updated[idx] = { ...updated[idx], grade, feedback };
      setSubmissions(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grade');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Submissions</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {submissions.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {submissions.map((sub, idx) => (
            <Paper key={sub._id} sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{sub.student?.fullName || 'Unknown Student'}</Typography>
              <Typography variant="body2" color="textSecondary">{sub.originalName}</Typography>
              <Box sx={{ my: 1 }}>
                <Button
                  size="small"
                  href={sub.file?.startsWith('http') ? sub.file : `${BACKEND_URL}${sub.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Submission
                </Button>
              </Box>

              <Box component="form" onSubmit={(e) => { e.preventDefault(); const form = e.target; const grade = form.grade.value; const feedback = form.feedback.value; handleGrade(sub._id, grade, feedback, idx); }}>
                <TextField name="grade" label="Grade (0-100)" type="number" defaultValue={sub.grade ?? ''} sx={{ mr: 2, width: 140 }} />
                <TextField name="feedback" label="Feedback" defaultValue={sub.feedback ?? ''} fullWidth multiline rows={3} sx={{ mt: 2 }} />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained">Save</Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default AssignmentSubmissions;
