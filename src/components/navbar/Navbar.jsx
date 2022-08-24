import React, { useState } from 'react'
import './style.css';
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { Link } from 'react-router-dom';



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
                    <li onClick={handleToggle}><Link to="/">Inicio</Link></li>
                    <li onClick={handleToggle}><Link to="/check-in">Reconhecimento</Link></li>
                    <li onClick={handleToggle}><Link to="/register">Cadastro</Link></li>
                    <li><a>Sair</a></li>
                </ul>
            </header>
        </div>
    )
}

export default Navbar