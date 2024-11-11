import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import swal from 'sweetalert';
import "./createblog.css";
import imageCompression from 'browser-image-compression';
import { prt } from '../../utils/prt';

function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "title",
    subject:"subject",
    description: "description",
    imagepath: ""
  });

  const aid = parseInt(localStorage.getItem('aid')) || 1;
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];

    if (file && file.size <= 10 * 1024 * 1024) { // Accept files up to 10MB
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.04, // Target size below 40KB
          maxWidthOrHeight: 800,
          useWebWorker: true
        });
        const reader = new FileReader();

        reader.onloadend = () => {
          setFormData({
            ...formData,
            imagepath: reader.result
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing the image", error);
      }
    } else {
      console.error("File size exceeds the 10MB limit.");
    }
  }



  function handleEditorChange(value) {
    setFormData({
      ...formData,
      description: value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const cleanedBody = formData.description;
      const updatedFormData = {
        ...formData,
        aid: aid,
        description: cleanedBody
      };


      console.log(updatedFormData);

      await axios.post(`${prt}/createblog`, updatedFormData);

      swal({
        title: "Post Created!",
        text: "Your blog post has been successfully created.",
        icon: "success",
        button: "OK",
      }).then(() => {
        setFormData({
          title: "",
          description: "",
          imagepath: ""
        });
        navigate('/');
      });
    } catch (error) {
      console.error("Error submitting the form:", error.response || error.message);

      // Error feedback to user
      swal({
        title: "Error!",
        text: "There was an issue while creating your post. Please try again."+error,
        icon: "error",
        button: "OK",
      });
    }
  }


  return (
    <div className="create-post">
      <div className="post-form-container">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            {/* <label htmlFor="title">Title</label> */}
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Choose a title"
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="title">Subject</label> */}
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Add a new Subject"
            />
          </div>
          <div className="form-group">
              <label htmlFor="imagepath" className="label-imag">
                Add a Cover Image
              </label>

            <input
              type="file"
              id="imagepath"
              name="imagepath"
              onChange={handleImageChange}
              // required
                className="input-imag"
              />
          </div>
          <div className="form-group">
            {/* <label htmlFor="description">Description</label> */}
            <ReactQuill
              value={formData.description}
              onChange={handleEditorChange}
              modules={CreateBlog.modules}
              formats={CreateBlog.formats}
              className="editor-container"
              placeholder="Write your content here..."
            />
          </div>
          <br/>
          <button type="submit" className="submit">Publish</button>
        </form>
      </div>
    </div>
  );
}

CreateBlog.modules = {
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

CreateBlog.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background', 'align', 'code-block'
];

export default CreateBlog;
