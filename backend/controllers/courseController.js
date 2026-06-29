const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc Get all courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'fullName email')
      .populate('students', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single course
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'fullName email bio')
      .populate('students', 'fullName email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create course (Instructor/Admin only)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: Number(price || 0),
      image,
      instructor: req.user.id
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update course
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user is instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete course
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user is instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Enroll in course
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId, paymentConfirmed = false } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const requiresPayment = Number(course.price || 0) > 0;

    if (requiresPayment && !paymentConfirmed) {
      return res.status(402).json({
        success: false,
        message: `Payment required to enroll in this course. Please complete payment of $${course.price}.`
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });

    // Add student to course
    course.students.push(req.user.id);
    await course.save();

    res.status(201).json({
      success: true,
      message: requiresPayment ? 'Payment received and enrollment complete' : 'Successfully enrolled in course',
      enrollment,
      paymentRequired: requiresPayment,
      paymentAmount: course.price
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get enrolled courses
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'fullName email'
        }
      });

    res.status(200).json({
      success: true,
      enrollments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Unenroll from course
exports.unenrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = await Enrollment.findOneAndDelete({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(400).json({ success: false, message: 'You are not enrolled in this course' });
    }

    course.students = course.students.filter(
      (studentId) => studentId.toString() !== req.user.id
    );
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get courses for instructor
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
