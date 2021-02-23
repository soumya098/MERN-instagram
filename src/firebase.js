import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBqXmZfwSc6ayb4KkDE_-yd7TlQHg_pRzA",
  authDomain: "instagram-clone-4d493.firebaseapp.com",
  projectId: "instagram-clone-4d493",
  storageBucket: "instagram-clone-4d493.appspot.com",
  messagingSenderId: "477911098601",
  appId: "1:477911098601:web:f5da01d0b098cd11ecbc78",
  measurementId: "G-DKL6NNXB0Q",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
