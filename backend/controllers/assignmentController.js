const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    const courseId = req.params.courseId;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to add assignments for this course' });
    }

    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const assignment = await Assignment.create({
      course: courseId,
      instructor: req.user.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      attachment: attachmentUrl
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseAssignments = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (req.user.role === 'student') {
      const alreadyEnrolled = course.students.some((studentId) => studentId.toString() === req.user.id);
      if (!alreadyEnrolled) {
        return res.status(403).json({ success: false, message: 'Enroll in the course to see assignments' });
      }
    }

    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrolled = course.students.some((studentId) => studentId.toString() === req.user.id);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: 'You must be enrolled in the course to submit this assignment' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file for this submission' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      file: fileUrl,
      originalName: req.file.originalname
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already submitted this assignment' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssignmentSubmissions = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view submissions for this assignment' });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'fullName email')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate({
        path: 'assignment',
        select: 'title course',
        populate: { path: 'course', select: 'title' }
      })
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const submissionId = req.params.submissionId;
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(submissionId).populate({ path: 'assignment', select: 'course' });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const course = await Course.findById(submission.assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to grade this submission' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
