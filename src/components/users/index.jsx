// src/components/User/User.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './user.css';

function User(props) {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:1729/users/${id}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [id]);
    return (
        <div>
            {user ? (
                <div className="profile-container" key={user._id}>
                    <div className="profile-header">
                        <img src={user.aimage} alt="User" className="profile-image" />
                        <h1>{user.author}</h1>
                        <p>{user.bio}</p>
                        <div className="profile-stats">
                            <span>Followers: {user.followers}</span>
                            &nbsp;
                            <span>Following: {user.following}</span>
                        </div>
                    </div>
                    <div className="profile-description">
                        <p>Publication: {user.publication}</p>
                        <p>Total Posts: {user.totalposts}</p>
                    </div>
                    <div className="profile-post">
                        <blockquote>{user.quote}</blockquote>
                        <p>Category: {user.category}</p>
                    </div>
                </div>
            ) : (
                <p>No user found with the given ID</p>
            )}

        </div>
    );
}

export default User;
