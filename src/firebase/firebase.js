// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoWoNM1d2UZ9P8PWtEDZyLywmijVd4bQI",
  authDomain: "exam-9b2ea.firebaseapp.com",
  databaseURL: "https://exam-9b2ea-default-rtdb.firebaseio.com",
  projectId: "exam-9b2ea",
  storageBucket: "exam-9b2ea.firebasestorage.app",
  messagingSenderId: "921468555063",
  appId: "1:921468555063:web:6b7ce1d76c830ae75694b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig