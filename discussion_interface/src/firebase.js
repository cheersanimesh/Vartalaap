import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcBJ1vu53N6eilBDHL6ls5z0gJhh5oF7k",
  authDomain: "testproject-f306f.firebaseapp.com",
  projectId: "testproject-f306f",
  storageBucket: "testproject-f306f.appspot.com",
  messagingSenderId: "77607288074",
  appId: "1:77607288074:web:799ab90b6a4c489cee4ef3",
  measurementId: "G-HNRV03S53J"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore()
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth, provider};
  export default db;  