import { auth } from '../firebase-init.js';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const emailSection = document.getElementById('email-signup-section');
    const phoneSection = document.getElementById('phone-signup-section');
    const showPhoneLink = document.getElementById('show-phone-signup');
    const showEmailLink = document.getElementById('show-email-signup');

    const signupContainer = document.querySelector('.signup-container');
    const mainTitle = signupContainer.querySelector('h1');
    const subtitle = signupContainer.querySelector('.subtitle');

    const phoneForm = document.getElementById('phone-form');
    const verifyForm = document.getElementById('verify-form');

    const handleSuccessfulSignup = (user) => {
        console.log('Sign up successful:', user);
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '../index.html';
        sessionStorage.removeItem('redirectUrl');
        alert('Sign up successful! Redirecting...');
        window.location.href = redirectUrl;
    };

    // --- Firebase Auth Setup ---
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
        }
    });

    showPhoneLink.addEventListener('click', (e) => {
        e.preventDefault();
        emailSection.style.display = 'none';
        phoneSection.style.display = 'block';
        mainTitle.textContent = 'Sign Up with Phone';
        subtitle.textContent = 'Enter your phone number to continue.';
        window.recaptchaVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
        });
    });

    showEmailLink.addEventListener('click', (e) => {
        e.preventDefault();
        phoneSection.style.display = 'none';
        emailSection.style.display = 'block';
        mainTitle.textContent = 'Create Your Account';
        subtitle.textContent = 'Join the OTR community to get started.';
    });

    // --- Email & Password Sign-up ---
    const emailForm = document.querySelector('.signup-form');
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = emailForm.fullname.value.trim();
        const email = emailForm.email.value;
        const password = emailForm.password.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (fullName) {
                await updateProfile(userCredential.user, { displayName: fullName });
            }

            handleSuccessfulSignup(userCredential.user);
        } catch (error) {
            console.error('Sign up error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // --- Google Sign-up ---
    const googleButton = document.querySelector('.google-signup-button');
    googleButton.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                handleSuccessfulSignup(result.user);
            }).catch((error) => {
                console.error('Google sign in error:', error);
                alert(`Error: ${error.message}`);
            });
    });

    // --- Phone Number Sign-up ---
    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneNumber = phoneForm.phone.value;
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log('SMS sent.');
                alert('Verification code sent to your phone!');

                phoneForm.style.display = 'none';
                verifyForm.style.display = 'block';
                subtitle.textContent = 'Enter the code we just sent you.';

            }).catch((error) => {
                console.error('SMS not sent error:', error);
                alert(`Error sending verification code: ${error.message}`);
                if (window.recaptchaWidgetId) {
                    grecaptcha.reset(window.recaptchaWidgetId);
                }
            });
    });

    verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = verifyForm['verification-code'].value;

        window.confirmationResult.confirm(code).then((result) => {
            handleSuccessfulSignup(result.user);
        }).catch((error) => {
            console.error('Verification error:', error);
            alert(`Error verifying code: ${error.message}`);
        });
    });
});