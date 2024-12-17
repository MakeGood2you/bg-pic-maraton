import firebase from 'firebase/app';
import  'firebase/database';
import  'firebase/storage';


firebase.initializeApp ({
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

});
require('dotenv').config();

export default  {
 firebase,
}