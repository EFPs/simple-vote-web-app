import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDQxeM5OH_SiK2PQSqTMK3DEqAYf8VfWWY",
  authDomain: "simple-vote-f59f7.firebaseapp.com",
  databaseURL: "https://simple-vote-f59f7.firebaseio.com",
  projectId: "simple-vote-f59f7",
  storageBucket: "simple-vote-f59f7.appspot.com",
  messagingSenderId: "925079791861"
};

firebase.initializeApp(config);

export default firebase
export const db = firebase.database()
