// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: "AIzaSyBU9Wysvry148VFYadGPhbpaj5PADIX62U",
    authDomain: "quiz-dent.firebaseapp.com",
    projectId: "quiz-dent",
    storageBucket: "quiz-dent.firebasestorage.app",
    messagingSenderId: "897060250474",
    appId: "1:897060250474:web:b2d2dfef3de770fe303b13",
    measurementId: "G-YJ0GRTE9WX"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);