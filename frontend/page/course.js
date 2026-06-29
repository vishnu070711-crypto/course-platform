import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      await axios.post('http://localhost:5000/api/courses', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Course created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Create New Course</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Course Title" value={formData.title} onChange={handleChange} required style={{width: '100%', padding: '10px', margin: '8px 0'}} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required rows="5" style={{width: '100%', padding: '10px', margin: '8px 0'}} />
        <input type="number" name="price" placeholder="Price (USD)" value={formData.price} onChange={handleChange} required style={{width: '100%', padding: '10px', margin: '8px 0'}} />
        <input type="file" accept="image/*" onChange={handleFileChange} style={{margin: '10px 0'}} />
        <button type="submit" style={{padding: '12px 30px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer'}}>Create Course</button>
      </form>
    </div>
  );
}

export default CreateCourse;