import firebase from "firebase/app"
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBy-7ktNqmZ6nmmp26F7OqdaeST4Ae4Kig",
    authDomain: "nwitter-cf806.firebaseapp.com",
    projectId: "nwitter-cf806",
    storageBucket: "nwitter-cf806.appspot.com",
    messagingSenderId: "347303792626",
    appId: "1:347303792626:web:a1bbff265cc902ee13a56b"
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();