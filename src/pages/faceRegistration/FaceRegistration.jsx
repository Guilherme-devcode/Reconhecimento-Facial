import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react'
import { app } from '../../firebase';
import './style.css';

function FaceRegistration() {
    const [cpf, setCpf] = useState("");
    const [name, setName] = useState("");

    const db = getFirestore(app)
    const userCollectionRef = collection(db, 'people')

    async function createUser() {
        await addDoc(userCollectionRef, {
            name,
            cpf,
            "type": 1,
            "date": Date.now()
        })
    }

    return (
        <div className='face-registration'>
            <form className='form-registration'>
                <h3>Cadastro Facial</h3>
                <label className='label-registration' htmlFor='name'>Nome completo</label>
                <input className='input-registration' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" id="name"></input>

                <label className='label-registration' htmlFor="cpf">CPF</label>
                <input className='input-registration' type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" id="cpf"></input>

                <div onClick={createUser} className='button'>Enviar</div>
            </form >
        </div>
    )
}

export default FaceRegistration
