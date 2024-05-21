import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDX-c0EEp8VhBYRK6XupIYqS7HdPDAgj3w",
  authDomain: "w3g-project-f86e4.firebaseapp.com",
  projectId: "w3g-project-f86e4",
  storageBucket: "w3g-project-f86e4.appspot.com",
  messagingSenderId: "105585748841",
  appId: "1:105585748841:web:8a1b4e27d6d5167704ebf8",
  measurementId: "G-J44EQJG4SH"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { firebaseApp, messaging };
