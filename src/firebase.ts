// firebase.js
import 'firebase/auth';
import 'firebase/firestore';
import firebase from "firebase/compat";

const firebaseConfig = {
    apiKey: "AIzaSyBTs7bqsHHRsPNDCe8gLZD5c_siU2sLG7k",
    authDomain: "org.reactjs.native.example.FemilioEvidence",
    projectId: "femilioevidence",
    storageBucket: "femilioevidence.appspot.com",
    messagingSenderId: "486148091338",
    appId: "1:486148091338:ios:5966bb06e29a583113f333"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export {auth, firestore};
