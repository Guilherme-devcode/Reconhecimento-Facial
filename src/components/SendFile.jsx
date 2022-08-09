import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { storage } from '../firebase'

function SendFile() {
    const [imgURL, setImageURL] = useState("")
    const [progress, setProgress] = useState(0)

    const handleUpload = (event) => {
        event.preventDefault()

        const file = event.target[0]?.files[0]
        if (!file) return

        const storageRef = ref(storage, `images/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress)
            },
            error => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(url => {
                    setImageURL(url)
                })
            }
        )
    }

    return (
        <div>
            <form onSubmit={handleUpload}>
                <input type="file" />
                <button type='submit'>Enviar Foto</button>
            </form>
            <br />
            {!imgURL && <progress value={progress} max="100" />}
            {imgURL && <img src={imgURL} alt="Imagem" />}
        </div>
    )
}

export default SendFile