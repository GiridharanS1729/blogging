import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './settings.css';

export default function Settings() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const url = "http://localhost:1729/users";
        axios.get(url)
            .then(response => {
                const data = response.data.find(user => user._id === 1); // Using user with id 1 directly
                setUser(data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="settings-profile-container">
            <div className="settings-profile-banner"></div>
            <div className="settings-profile-header">
                <img src={user.aimage} alt="User" className="settings-profile-image" />
                <h2>{user.author}</h2>
                <p>{user.bio}</p>
                <div className="settings-profile-info">
                    <span className="settings-profile-location">📍 {user.location}</span>
                    <span className="settings-profile-join">🎂 Joined on {user.joinedDate}</span>
                    <span className="settings-profile-website">🔗 <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a></span>
                </div>
            </div>
            <div className="settings-profile-details">
                <div className="settings-profile-detail-item">
                    <h4>Education</h4>
                    <p>{user.education}</p>
                </div>
                <div className="settings-profile-detail-item">
                    <h4>Pronouns</h4>
                    <p>{user.pronouns}</p>
                </div>
                <div className="settings-profile-detail-item">
                    <h4>Work</h4>
                    <p>{user.work}</p>
                </div>
            </div>
            <div className="settings-profile-extras">
                <div className="settings-profile-section">
                    <h4>Badges</h4>
                    <div className="settings-profile-badge">🏅 {user.badge}</div>
                </div>
                <div className="settings-profile-section">
                    <h4>Skills/Languages</h4>
                    <p>{user.skills}</p>
                </div>
            </div>
            <blogs id={user._id} />
        </div>
    );
}
