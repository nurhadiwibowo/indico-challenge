// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL4Swo1Ki-7QgHDJok2EXkG1F8iqqfCrw",
  authDomain: "nabitu-challenge.firebaseapp.com",
  projectId: "nabitu-challenge",
  storageBucket: "nabitu-challenge.firebasestorage.app",
  messagingSenderId: "22530575150",
  appId: "1:22530575150:web:20aac54e56fecdcebd48bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;