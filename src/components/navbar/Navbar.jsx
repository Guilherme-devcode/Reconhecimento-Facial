import React, { useState } from 'react'
import './style.css';
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { BrowserRouter as Router, Link } from 'react-router-dom';



function Navbar() {
    const [isActive, setActive] = useState("false");

    const handleToggle = () => {
        setActive(!isActive);
    };

    return (
        <div className='header'>
            <header>
                    <a><img className='logo' src={LogotipoRed} ></img></a>
                    <div onClick={handleToggle} className={isActive ? "toggle" : "toggle active"}></div>
                    <ul className={isActive ? "navigation" : "navigation active"}>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/check-in">Check-in</Link></li>
                        <li><Link to="/check-out">Check-out</Link></li>
                        <li><a>Sair</a></li>
                    </ul>
            </header>
        </div>
    )
}

export default Navbar