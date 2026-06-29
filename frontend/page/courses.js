import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data));
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <Link to={`/courses/${course._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}

export default Courses;