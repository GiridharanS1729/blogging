import React,{useState} from "react";
import './signup.css';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                            <input type="text" required />
                            <i>Username</i>
                        </div>
                        <div className="inputBox">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
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
                            <input type="submit" value="Signup" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
