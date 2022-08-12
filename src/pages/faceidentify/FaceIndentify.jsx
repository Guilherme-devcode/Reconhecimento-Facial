import React from 'react'
import { useEffect, useRef, useState } from 'react';
import * as faceapi from "face-api.js";
import './style.css';
import face from '../../assets/img/face.png'
import { PuffLoader } from 'react-spinners';

function FaceIndentify() {
  const videoRef = useRef()
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



  const loadLabels = () => {
    const labels = ['Guilherme', 'Michael', 'Thiago', 'Cata', 'Filipe', 'Arthur']
    return Promise.all(labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(`/labels/${label}/${i}.PNG`)
        const detections = await faceapi.detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
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
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.6)
        const results = resizedDetections.map(d =>
          faceMatcher.findBestMatch(d.descriptor)
        )
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        resizedDetections.forEach(detection => {
          const { age, gender, genderProbality } = detection
          // new faceapi.draw.DrawTextField([
          //   `${parseInt(age, 10)} years`,
          //   `${gender} (${parseInt(genderProbality * 100, 10)})%`
          // ], detection.detection.box.topRight).draw(canvas)
          // const name = `Você tem provavelmente ${parseInt(age, 10)} anos`
          // document.getElementById("idade").innerHTML = name;
        })
        results.forEach((result, index) => {
          // const box = resizedDetections[index].detection.box
          // const { label, distance } = result
          // new faceapi.draw.DrawTextField([
          //   `${label} (${distance})`
          // ], box.bottomRight).draw(canvas)
          if (result._label !== 'unknown') {
            const name = `Olá ${result._label}`
            document.getElementById("name").innerHTML = name;

          } else {
            const name = `Não detectado`
            document.getElementById("name").innerHTML = name;
          }
        })
      }, 300)
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
                className={isActive ? "outline-face-id" : "outline-face-id active"}
                src={face}>
              </img>
              <video
                id='video'
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