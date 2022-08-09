import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";
import './App.css';
import Navbar from './components/navbar';



function App() {
  const canvasRef = useRef()
  const videoRef = useRef()
  const getVideo = () => {
    navigator.mediaDevices
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
    const labels = ['Guilherme']
    return Promise.all(labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 3; i++) {
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
      document.body.append(canvas)
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
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        resizedDetections.forEach(detection => {
          const { age, gender, genderProbality } = detection
          new faceapi.draw.DrawTextField([
            `${parseInt(age, 10)} years`,
            `${gender} (${parseInt(genderProbality * 100, 10)})%`
          ], detection.detection.box.topRight).draw(canvas)
        })
        results.forEach((result, index) => {
          const box = resizedDetections[index].detection.box
          const { label, distance } = result
          new faceapi.draw.DrawTextField([
            `${label} (${distance})`
          ], box.bottomRight).draw(canvas)
        })
      }, 50)
    }, 3000);

  }



  useEffect(() => {
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
    <div className="App">
      <Navbar />
      <div className="container">
        <video
          id='video'
          width="940"
          height="650"
          autoPlay
          ref={videoRef}
          muted></video>
        <canvas
          width="940"
          height="650"
          ref={canvasRef}
        />
      </div>
    </div>

  );
}

export default App;
