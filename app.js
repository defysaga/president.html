import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  set,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
 apiKey: "AIzaSyAwrMPaJG2rW1tXeSb5ONsx5WgVWD5vT-Q",
  authDomain: "lole-2763c.firebaseapp.com",
  databaseURL: "https://lole-2763c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lole-2763c",
  storageBucket: "lole-2763c.firebasestorage.app",
  messagingSenderId: "541336556170",
  appId: "1:541336556170:web:a340c3814c4d3000c01373",
  measurementId: "G-9FEYTWKB2C"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const counterRef = ref(db, "monsenCounter");

const counterDisplay = document.getElementById("counter");
const statusDisplay = document.getElementById("status");

function setStatus(message) {
  if (statusDisplay) {
    statusDisplay.innerText = message;
  }
}

onValue(
  counterRef,
  (snapshot) => {
    const data = snapshot.val();

    if (!data || typeof data.count !== "number") {
      counterDisplay.innerText = "0";
      setStatus("Live teller klar");
      return;
    }

    counterDisplay.innerText = data.count;
    setStatus("Live teller klar");
  },
  (error) => {
    console.error("Could not read counter:", error);
    setStatus("Kunne ikke lese fra Firebase");
  }
);

window.increment = function increment() {
  runTransaction(counterRef, (currentData) => {
    if (currentData === null) {
      return {
        count: 1,
        updatedAt: serverTimestamp()
      };
    }

    return {
      ...currentData,
      count: (currentData.count || 0) + 1,
      updatedAt: serverTimestamp()
    };
  }).catch((error) => {
    console.error("Could not increment counter:", error);
    alert("Kunne ikke oppdatere telleren.");
  });
};

window.resetCounter = function resetCounter() {
  if (!confirm("Er du sikker på at du vil nullstille Erik?")) {
    return;
  }

  set(counterRef, {
    count: 0,
    updatedAt: serverTimestamp()
  }).catch((error) => {
    console.error("Could not reset counter:", error);
    alert("Kunne ikke nullstille telleren.");
  });
};
