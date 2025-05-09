import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTNtxRsJDR65_UyHtS179aAc19pLHkq3U",
  authDomain: "bookadvisor-40fcb.firebaseapp.com",
  databaseURL: "https://bookadvisor-40fcb-default-rtdb.firebaseio.com",
  projectId: "bookadvisor-40fcb",
  storageBucket: "bookadvisor-40fcb.firebasestorage.app",
  messagingSenderId: "1083805095090",
  appId: "1:1083805095090:web:670079364e18ef026f65ab",
  measurementId: "G-BX2X410VQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 