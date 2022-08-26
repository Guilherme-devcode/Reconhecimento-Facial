/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import './style.css';
import faceId from '../../assets/img/faceId.png'
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        function onRegister() {
            signInWithEmailAndPassword(auth, email, password).catch((error) =>
                navigate("/login")
            );
            navigate("/");
        }
        onRegister();
    };
    return (
        <div className='login'>
            <div className="image">
                <img className='logo' src={faceId} ></img>
            </div>
            <div className="sign-in">
                <div className='header-login'>
                    <img src={LogotipoRed}></img>
                    <h1>Entrar </h1>
                </div>
                <form className='form-login' onSubmit={handleSubmit}>
                    <input onChange={(e) => setEmail(e.target.value)} className='input-login' type="email" placeholder="E-mail"></input>
                    <input onChange={(e) => setPassword(e.target.value)} className='input-login' type="password" placeholder="Senha"></input>
                    <button>Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login