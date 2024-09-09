import React from 'react';
import './Footer.css';
import { FaGithub, FaTwitter, FaBehance, FaLinkedin, FaMedium, FaTelegram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-about">
                        <h3>About Us</h3>
                        <p>Sharing thoughts and ideas on various topics. Join us on our journey of exploration and discovery.</p>
                    </div>

                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/settings">Settings</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h3>Follow Us</h3>
                        <ul className="social-icons">
                            <li><a href="#"><FaLinkedin /></a></li>
                            <li><a href="#"><FaTwitter /></a></li>
                            <li><a href="#"><FaTelegram /></a></li>
                            <li><a href="#"><FaGithub /></a></li>
                            <li><a href="#"><FaMedium /></a></li>
                            <li><a href="#"><FaBehance /></a></li>
                        </ul>
                    </div>

                    <div className="footer-subscribe">
                        <h3>Subscribe</h3>
                        <form>
                            <input type="email" placeholder="Your email address" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Giridharan blogs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
