import firebase from 'firebase/app';
import firebaseMessaging from 'firebase/messaging'
import auth from 'firebase/auth';
import  'firebase/storage';


firebase.initializeApp ({
        apiKey: "AIzaSyC0KwyR8ujADw3j7MyoWNWsIaaP_NlnphY",
        authDomain: "osher-project.firebaseapp.com",
        databaseURL: "https://osher-project-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "osher-project",
        storageBucket: "osher-project.appspot.com",
        messagingSenderId: "1026088270281",
        appId: "1:1026088270281:web:676a5b06ed8da3c7be5018"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

});
require('dotenv').config();

// const messaging = firebase.messaging();

// let messaging = {}
// if (firebase.messaging.isSupported()) {
//     firebase.usePublicVapidKey(process.env.PUBLIC_VAPI_KEY)
// }
export default  {
 firebase,
 // messaging
}