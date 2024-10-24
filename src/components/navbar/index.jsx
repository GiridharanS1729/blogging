import React, { useState } from 'react';
import './Navbar.css';

const Header = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchQuery);
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
                </ul>
            </nav>
        </header>
    );
}

export default Header;
