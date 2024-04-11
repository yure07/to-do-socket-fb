import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWNwp1shR9F4Y0fSSEvj3EhLNYfFHkZps",
  authDomain: "to-do-socket.firebaseapp.com",
  projectId: "to-do-socket",
  storageBucket: "to-do-socket.appspot.com",
  messagingSenderId: "414136715921",
  appId: "1:414136715921:web:4b9c8b810e64dcdba14d30",
  measurementId: "G-R26LZG5F89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth