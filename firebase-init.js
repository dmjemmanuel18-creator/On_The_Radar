// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCyUHXfATAhtnqi2Nj_daHgoupD7ieSqRI",
    authDomain: "on-the-radar-e67a8.firebaseapp.com",
    projectId: "on-the-radar-e67a8",
    storageBucket: "on-the-radar-e67a8.firebasestorage.app",
    messagingSenderId: "280900177398",
    appId: "1:280900177398:web:546df5877e6b4698f1cbd7",
    measurementId: "G-84CQWH2GS6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

// Note: It's a good practice to secure your API keys, for example by using environment variables in a production environment.
