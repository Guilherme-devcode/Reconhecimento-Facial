/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useRef, useState } from 'react';
import * as faceapi from "face-api.js";
import './style.css';
import face from '../../assets/img/face.png'
import { PuffLoader } from 'react-spinners';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, getDetectedFaces, setDataBase } from '../../firebase';
import { fetchImage } from 'face-api.js';

function FaceIndentify() {
  const videoRef = useRef()
  const canvas = require("canvas");
  const { Canvas, Image, ImageData } = canvas;
  const [loading, setLoading] = useState(true)
  let [isActive, setActive] = useState(true);




  const getVideo = async (isRecognized) => {
    if (isRecognized === false) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300 } })
      let video = videoRef.current;
      video.srcObject = await stream;
      await video.play();
      await handleImage()
      await setLoading(false)
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300 } })
      let video = videoRef.current;
      video.srcObject = await stream;
      await video.play();
    }
  };


  const stopVideo = async () => {

    var videoEl = videoRef.current;
    // now get the steam 
    const stream = videoEl.srcObject;
    // now get all tracks
    const tracks = stream.getTracks();
    // now close each track by having forEach loop
    if (tracks) {
      tracks.forEach(function (track) {
        // stopping every track
        track.stop();
      });
      // assign null to srcObject of video
      videoEl.srcObject = null;
    }
  };



  const loadLabels = async () => {
    const result = await getDatabase("people")
    const storage = getStorage();
    const labels = result.map(m => m.name)
    return Promise.all(labels.map(async label => {
      for (let i = 1; i <= 3; i++) {
        const url = await getDownloadURL(ref(storage, `${label}/${i}.png`))
        const descriptions = []
        const img = await fetchImage(url);
        const detections = await faceapi.detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor()
        descriptions.push(detections.descriptor)
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      }
    }))

  }


  const handleImage = async () => {
    let screen = document.getElementById("recognized-screen");
    let name = document.getElementById("name");
    screen.classList.remove("active")
    name.classList.remove("active")
    const canvas = await faceapi.createCanvasFromMedia(videoRef.current)
    const labels = await loadLabels()
    // document.body.append(canvas)    
    const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi
      .TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // ------ Adicionando mais um paramentro com numero na função faceMatcher vai limitar a similaridade do rosto da webcam com a foto
    const faceMatcher = new faceapi.FaceMatcher(labels, 0.5)
    const results = resizedDetections.map(d =>
      faceMatcher.findBestMatch(d.descriptor)
    )
    await setTypes(results)
  }

  const setTypes = async (results) => {
    if (results.length === 0) {
      const name = `Nenhum Rosto encontrado`
      document.getElementById("unknown").innerHTML = name;
      setTimeout(() => {
        handleImage()
      }, 1000);
    }
    results.forEach(async (result) => {
      if (result._label === 'unknown') {
        const name = `Não detectado`
        document.getElementById("unknown").innerHTML = name;
        handleImage()
      }
      setTimeout(async () => {
        const resultDb = await getDatabase("people")
        const labels = resultDb.find(label => label.name === result?._label);
        let typeLabel = labels?.type;
        switch (typeLabel) {
          case 1:
            await stopVideo()
            const name = `Seja bem vindo ${result?._label}`
            document.getElementById("name").innerHTML = name;
            let element = document.getElementById("name");
            element.classList.add("active")
            let screen = document.getElementById("recognized-screen");
            screen.classList.add("active")
            await setDataBase(labels.id, 2)
            setTimeout(async () => {
              await getVideo(true)
            }, 3000);
            setTimeout(() => {
              handleImage()
            }, 10000);
            break
          case 2:
            await stopVideo()
            let element2 = document.getElementById("name");
            element2.classList.add("active")
            let screen2 = document.getElementById("recognized-screen");
            screen2.classList.add("active")
            const name2 = `Volte sempre ${result?._label}`
            document.getElementById("name").innerHTML = name2;
            await setDataBase(labels.id, 1)
            setTimeout(async () => {
              await getVideo(true)
            }, 5000);
            setTimeout(() => {
              handleImage()
            }, 10000);
            break
          default:
        }
      })
    }, 2000);
  }






  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      getVideo(false)
    ])
  }

  useEffect(() => {
    loadModels()
  })


  return (
    <div className="container">
      <PuffLoader className='loading' color={'#fff'} loading={loading} size={100} />
      <div className={loading ? "loading-background" : "loading-background display-none"}></div>
      <div className='content-face-id'>
        <div className='text-face-id'>
          <h2>Identificação facial</h2>
          <span>Posicione seu rosto na demarcação</span>
        </div>
        <div className='video-content-id'>
          <img
            crossOrigin='anonymous'
            className={isActive ? "outline-face-id" : "outline-face-id active"}
            src={face}>
          </img>
          <video
            id='video'
            crossOrigin='anonymous'
            className='video'
            width="640"
            height="350"
            autoPlay
            ref={videoRef}
            muted>
          </video>
          <h3 id="unknown" className="unknown"></h3>
          <div id='recognized-screen' className='recognized-screen'>
            <h3 id="name" className="name"></h3>
          </div>
        </div>
      </div>
    </div >
  )
}

export default FaceIndentify