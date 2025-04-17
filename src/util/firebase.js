import firebase from "firebase/app"
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";


const firebase_config = {
    apiKey: "AIzaSyDPMxU4ncOx5FRC_s5MMvruRmIgUKeWjok",
    authDomain: "cme-facebook-2.firebaseapp.com",
    databaseURL: "https://cme-facebook-2.firebaseio.com",
    projectId: "cme-facebook-2",
    storageBucket: "cme-facebook-2.appspot.com",
    messagingSenderId: "793918324079",
    appId: "1:793918324079:web:9c76de80f0157033893c9a",
    measurementId: "G-9FGX4CS8XW"
};

const app = firebase.initializeApp(firebase_config);

// // Test database connection
// const dbRef = firebase.database().ref('.info/connected');
// dbRef.on('value', (snap) => {
//     if (snap.val() === true) {
//         console.log('Connected to Firebase Realtime Database');
//     } else {
//         console.log('Not connected to Firebase Realtime Database');
//     }
// });

firebase.analytics();

export default firebase;