import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";
import './App.css';



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

  const handleImage = async () => {
    await getVideo()
    setTimeout(async () => {
      const canvas = await faceapi.createCanvasFromMedia(videoRef.current)
      document.body.append(canvas)
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
      faceapi.matchDimensions(canvas, displaySize)
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 100)
    }, 1000);
  }
  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(handleImage)
        .catch((e) => console.log(e))
    }
    videoRef.current && loadModels()
  })

  return (
    <div className="App">
      {/* <img
        crossOrigin='anonymous'
        ref={imgRef}
        src="data:image/jpeg;base64,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"
        alt=''
        width="940"
        height="650"
      /> */}
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

  );
}

export default App;
