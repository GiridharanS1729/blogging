import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./createpost.css";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    body: "",
    imagepath: ""
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = new Date().toLocaleTimeString();

    setFormData({
      ...formData,
      [name]: value,
      date: currentDate,
      time: time
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
      body: value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const cleanedBody = formData.body.replace(/<[^>]*>/g, "");
      const updatedFormData = {
        ...formData,
        body: cleanedBody
      };
      navigate('/');
      await axios.post("http://localhost:1729/createpost", updatedFormData);
      setFormData({
        title: "",
        date: "",
        time: "",
        body: "",
        imagepath: ""
      });

    } catch (e) {
      console.error("Error submitting the form:", e);
    }
  }

  return (
    <div className="create-post">
      <div className="post-form-container">
        {/* <h2>Create a New Post</h2> */}
        <form onSubmit={handleSubmit} className="form-container">
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
            <label htmlFor="imagepath">Image</label>
            <input
              type="file"
              id="imagepath"
              name="imagepath"
              onChange={handleImageChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Body</label>
            <ReactQuill
              value={formData.body}
              onChange={handleEditorChange}
              modules={CreatePost.modules}
              formats={CreatePost.formats}
              className="editor-container"
            />
          </div>
          <button type="submit" className="btn btn-primary submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

CreatePost.modules = {
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

CreatePost.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background', 'align', 'code-block'
];

export default CreatePost;
