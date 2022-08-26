import React, { useContext, useEffect, useState } from 'react'
import './style.css';
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthProvider';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';


function Navbar() {
    const [isActive, setActive] = useState("false");
    const { currentUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const handleToggle = () => {
        setActive(!isActive);
    };
    useEffect(() => {

    }, [currentUser]);

    const clickLogin = () => {
        if (currentUser) {
            signOut(auth);
        } else {
            navigate("/login");
        }
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
                    <li onClick={clickLogin}><Link to="/Login">Sair</Link></li>
                </ul>
            </header>
        </div>
    )
}

export default Navbar