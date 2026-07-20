import { auth } from '../firebase-init.js';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.querySelector('.signin-form');
    const googleButton = document.querySelector('.google-signin-button');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = '../index.html';
        }
    });

    signinForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = signinForm.email.value;
        const password = signinForm.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Sign in error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    googleButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Google sign in error:', error);
            alert(`Error: ${error.message}`);
        }
    });
});
