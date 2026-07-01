import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';
export const BACKEND_URL = API_URL.replace(/\/api$/, '');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data)
};

// Courses API calls
const formDataHeaders = (data) =>
  data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};

export const coursesAPI = {
  getAllCourses: (params) => apiClient.get('/courses', { params }),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  getInstructorCourses: () => apiClient.get('/courses/instructor'),
  createCourse: (data) => apiClient.post('/courses', data, formDataHeaders(data)),
  updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data, formDataHeaders(data)),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  enrollCourse: (courseId, paymentConfirmed = false) => apiClient.post('/courses/enroll', { courseId, paymentConfirmed }),
  unenrollCourse: (courseId) => apiClient.delete('/courses/unenroll', { data: { courseId } }),
  getEnrolledCourses: () => apiClient.get('/courses/my-courses'),
  createAssignment: (courseId, data) => apiClient.post(`/assignments/courses/${courseId}/assignments`, data, formDataHeaders(data)),
  submitAssignment: (assignmentId, data) => apiClient.post(`/assignments/${assignmentId}/submissions`, data, formDataHeaders(data)),
  getCourseAssignments: (courseId) => apiClient.get(`/assignments/courses/${courseId}/assignments`),
  getMySubmissions: () => apiClient.get('/assignments/my-submissions'),
  getAssignmentSubmissions: (assignmentId) => apiClient.get(`/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId, data) => apiClient.patch(`/assignments/submissions/${submissionId}`, data)
};

export default apiClient;
