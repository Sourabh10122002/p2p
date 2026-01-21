import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYZybT8uMsJol36Ws2N5Rup7UAOcv2vhU",
    authDomain: "p2p4everyone.firebaseapp.com",
    projectId: "p2p4everyone",
    storageBucket: "p2p4everyone.firebasestorage.app",
    messagingSenderId: "834986476186",
    appId: "1:834986476186:web:1807da71b1ac40c4219523",
    measurementId: "G-Q1B6MZ3LSF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
