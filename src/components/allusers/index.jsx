import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './user.css';
import { Link } from 'react-router-dom';
import { prt } from '../../utils/prt';

const AllUser = () => {
    const [users, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${prt}/users`)
            .then(response => {
                setAllUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
            )

    }, []);

    if (loading) {
        return (
            Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className='profile-skeleton'>
                    <div className='profile-left'>
                        <div className='skeleton-img'></div>
                        <div className='skeleton-category'></div>
                    </div>
                    <div className='profile-right'>
                        <div className='skeleton-bio'></div>
                        <div className='skeleton-quote'></div>
                        <div className='skeleton-posts'></div>
                    </div>
                </div>
            )));
    }
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