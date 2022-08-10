import React from 'react'
import './style.css';
import LogotipoRed from '../../assets/img/LogotipoRed.png'
function Navbar() {
    return (
        <div className='header'>
            <header>
                <a href='#'><img className='logo' src={LogotipoRed} ></img></a>
                <ul className='navigation'>
                    <li><a href='#'>Home</a></li>
                    <li><a href='#'>Test</a></li>
                    <li><a href='#'>Test</a></li>
                    <li><a href='#'>Test</a></li>
                </ul>
            </header>
        </div>
    )
}

export default Navbar