// About.js
import React from 'react';
import './style.css';
import { pers } from '../../utils/pers';

export default function About() {
    return (
        <section className="about">
            <div className="about-container">
                <h1>About Us</h1>
                <p>Welcome to <strong>{pers.app}</strong>, where we explore the latest in technology, programming, and digital innovation. Our team of passionate writers is dedicated to providing you with in-depth articles, insightful tutorials, and valuable resources.</p>
                <p>Our mission is to empower tech enthusiasts and professionals by sharing knowledge and fostering a community of learning. Join us in our journey to make technology accessible and exciting for everyone!</p>
                <p>Stay tuned for regular updates, and connect with us on <a href={pers.linkedin} target="_blank" rel="noopener noreferrer">social media</a>.</p>
            </div>
        </section>
    );
}
