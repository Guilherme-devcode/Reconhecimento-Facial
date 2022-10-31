import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react'
import { app, storage } from '../../firebase';
import './style.css';
import { Camera, FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function FaceRegistration() {
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [dataURI, setdataURI] = useState("");
    const db = getFirestore(app)
    const userCollectionRef = collection(db, 'people')
    const [showCamera, setShowCamera] = useState(false)
    const showCapture = () => setShowCamera(true)
    const hideCaputure = () => setShowCamera(false)
    const [listPhotos, setListPhotos] = useState([])


    async function createUser() {
        await addDoc(userCollectionRef, {
            name,
            cpf,
            email,
            area,
            "type": 1,
            "date": Date.now()
        })
    }

    async function handleUpload() {
        const files = listPhotos
        if (!files) return
        await files.map(async file => {
            for (let i = 1; i <= 3; i++) {
                fetch(file.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "File name", { type: "image/png" })
                        const storageRef = ref(storage, `${name}/${i}.png`)
                        const uploadTask = uploadBytesResumable(storageRef, file)
                        uploadTask.on(
                            "state_changed",
                            async snapshot => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                console.log(progress);
                                hideCaputure()
                                setListPhotos([])
                                setArea('')
                                setName('')
                                setEmail('')
                                setCpf('')
                            },
                            error => {
                                console.log(error);
                            },
                        )
                    })
            }
        })
        await createUser()
    }

    function ImgsList() {
        const test = [1, 2, 3, 4]
        const listItems = test.map((img) => {
            <li>{img}</li>
        })
        return (
            <ul>{listItems}</ul>
        );
    }



    return (
        <div className='face-registration'>
            <form className='form-registration'>
                <h3>Cadastro Facial</h3>
                <label className='label-registration' htmlFor='name'>Nome completo</label>
                <input className='input-registration' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" id="name"></input>
                <label className='label-registration' htmlFor="cpf">CPF</label>
                <input className='input-registration' type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" id="cpf"></input>
                <label className='label-registration' htmlFor="cpf">Email</label>
                <input className='input-registration' type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" id="cpf"></input>
                <label className='label-registration' htmlFor="cpf">Area</label>
                <input className='input-registration' type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area" id="cpf"></input>
                <div onClick={showCapture} className={name && cpf && email && area ? 'button' : 'button disabled'} role="button">Enviar Fotos</div>
                {showCamera ?
                    <div className="camera-container">
                        <div className="title-camera">
                            <h3>Envie 3 Fotos</h3>
                        </div>
                        <div onClick={hideCaputure} className="back-button">
                            <KeyboardBackspaceIcon style={{ fill: "white" }} />
                        </div>
                        <Camera
                            idealFacingMode={FACING_MODES.USER}
                            isImageMirror={false}
                            isFullScreen={true}
                            isMaxResolution={true}
                            idealResolution={{
                                width: 800,
                                height: 800
                            }}
                            
                            sizeFactor={0.3}
                            onTakePhoto={(dataURI) => {
                                setdataURI(dataURI);
                                listPhotos.push({ url: dataURI })
                                listPhotos.length > 3 ? listPhotos.splice(0, 1) : listPhotos.splice()
                                ImgsList();
                            }}
                        />
                        <div className="list-imgs">
                            {listPhotos && listPhotos.map(img => <a href={img.url} download> <img className='image-preview' src={img.url}></img> </a>)}
                        </div>
                        <div className="submit-img-container">
                            <div onClick={handleUpload} role="button" className={listPhotos.length === 3 ? 'button' : 'button disabled'}>Enviar</div>
                        </div>
                    </div>
                    : null}
            </form >
        </div >
    )
}

export default FaceRegistration
