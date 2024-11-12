import React, { useState } from "react";
import './signup.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import { prt } from '../../utils/prt';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: 'z',
        email: 'z@gmail.com',
        password: 'z'
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update backend route if expecting `mail` instead of `email`
            const response = await axios.post(`${prt}/signup`, {
                mail: formData.email, // Replace `email` with `mail`
                password: formData.password
            });
            const userId = response.data._id;
            swal("Success", "Signup successful!", "success");

            localStorage.setItem("aaid", userId);
            navigate('/createuser', { state: { email: formData.email } });
        } catch (error) {
            swal("Error", "Signup failed", "error");
            console.error("Error creating user:", error);
        }
    };

    return (
        <section className="signup-main">
            {[...Array(150)].map((_, i) => (
                <span key={i}></span>
            ))}
            <div className="signup">
                <div className="content">
                    <h2>Sign up</h2>
                    <div className="form">
                        <div className="inputBox">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <i>Username</i>
                        </div>
                        <div className="inputBox">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <i>Email</i>
                        </div>
                        <div className="inputBox">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <i>Password</i>
                        </div>
                        <div className="links">
                            <div className="shpas">
                                <input
                                    type="checkbox"
                                    name="pas"
                                    id="pas"
                                    onChange={togglePasswordVisibility}
                                />
                                &nbsp;&nbsp;
                                <a href="#" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? 'Hide Password' : 'Show Password'}
                                </a>
                            </div>
                            <a href="/login">Login</a>
                        </div>
                        <div className="inputBox">
                            <input
                                type="submit"
                                value="Signup"
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
