
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { collection, getDocs, getFirestore, updateDoc } from "firebase/firestore";

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
const db = getFirestore(app)

export const getDatabase = async (docRef) => {
    const collectionRef = collection(db, docRef)
    const data = await getDocs(collectionRef)
    const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return result
}
export const setDataBase = async (docRef) => {
    const collectionRef = collection(db, docRef)
    const data = await updateDoc(collectionRef,{
        name:'Thiago',
        type:1,
        date:1660848515,
    })
    console.log(data);
}



export const storage = getStorage(app)