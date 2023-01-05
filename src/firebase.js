
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { collection, getDocs, getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-2vsb_OUabdOkKGytGe_IGU_ELDmwR6s",
  authDomain: "facerecognition-f48ac.firebaseapp.com",
  projectId: "facerecognition-f48ac",
  storageBucket: "facerecognition-f48ac.appspot.com",
  messagingSenderId: "299427278448",
  appId: "1:299427278448:web:ccc5c359a8182b4c9bceb5",
  measurementId: "G-JGBC8XYN4J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth();

export const getDatabase = async (docRef) => {
  const collectionRef = collection(db, docRef)
  const data = await getDocs(collectionRef)
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  return result
}



export const setDataBase = async (id, type) => {
  const userRef = doc(db, "people", id);
  await updateDoc(userRef, {
    "type": type,
  });
}

export const loadPeopleFireStore = async () => {
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


export const storage = getStorage(app)