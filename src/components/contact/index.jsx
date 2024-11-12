// Contact.js
import React, { useState } from 'react';
import './cont.css';
import swal from 'sweetalert';
import { pers } from '../../utils/pers';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const donesubmit = () => {
        swal({
            title: "Success!",
            text: "Your message has been submitted successfully.",
            icon: "success",
            button: "OK",
        }).then(() => {
            setName('');
            setEmail('');
            setMessage('');
        });
    };

    return (
        <section class="contact-section">
            <div class="contact-container">
                <div class="contact-info">
                    <h1 class="contact-title">Get in touch</h1>
                    <p class="contact-subtitle">Fill in the form to start a conversation</p>
                    <div class="contact-details">
                        <p class="contact-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon">
                                <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                            <span>{pers.address}</span>
                        </p>
                        <p class="contact-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                            </svg>
                            <span>{pers.phone}</span>
                        </p>
                        <p class="contact-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                            <span>{pers.email}</span>
                        </p>
                    </div>
                </div>
                <form class="contact-form">
                    <label class="form-label">
                        <span>Full name</span>
                        <input type="text" placeholder="your name" class="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label class="form-label">
                        <span>Email address</span>
                        <input type="email" placeholder="your-mail@gmail.com" class="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label class="form-label">
                        <span>Message</span>
                        <textarea rows="3" placeholder='Write something...' class="form-textarea" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </label>
                    <button type="button" class="submit-button" onClick={donesubmit}>Submit</button>
                </form>
            </div>
        </section>
    );
}
