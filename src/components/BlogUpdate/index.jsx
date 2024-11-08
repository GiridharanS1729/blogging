// UpdateBlog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './updateBlog.css';

export default function UpdateBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state || {};
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    subject: blog?.subject || '',
    description: blog?.description || '',
    imagepath: blog?.imagepath || ''
  });

  useEffect(() => {
    if (!blog) {
      navigate('/settings');
    }
  }, [blog, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const cleanedDescription = formData.description.replace(/<[^>]*>/g, "");
    const updatedBlog = { ...blog, ...formData, description: cleanedDescription };

    axios.put(`http://localhost:1729/updateblog/${blog._id}`, updatedBlog)
      .then(() => {
        Swal.fire('Updated!', 'Your blog has been updated.', 'success');
        navigate('/settings');
      })
      .catch(error => console.error('Error updating blog:', error));
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        imagepath: reader.result
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleEditorChange(value) {
    setFormData({
      ...formData,
      description: value
    });
  }

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
              value={formData.title}
              onChange={handleChange}
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
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imagepath">Image</label>
            <input
              type="file"
              id="imagepath"
              name="imagepath"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <ReactQuill
              value={formData.description}
              onChange={handleEditorChange}
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
