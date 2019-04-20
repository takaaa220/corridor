import * as firebase from "firebase/app";

const config = {
  apiKey: "AIzaSyDscaDR_hMSISXTl4R2XBXusON9E2ZMktc",
  authDomain: "createidea-d9635.firebaseapp.com",
  databaseURL: "https://createidea-d9635.firebaseio.com",
  projectId: "createidea-d9635",
  storageBucket: "createidea-d9635.appspot.com",
  messagingSenderId: "234152879427"
};
const firebaseApp = firebase.initializeApp(config);
export const firestore = firebaseApp.firestore();
