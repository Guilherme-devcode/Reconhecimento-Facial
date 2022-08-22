import React from 'react'
import { useEffect, useRef, useState } from 'react';
import * as faceapi from "face-api.js";
import './style.css';
import face from '../../assets/img/face.png'
import { PuffLoader } from 'react-spinners';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, getDetectedFaces, setDataBase } from '../../firebase';

function FaceIndentify() {
  const videoRef = useRef()
  const canvas = require("canvas");
  const { Canvas, Image, ImageData } = canvas;
  const [loading, setLoading] = useState(true)
  let [isActive, setActive] = useState(true);
  const getVideo = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };



  const loadLabels = async () => {

    const result = await getDatabase("detectedPeople")
    const labels = result.map(m => m.name)
    return Promise.all(labels.map(async label => {
      const descriptions = []
      const img = await canvas.loadImage(`https://raw.githubusercontent.com/Guilherme-devcode/Reconhecimento-Facial/main/public/labels/${label}/1.png`);
      img.crossOrigin = "anonymous";
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor()
      descriptions.push(detections.descriptor)
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }))
  }


  const handleImage = async () => {
    await getVideo()
    setTimeout(async () => {
      const canvas = await faceapi.createCanvasFromMedia(videoRef.current)
      const labels = await loadLabels()
      // document.body.append(canvas)
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
      faceapi.matchDimensions(canvas, displaySize)
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi
          .TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors()
          .withAgeAndGender()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // ------ Aumenta a precisão da captura do rosto com a imagem da pessoa em 90%
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.9)
        const results = resizedDetections.map(d =>
          faceMatcher.findBestMatch(d.descriptor)
        )
        //-----Desenhar linhas para detecção--------
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        resizedDetections.forEach(detection => {
          const { age, gender, genderProbality } = detection
          //----------Detectar idade e genero da pessoa---------- 
          new faceapi.draw.DrawTextField([
            `${parseInt(age, 10)} years`,
            `${gender} (${parseInt(genderProbality * 100, 10)})%`
          ], detection.detection.box.topRight).draw(canvas)

        })
        results.forEach(async (result, index) => {
          // ------- Desenha um quadrado azul no rosto e as descrições da pessoa
          // const box = resizedDetections[index].detection.box
          // const { label, distance } = result
          // new faceapi.draw.DrawTextField([
          //   `${label} (${distance})`
          // ], box.bottomRight).draw(canvas)

          // ------- Get do firebase com nome, tipo e id da pessoa 
          const resultDb = await getDatabase("detectedPeople")
          const labels = resultDb.find(label => label.name === result._label);
          let dateLabel = labels.date
          const fireBaseTime = new Date(
            dateLabel.seconds * 1000 + dateLabel.nanoseconds / 1000000,
          );
          const date = fireBaseTime.toDateString();
          const atTime = fireBaseTime.toLocaleTimeString();
          var currentDate = new Date();
          console.log(currentDate);
          console.log(date, atTime);
          if (labels?.type === 1) {
            const name = `Seja bem vindo ${labels.name}`
            document.getElementById("name").innerHTML = name;
          } else if (labels?.type === 2) {
            const name = `Volte sempre ${labels.name}`
            document.getElementById("name").innerHTML = name;
          } else if (labels === undefined) {
            const name = `Não detectado`
            document.getElementById("name").innerHTML = name;
          }
        })
      }, 1000)
      setActive(isActive = false);
    }, 3000);
  }




  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ]).then(handleImage)
        .catch((e) => console.log(e))
    }
    videoRef.current && loadModels()
  })
  return (
    <div className="container">
      {
        loading ?
          <PuffLoader color={'#fff'} loading={loading} size={100} />
          :
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
              <h3 id="name" className="name"></h3>
              {/* <h2 id="idade"></h2> */}
            </div>
          </div>
      }
    </div >
  )
}

export default FaceIndentify