import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';

const Header = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userImage, setUserImage] = useState('/images/aut.png'); // Default image path

    useEffect(() => {
        // Check admin status based on "aid" in localStorage
        const aid = localStorage.getItem('aid');
        setIsAdmin(aid === '1');

        const url = "http://localhost:1729/users";
        axios.get(`${url}/${aid}`)
            .then(response => {
                setUserImage(response.data.aimage);
            })
            .catch(error => console.error('Error fetching user:', error));

    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchQuery);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className="header">
            <div className="header-logo">GMS Blogs</div>
            <nav className="header-nav">
                <ul className="nav-list">
                    <li><a className="nav-lnk" href="/">Home</a></li>
                    <li><a className="nav-lnk" href="/createblog">Create Blog</a></li>
                    <li><a className="nav-lnk" href="/about">About</a></li>

                    {/* Conditional rendering for admin link */}
                    <li>
                        <a className="nav-lnk" href={isAdmin ? "/allusers" : "/contact"}>
                            {isAdmin ? "All Users" : "Contact Us"}
                        </a>
                    </li>

                    <li>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search blogs..."
                                className="search-input"
                            />
                            <button type="submit" className="search-button">Search</button>
                        </form>
                    </li>
                    <li>
                        <img src={userImage} className='nav-pic' alt='user profile' onClick={toggleMenu} />
                    </li>
                </ul>
            </nav>

            {menuVisible && (
                <div id="menu" className="menu">
                    <a href="/" onClick={() => localStorage.clear()}>Logout</a><br />
                    <a href="/settings">Settings</a>
                </div>
            )}
        </header>
    );
};

export default Header;
