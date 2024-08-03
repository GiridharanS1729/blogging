// Contact.js
import React from 'react';
import './cont.css';

export default function Contact() {
    return (
        <section className="contact">
            <div className="contact-container">
                <h1>Get in Touch</h1>
                <p>We’d love to hear from you! Whether you have questions, feedback, or just want to connect, feel free to reach out using the form below or via our social media channels.</p>
                <form>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="6" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
                {/* <p>Follow us on <a href="[Your Social Media Link]" target="_blank" rel="noopener noreferrer">social media</a> for updates and more.</p> */}
            </div>
        </section>
    );
}
