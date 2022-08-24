import React, {  useEffect, useState } from 'react'
import { register } from '../../firebase';
import './style.css';

function FaceRegistration() {
    const [cpf, setCpf] = useState("");
    const [name, setName] = useState("");


    const sendData = async () => {
        await register(name, cpf)
    }

    return (
        <div>
            <form>
                <h3>Cadastro Facial</h3>
                <label for="name">Nome completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" id="name"></input>

                <label for="cpf">CPF</label>
                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" id="cpf"></input>

                <button onClick={sendData}>Enviar</button>
            </form >
        </div>
    )
}

export default FaceRegistration
