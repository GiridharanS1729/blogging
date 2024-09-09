import React from 'react'
import './ts.css';
export default function Header() {
    return (
        <div>
            <header className="App-header">
                <p className='logo'>Blogging</p>
                <div className='nav-itm'>
                    <a className='nav-lnk' href='/'>Home</a>
                    <a className='nav-lnk' href='/createpost'>CreatePost</a>
                    <a className='nav-lnk' href='/about'>About</a>
                    <a className='nav-lnk' href='/contact'>Contact</a>
                    <a className='nav-lnk' href='/allusers'>All Users</a>
                </div>
            </header>
        </div>
    )
}
