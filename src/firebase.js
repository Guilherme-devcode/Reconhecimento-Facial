
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDiDz17XFvC199zB-QBkjf8rCFHUpmuMRo",
    authDomain: "facerecognition-ba4be.firebaseapp.com",
    projectId: "facerecognition-ba4be",
    storageBucket: "facerecognition-ba4be.appspot.com",
    messagingSenderId: "256757433002",
    appId: "1:256757433002:web:5b85876264e6cd31bb06d3",
    measurementId: "G-GKT7LLV9CQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)