import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyD9BzIldgg4tFmID4FIqv1L6jfqiin4bNk",
    authDomain: "reactapp-aefab.firebaseapp.com",
    databaseURL: "https://reactapp-aefab.firebaseio.com",
    projectId: "reactapp-aefab",
    storageBucket: "",
    messagingSenderId: "783258894739"
  };
  firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();

export const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
