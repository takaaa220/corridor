import { initializeApp } from "firebase";

const config = {
  apiKey: "AIzaSyAPGIhR6WFcNppgjq9DB6HmqNj7PTd_aaU",
  authDomain: "numeron-55935.firebaseapp.com",
  databaseURL: "https://numeron-55935.firebaseio.com",
  projectId: "numeron-55935",
  storageBucket: "numeron-55935.appspot.com",
  messagingSenderId: "1047696793056"
};
const firebaseApp = initializeApp(config);
export const firestore = firebaseApp.firestore();
