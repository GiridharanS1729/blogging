import React, { useState } from "react";
import './createUser.css';
import axios from "axios";
import swal from 'sweetalert';
import 'react-quill/dist/quill.snow.css';

export default function CreateUser() {

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData({
                ...formData,
                aimage: reader.result
            });
        };

        if (file) {
            reader.readAsDataURL(file);  // Only call readAsDataURL once
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
            <button type="submit">Update User</button>
        </form>
    );
}
