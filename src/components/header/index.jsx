import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">CreativeBrand</div>
            <nav className="header-nav">
                <ul className="nav-list">
                    <li><a className="nav-lnk" href="/">Home</a></li>
                    <li><a className="nav-lnk" href="/createpost">Create Post</a></li>
                    <li><a className="nav-lnk" href="/about">About</a></li>
                    <li><a className="nav-lnk" href="/contact">Contact</a></li>
                    <li><a className="nav-lnk" href="/allusers">All Users</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;

