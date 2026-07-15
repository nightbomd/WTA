import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAfE8p5uaFEUJiK00ek5-HsiLmCuuNK7M",
  authDomain: "fitness-app-95cc1.firebaseapp.com",
  projectId: "fitness-app-95cc1",
  storageBucket: "fitness-app-95cc1.firebasestorage.app",
  messagingSenderId: "782207220140",
  appId: "1:782207220140:web:643fa923a1906a1446e209",
  measurementId: "G-4M4NPKQ8C7"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };