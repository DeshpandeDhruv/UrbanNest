// client/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';




const firebaseConfig = {
  apiKey: "AIzaSyC-E-qK1I5sVJq52JdYorxMlif8hPhJAL8",
  authDomain: "real-estate-4b02b.firebaseapp.com",
  projectId: "real-estate-4b02b",
  storageBucket: "real-estate-4b02b.firebasestorage.app",
  messagingSenderId: "46246375556",
  appId: "1:46246375556:web:5d06049b7e5e8ec4b112d1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
