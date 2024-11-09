import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [mail, setMail] = useState('g@gmail.com');
    const [password, setPassword] = useState('g');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:1729/login', { mail, password })
            .then(response => {
                if (response.data.success) {
                    localStorage.setItem('aid', response.data.aid);
                    navigate('/');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1);
                } else {
                    setError('Invalid email or password');
                }
            })
            .catch(err => {
                setError(`Something went wrong, please try again${err}`);
            });
    };

    return (
        <section className='login-main'>
            {[...Array(150)].map((_, i) => (
                <span key={i}></span>
            ))}
            <div className="login">
                <div className="content">
                    <h2>Login</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        {error && <p className="error">{error}</p>}
                        <div className="inputBox">
                            <input
                                type="text"
                                required
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <i>Email</i>
                        </div>
                        <div className="inputBox">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <a href="/signup">Signup</a>
                        </div>
                        <div className="inputBox">
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
