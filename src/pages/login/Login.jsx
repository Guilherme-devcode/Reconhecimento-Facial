/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './style.css';
import faceId from '../../assets/img/faceId.png'
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, getDatabase, loadPeopleFireStore } from '../../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { PuffLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const loginError = () => toast("Erro ao Entrar");


    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };
    async function onLogin() {
        await signInWithEmailAndPassword(auth, email, password).then(async (e) => {
            setLoading(true)
            await loadPeopleFireStore();
            setLoading(false)
            navigate("/");
        })
            .catch((error) => {
                loginError()
            })

    }
    return (
        <div className='login'>
            <ToastContainer />
            <div className={loading ? "loading-background" : "loading-background display-none"}><PuffLoader className='loading' color={'#fff'} loading={loading} size={100} /></div>
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
                    <button className='button'>Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login