// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "placeholder-api-key",
    authDomain: "placeholder-auth-domain",
    projectId: "placeholder-project-id",
    storageBucket: "placeholder-storage-bucket",
    messagingSenderId: "placeholder-messaging-sender-id",
    appId: "placeholder-app-id"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
