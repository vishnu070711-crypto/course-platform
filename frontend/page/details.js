import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => setCourse(res.data));
  }, [id]);

  const enroll = () => {
    axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => alert('Enrolled!'));
  };

  return (
    <div>
      {course && (
        <>
          <h1>{course.title}</h1>
          {user && <button onClick={enroll}>Enroll</button>}
          <h2>Lessons</h2>
          {course.lessons.map((lesson, i) => (
            <div key={i}>
              <h3>{lesson.title}</h3>
              <video controls width="600">
                <source src={lesson.videoUrl} type="video/mp4" />
              </video>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default CourseDetail;