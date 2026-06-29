const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  getEnrolledCourses,
  getInstructorCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllCourses);

// Protected routes
router.post('/enroll', protect, enrollCourse);
router.delete('/unenroll', protect, unenrollCourse);
router.get('/my-courses', protect, getEnrolledCourses);
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:id', getCourse);

// Instructor/Admin routes
router.post('/', protect, authorize('instructor', 'admin'), upload.single('image'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), upload.single('image'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
