/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './style.css';
import faceId from '../../assets/img/faceId.png'
import LogotipoRed from '../../assets/img/LogotipoRed.png'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, getDatabase } from '../../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { PuffLoader } from 'react-spinners';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const loadLabels = async () => {
        setLoading(true)
        const result = await getDatabase("people")
        const storage = getStorage();
        const listPeople = []
        for (let i = 0; i < result.length; i++) {
            const numberOfImagesInStorage = [1, 2, 3]
            const urls = await Promise.all(numberOfImagesInStorage.map(item => getDownloadURL(ref(storage, `${result[i].name}/${item}.png`))))
            const people = {
                name: result[i].name,
                type: result[i].type,
                id: result[i].id,
                cpf: result[i].cpf,
                email: result[i].email,
                date: result[i].date,
                area: result[i].area,
                images: urls,
            }
            listPeople.push(people);
        }
        sessionStorage.setItem("people", JSON.stringify(listPeople))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };
    async function onLogin() {
        await signInWithEmailAndPassword(auth, email, password)
        await loadLabels();
        setLoading(false)
        navigate("/");
    }
    return (
        <div className='login'>
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
                    <button>Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login