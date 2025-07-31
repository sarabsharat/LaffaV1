import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDKDRP4dkTsKs_Pz6K4wLBIfbYrcI2H8bQ",
  authDomain: "laffa-2025.firebaseapp.com",
  projectId: "laffa-2025",
  storageBucket: "laffa-2025.firebasestorage.app",
  messagingSenderId: "512132280660",
  appId: "1:512132280660:web:f98cd9d9b47f9d133f18c1",
  measurementId: "G-XWCKM5F53Z"
};

// avoid re-init on hot reload
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export default firebase;
