// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaGDrORnsMqvow-2J7D4bb6A7qC1G9OKU",
    authDomain: "studio-4380482473-cb69e.firebaseapp.com",
    projectId: "studio-4380482473-cb69e",
    storageBucket: "studio-4380482473-cb69e.firebasestorage.app",
    messagingSenderId: "277103921466",
    appId: "1:277103921466:web:cababfb6125c4f6a21e803"};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
