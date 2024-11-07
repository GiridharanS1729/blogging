// UpdateBlog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './updateblog.css';

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
    <div className="update-post">
      <div className="post-form-container">
        <form onSubmit={handleUpdate} className="form-container">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <ReactQuill
              value={description}
              onChange={(value) => setDescription(value)}
              modules={UpdateBlog.modules}
              formats={UpdateBlog.formats}
              className="editor-container"
            />
          </div>
          <button type="submit" className="btn btn-primary submit">Update Blog</button>
        </form>
      </div>
    </div>
  );
}

UpdateBlog.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }],
    ['bold', 'italic', 'underline'],
    ['image', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'size': [] }]
  ],
};

UpdateBlog.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background', 'align', 'code-block'
];

