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
            const redirectUrl = sessionStorage.getItem('redirectUrl') || '../index.html';
            sessionStorage.removeItem('redirectUrl'); // Clean up after use
            window.location.href = redirectUrl;
        }
    });

    signinForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = signinForm.email.value;
        const password = signinForm.password.value;

        try {
            // The onAuthStateChanged listener will handle the redirect on success.
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Sign in error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    googleButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const provider = new GoogleAuthProvider();

        try {
            // The onAuthStateChanged listener will handle the redirect on success.
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Google sign in error:', error);
            alert(`Error: ${error.message}`);
        }
    });
});
