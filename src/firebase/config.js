import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'


const firebaseConfig = {
  apiKey: "AIzaSyCD7NAbs5a5gbWTXKGUExymuHUbflNkg08",
  authDomain: "map-blog-3ce56.firebaseapp.com",
  projectId: "map-blog-3ce56",
  storageBucket: "map-blog-3ce56.appspot.com",
  messagingSenderId: "731965263330",
  appId: "1:731965263330:web:255e8e231b31722935bdbb"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectFirestore, projectAuth, timestamp }