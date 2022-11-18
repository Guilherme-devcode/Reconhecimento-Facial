/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-unused-vars */

import { addDoc, collection, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { app, getDatabase, storage } from '../../firebase';
import './style.css';
import { Camera, FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { PuffLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

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
    const [loading, setLoading] = useState(false)
    const registerSuccess = () => toast("Cadastrado com Sucesso!");
    const registerError = () => toast("Erro ao Cadastrar");
    const [options, setOptions] = useState([])

    const styleSelect = {
        control: (base, state) => ({
            ...base,
            border: "0 !important",
            boxShadow: "0 !important",
            "&:hover": {
                border: "0 !important",
            }
        })
    };

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

    async function loadAreas() {
        setLoading(true)
        const result = await getDatabase("areas")
        const areas = result.map((x) => {
            const area = {
                label: x.name,
                value: x.id
            }
            return area
        })
        setOptions(areas)
        setLoading(false)
    }

    useEffect(() => {

        loadAreas()
    }, [])


    const loadLabels = async () => {
        const result = await getDatabase("people")
        const storage = getStorage();
        const listPeople = []
        for (let i = 0; i < result.length; i++) {
            const numberOfImagesInStorage = [1, 2, 3]
            const urls = await Promise.all(numberOfImagesInStorage.map(item => getDownloadURL(ref(storage, `${result[i].cpf}/${item}.png`))))
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


    async function handleUpload() {
        setLoading(true)
        const files = listPhotos
        if (!files) return
        await files.map(async file => {
            for (let i = 1; i <= 3; i++) {
                fetch(file.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "File name", { type: "image/png" })
                        const storageRef = ref(storage, `${cpf}/${i}.png`)
                        const uploadTask = uploadBytesResumable(storageRef, file)
                        uploadTask.on(
                            "state_changed",
                            async snapshot => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                if (progress === 100) {
                                    hideCaputure()
                                    setListPhotos([])
                                    setArea('')
                                    setName('')
                                    setEmail('')
                                    setCpf('')
                                }
                            },
                            error => {
                                registerError()
                                console.log(error);
                            },
                        )
                    })
            }
        })
        await createUser()
        await loadLabels();
        setLoading(false);
        registerSuccess();
    }

    function ImgsList() {
        const imgs = [1, 2, 3, 4]
        const listItems = imgs.map((img) => {
            <li>{img}</li>
        })
        return (
            <ul>{listItems}</ul>
        );
    }



    return (
        <div className='face-registration'>
            <ToastContainer />
            <div className={loading ? "loading-background" : "loading-background display-none"}><PuffLoader className='loading' color={'#fff'} loading={loading} size={100} /></div>
            <form className='form-registration'>
                <h3>Cadastro Facial</h3>
                <label className='label-registration' htmlFor='name'>Nome completo</label>
                <input className='input-registration' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" id="name"></input>
                <label className='label-registration' htmlFor="cpf">CPF</label>
                <input className='input-registration' type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" id="cpf"></input>
                <label className='label-registration' htmlFor="cpf">Email</label>
                <input className='input-registration' type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" id="cpf"></input>
                <Select
                    styles={styleSelect}
                    onChange={(chioce) => setArea(chioce)}
                    options={options}

                    placeholder={<div className='placeholder-select'>Selecione a Area</div>}
                    className="select-area"
                    classNamePrefix="react-select"
                />
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
                            isFullScreen={false}
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
