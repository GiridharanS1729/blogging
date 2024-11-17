import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import { pers } from '../../utils/pers';
import { FaSearch } from 'react-icons/fa';
import { prt } from '../../utils/prt';
const ProfilePic = '/images/users/aut.png';

const Header = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dmenuVisible, setMenuVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userImage, setUserImage] = useState(ProfilePic); // Default image path

    useEffect(() => {
        // Check admin status based on "aid" in localStorage
        const aid = localStorage.getItem('aid');
        setIsAdmin(aid === '1');

        const url = `${prt}/users`;
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

    const handleSearchIconClick = () => {
        onSearch(searchQuery);  // Perform the search when the FaSearch icon is clicked
    };
    const dtoggleMenu = () => {
        setMenuVisible(!dmenuVisible);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="logo"><a href="/">{pers.app}</a></div>
            <div className='h-right'>

                <ul className={`menu ${isMenuOpen ? "active" : ""}`}>
                    <li>
                        <a className="nav-lnk" href="/">Home</a>
                    </li>
                    <li>
                        <a className="nav-lnk" href="/createblog">Create Blog</a>
                    </li>
                    <li>
                        <a className="nav-lnk" href="/about">About</a>
                    </li>

                    <li>
                        <a className="nav-lnk" href={isAdmin ? "/allusers" : "/contact"}>
                            {isAdmin ? "All Users" : "Contact Us"}
                        </a>
                    </li>

                    <li>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <span className='srch-icon'>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search blogs..."
                                    className="search-input"
                                />
                                <span className='srch-ico' onClick={handleSearchIconClick}>
                                    <FaSearch />
                                </span>
                            </span>
                        </form>
                    </li>

                </ul>

                <div className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </div>
                <img src={userImage} className='nav-pic' alt='user profile' onClick={dtoggleMenu} />
            </div>

            {dmenuVisible && (
                <div id="dmenu" className="dmenu">
                    <a href="/" onClick={() => localStorage.clear()}>Logout</a><br />
                    <a href="/settings">Settings</a>
                </div>
            )}
        </nav>
    );
};

export default Header;
