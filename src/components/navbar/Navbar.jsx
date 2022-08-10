import React, { useState } from 'react'
import './style.css';
import LogotipoRed from '../../assets/img/LogotipoRed.png'




function Navbar() {
    const [isActive, setActive] = useState("false");

    const handleToggle = () => {
        setActive(!isActive);
    };
    
    return (
        <div className='header'>
            <header>
                <a href='#'><img className='logo' src={LogotipoRed} ></img></a>
                <div onClick={handleToggle}  className={isActive ? "toggle" : "toggle active"}></div>
                <ul className={isActive ? "navigation" : "navigation active"}>
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