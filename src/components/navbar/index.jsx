import React, { useState } from 'react';
import './Navbar.css';

const Header = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

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
                    <li><a className="nav-lnk" href="/createpost">Create Post</a></li>
                    <li><a className="nav-lnk" href="/about">About</a></li>
                    <li><a className="nav-lnk" href="/allusers">All Users</a></li>
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
                        <img src='/images/aut.png' className='nav-pic' alt='user profile' onClick={toggleMenu} />
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
}

export default Header;
