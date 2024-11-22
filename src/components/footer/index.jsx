import React from 'react';
import './Footer.css';
import { FaGithub, FaTwitter, FaBehance, FaLinkedin, FaMedium, FaTelegram } from "react-icons/fa";
import {pers} from '../../utils/pers';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-about sml">
                        <h3>About Us</h3>
                        <p>Sharing thoughts and ideas on various topics. Join us on our journey of exploration and discovery.</p>
                    </div>

                    <div className="footer-links smll">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/settings">Settings</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-social smll">
                        <h3>Follow Us</h3>
                        <ul className="social-icons">
                            <li><a href={pers.linkedin}><FaLinkedin /></a></li>
                            <li><a href={pers.twitter}><FaTwitter /></a></li>
                            <li><a href={pers.telegram}><FaTelegram /></a></li>
                            <li><a href={pers.github}><FaGithub /></a></li>
                            <li><a href={pers.medium}><FaMedium /></a></li>
                            <li><a href={pers.behance}><FaBehance /></a></li>
                        </ul>
                    </div>

                    <div className="footer-subscribe sml">
                        <h3>Subscribe</h3>
                        <form>
                            <input type="email" placeholder="Your email address" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 {pers.app}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
