import React, { useEffect, useState } from 'react';
import { coursesAPI, BACKEND_URL } from '../services/api';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Alert,
  Stack
} from '@mui/material';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await coursesAPI.getMySubmissions();
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Submissions
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {submissions.length === 0 ? (
        <Typography>No submissions yet. Once you submit assignments, they will appear here.</Typography>
      ) : (
        <Stack spacing={3}>
          {submissions.map((submission) => (
            <Paper key={submission._id} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {submission.assignment?.title || 'Assignment'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Course: {submission.assignment?.course?.title || 'Unknown course'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Original file: {submission.originalName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Grade: {submission.grade != null ? submission.grade : 'Pending'}
              </Typography>
              {submission.feedback && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Feedback: {submission.feedback}
                </Typography>
              )}
              <Button
                size="small"
                variant="contained"
                href={submission.file?.startsWith('http') ? submission.file : `${BACKEND_URL}${submission.file}`}
                target="_blank"
                rel="noreferrer"
              >
                View Submission
              </Button>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MySubmissions;
