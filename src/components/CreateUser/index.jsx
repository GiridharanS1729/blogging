import React, { useState } from "react";
import './createUser.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
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
        <form onSubmit={handleSubmit} className="form-container">
            <label className="label-author">
                Your Name:
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input-author"
                    required
                />
            </label>
            <label className="label-bio">
                Bio:
                <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-bio"
                    required
                />
            </label>
            <div className="image-upload-container">
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                    />
                )}
                <label className="label-image">
                    <span className="label-text">{imagePreview ? "Change Image" : "Choose Image"}</span>
                    <input
                        type="file"
                        name="aimage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input-image"
                    />
                </label>
            </div>
            <br />
            <fieldset className="fieldset-publication">
                <legend className="legend-publication">Publication</legend>
                <label className="label-tech">
                    <input
                        type="radio"
                        name="publication"
                        value="Tech Trends"
                        checked={formData.publication === 'Tech Trends'}
                        onChange={handleChange}
                        className="radio-tech"
                    />
                    Tech Trends
                </label>
                <label className="label-science">
                    <input
                        type="radio"
                        name="publication"
                        value="Science Daily"
                        checked={formData.publication === 'Science Daily'}
                        onChange={handleChange}
                        className="radio-science"
                    />
                    Science Daily
                </label>
                <label className="label-global">
                    <input
                        type="radio"
                        name="publication"
                        value="Global Insights"
                        checked={formData.publication === 'Global Insights'}
                        onChange={handleChange}
                        className="radio-global"
                    />
                    Global Insights
                </label>
            </fieldset>
            <label className="label-category">
                Category:
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-category"
                    required
                >
                    <option value="Innovation">Innovation</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Health">Health</option>
                </select>
            </label>
            <button type="submit" className="button-submit">Submit</button>
        </form>
    );
}