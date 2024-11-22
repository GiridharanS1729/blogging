// src/components/User/User.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './user.css';
import { prt } from '../../utils/prt';

function User(props) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const url = `${prt}/users`;
        axios.get(url)
            .then(response => {
                let data;
                data = response.data.find(user => user._id === parseInt(id));
                setUser(data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [id]);
    if (!user) {
        return <div>User not found</div>;
    }
    return (
        <div>
            {user ? (
                <div className="profile-container" key={user._id}>
                    <div className="profile-header">
                        <img src={user.aimage} alt="User" className="profile-image" />
                        <h2>{user.author}</h2>
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
