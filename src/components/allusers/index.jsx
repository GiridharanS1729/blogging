import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './user.css';
import { Link } from 'react-router-dom';

const AllUser = () => {
    const [users, setAllUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:1729/users')
            .then(response => setAllUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className='user-page'>
            {users.map((user, index) => (
                <Link key={user._id} to={`/users/${user._id}`} className='link'>
                    <div className='profile' key={user.id}>
                        <div className='profile-left'>
                            <img src={user.aimage} alt={user.author} className='profile-img' />
                            <span className={`category ${user.category}`}>{user.author}</span>
                        </div>
                        <div className='profile-right'>
                            <p className='bio'>{user.bio}</p>
                            <p className='quote'>{user.quote}</p>
                            <p className='posts'>Total Posts: {user.totalposts}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default AllUser;
