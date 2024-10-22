import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import swal from 'sweetalert';
import "./createpost.css";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "title",
    body: "body",
    imagepath: ""
  });

  const navigate = useNavigate();

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

      console.log(updatedFormData);  // Log the data to be sent

      await axios.post("http://localhost:1729/createpost", updatedFormData);

      swal({
        title: "Post Created!",
        text: "Your blog post has been successfully created.",
        icon: "success",
        button: "OK",
      }).then(() => {
        setFormData({
          title: "",
          body: "",
          imagepath: ""
        });
        navigate('/');
      });
    } catch (error) {
      console.error("Error submitting the form:", error.response || error.message);

      // Error feedback to user
      swal({
        title: "Error!",
        text: "There was an issue while creating your post. Please try again.",
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
              // required
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
