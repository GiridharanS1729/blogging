import React, { useState } from "react";
import './createUser.css';
import axios from "axios";
import swal from 'sweetalert';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

export default function CreateUser() {

    const [formData, setFormData] = useState({
        author: '',
        bio: '',
        aimage: null,
        publication: '',
        category: 'Innovation',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let iid = localStorage.getItem('aaid');

        // Convert _id to a number
        iid = Number(iid);

        if (isNaN(iid)) {
            swal("Error", "Invalid User ID!", "error");
            return;
        }

        const aimage = formData.aimage ? formData.aimage : '/images/aut.png';

        const data = {
            _id: iid, // sending _id as a number
            author: formData.author,
            bio: formData.bio,
            publication: formData.publication,
            category: formData.category,
            aimage: aimage,
        };

        try {
            const response = await axios.put("http://localhost:1729/createuser", data, {
                headers: { "Content-Type": "application/json" },
            });

            swal("Success", "User updated successfully!", "success");

            // window.location.href = "/"
            // localStorage.setItem("aid", _id)

            localStorage.setItem("aid", iid);
            navigate('/');
            setTimeout(() => {
                window.location.reload();
            }, 100);
            setFormData({
                author: '',
                bio: '',
                aimage: null,
                publication: '',
                category: 'Innovation',
            });

            console.log("User updated:", response.data);
        } catch (error) {
            swal("Error", "Server error while updating user", "error");
            console.error("Error updating user:", error);
        }
    };

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (file && file.size <= 10 * 1024 * 1024) { // Accept files up to 10MB
            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 0.04, // Target size below 40KB
                    maxWidthOrHeight: 800, // Resize to 800px max width/height
                    useWebWorker: true
                });
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImagePreview(reader.result);
                    setFormData({
                        ...formData,
                        aimage: reader.result,
                    });
                };
                reader.readAsDataURL(compressedFile); // Only call readAsDataURL once
            } catch (error) {
                console.error("Error compressing the image", error);
            }
        } else {
            console.error("File size exceeds the 10MB limit.");
        }
    };




    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <h2 className="form-title">Profile Information</h2>

            <div className="input-group">
                <label className="label-name">Name:</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input-name"
                    required
                />
            </div>

            <div className="input-group">
                <label className="label-bio">BIO:</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-bio"
                    required
                ></textarea>
            </div>

            <div className="input-group">
                <p className="label-publication">Publication:</p>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="publication"
                        value="Science"
                        checked={formData.publication === "Science"}
                        onChange={handleChange}
                    />
                    Science
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="publication"
                        value="Technology"
                        checked={formData.publication === "Technology"}
                        onChange={handleChange}
                    />
                    Technology
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="publication"
                        value="Daily News"
                        checked={formData.publication === "Daily News"}
                        onChange={handleChange}
                    />
                    Daily News
                </label>
            </div>

            <div className="input-group">
                <label className="label-category">Innovation</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-category"
                >
                    <option value="Innovation">Innovation</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                </select>
            </div>

            <div className="image-upload">
                <label htmlFor="aimage" className="label-image">
                    Choose/Change Image
                </label>
                <input
                    id="aimage"
                    type="file"
                    onChange={handleImageChange}
                    className="input-image"
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                    />
                )}
                <p className="preview-text">Preview the image</p>
            </div>


            <button type="submit" className="button-save">Save</button>
        </form>
    );
}
