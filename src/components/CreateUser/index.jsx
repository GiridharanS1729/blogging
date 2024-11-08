import React, { useState } from "react";
import './createUser.css';
import axios from "axios";
import swal from 'sweetalert';
import { useLocation } from 'react-router-dom';

export default function CreateUser() {
    const location = useLocation();
    const userEmail = location.state?.email || ''; // Get email passed from Signup

    const [formData, setFormData] = useState({
        author: '',
        bio: '',
        aimage: null,
        publication: '',
        category: 'Innovation',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("author", formData.author);
        data.append("bio", formData.bio);
        data.append("publication", formData.publication);
        data.append("category", formData.category);
        data.append("email", userEmail); // Send email received from Signup
        if (formData.aimage) data.append("aimage", formData.aimage);

        try {
            const response = await axios.post("http://localhost:1729/createuser", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            swal("Success", "User created successfully!", "success");
            setFormData({
                author: '',
                bio: '',
                aimage: null,
                publication: '',
                category: 'Innovation',
            });
            console.log("User created:", response.data);
        } catch (error) {
            swal("Error", "Server error while creating user", "error");
            console.error("Error creating user:", error);
        }
    };

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            aimage: e.target.files[0],
        }));

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="user-container">
            <label>
                Author:
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Bio:
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                ></textarea>
            </label>
            <label>
                Publication:
                <input
                    type="text"
                    name="publication"
                    value={formData.publication}
                    onChange={handleChange}
                />
            </label>
            <label>
                Category:
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="Innovation">Innovation</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                </select>
            </label>
            <label>
                Profile Image:
                <input type="file" onChange={handleImageChange} />
                {imagePreview && (
                    <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100 }} />
                )}
            </label>
            <button type="submit">Create User</button>
        </form>
    );
}
