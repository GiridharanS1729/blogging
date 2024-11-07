// UpdateBlog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './updateBlog.css';

export default function UpdateBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};
  const [title, setTitle] = useState(blog?.title || '');
  const [subject, setSubject] = useState(blog?.subject || '');
  const [description, setDescription] = useState(blog?.description || '');

  useEffect(() => {
    if (!blog) {
      navigate('/settings');
    }
  }, [blog, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedBlog = { ...blog, title, subject, description };

    axios.put(`http://localhost:1729/updateblog/${blog._id}`, updatedBlog)
      .then(() => {
        Swal.fire('Updated!', 'Your blog has been updated.', 'success');
        navigate('/settings');
      })
      .catch(error => console.error('Error updating blog:', error));
  };

  return (
    <div className="update-blog-wrapper">
      <h2 className="update-blog-heading">Edit Blog</h2>
      <form onSubmit={handleUpdate} className="update-blog-form">
        <label className="update-blog-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="update-blog-input"
        />

        <label className="update-blog-label">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="update-blog-input"
        />

        <label className="update-blog-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="update-blog-textarea"
        ></textarea>

        <button type="submit" className="update-blog-button">Update Blog</button>
      </form>
    </div>
  );
}
