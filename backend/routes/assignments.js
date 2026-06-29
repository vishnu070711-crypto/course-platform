const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  getMySubmissions
} = require('../controllers/assignmentController');

router.post('/courses/:courseId/assignments', protect, authorize('instructor', 'admin'), upload.single('attachment'), createAssignment);
router.get('/courses/:courseId/assignments', protect, getCourseAssignments);
router.post('/:assignmentId/submissions', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/:assignmentId/submissions', protect, authorize('instructor', 'admin'), getAssignmentSubmissions);
router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.patch('/submissions/:submissionId', protect, authorize('instructor', 'admin'), require('../controllers/assignmentController').gradeSubmission);

module.exports = router;
