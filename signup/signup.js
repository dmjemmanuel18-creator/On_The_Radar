document.addEventListener('DOMContentLoaded', () => {
    const emailSection = document.getElementById('email-signup-section');
    const phoneSection = document.getElementById('phone-signup-section');
    const showPhoneLink = document.getElementById('show-phone-signup');
    const showEmailLink = document.getElementById('show-email-signup');

    const signupContainer = document.querySelector('.signup-container');
    const mainTitle = signupContainer.querySelector('h1');
    const subtitle = signupContainer.querySelector('.subtitle');

    showPhoneLink.addEventListener('click', (e) => {
        e.preventDefault();
        emailSection.style.display = 'none';
        phoneSection.style.display = 'block';
        mainTitle.textContent = 'Sign Up with Phone';
        subtitle.textContent = 'Enter your phone number to continue.';
    });

    showEmailLink.addEventListener('click', (e) => {
        e.preventDefault();
        phoneSection.style.display = 'none';
        emailSection.style.display = 'block';
        mainTitle.textContent = 'Create Your Account';
        subtitle.textContent = 'Join the OTR community to get started.';
    });
});