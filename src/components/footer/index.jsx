/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './st.css';
import { FaGithub, FaTwitter, FaBehance, FaLinkedin, FaMedium, FaTelegram } from "react-icons/fa";
export default function Footer() {
    return (
        <div>
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-about">
                            <h3>About Us</h3>
                            <p>Sharing thoughts and ideas on various topics. Join us on our journey of exploration and discovery.</p>
                        </div>
                        <div class="footer-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div class="footer-social">
                            <h3>Follow Us</h3>
                            <ul>
                                <li><a href="#"><FaLinkedin /></a></li>
                                <li><a href="#"><FaTwitter /></a></li>
                                <li><a href="#"><FaTelegram /></a></li>
                                <li><a href="#"><FaGithub /></a></li>
                                <li><a href="#"><FaMedium /></a></li>
                                <li><a href="#"><FaBehance /></a></li>

                            </ul>
                        </div>
                        <div class="footer-subscribe">
                            <h3>Subscribe</h3>
                            <form>
                                <input type="email" placeholder="Your email address" />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2024 Giridharan blogs . All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    )
}
