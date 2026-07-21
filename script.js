import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';

const getDisplayName = (user) => {
    if (!user) return 'Account';

    const googleProfile = user.providerData?.find((profile) => profile.providerId === 'google.com');
    const fullName = user.displayName || googleProfile?.displayName || user.email?.split('@')[0] || 'Account';

    return fullName.trim();
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Auth State UI Management ---
    const loginLink = document.querySelector('.logged-in');
    const registerLink = document.querySelector('.signup-link');
    const floatingCartButton = document.querySelector('.floating-cart-button');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const displayName = getDisplayName(user);

            // This is the main page with both links
            if (loginLink && registerLink) {
                loginLink.textContent = displayName;
                loginLink.href = '#';
                loginLink.style.pointerEvents = 'none';

                registerLink.textContent = 'Logout';
                registerLink.href = '#';
            }
            // This is the signup page with only a login link
            else if (loginLink) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
            }

            if (floatingCartButton) {
                floatingCartButton.hidden = false;
            }
        } else {
            // User is signed out
            if (loginLink && registerLink) {
                loginLink.textContent = 'Login';
                loginLink.style.pointerEvents = 'auto';

                registerLink.textContent = 'Register';
            } else if (loginLink) {
                loginLink.textContent = 'Login';
            }

            if (floatingCartButton) {
                floatingCartButton.hidden = true;
            }
        }
    });

    // Centralized handler for auth links
    document.body.addEventListener('click', async (event) => {
        const link = event.target.closest('a');
        if (!link) return;

        // Handle logout
        if (link.textContent === 'Logout') {
            event.preventDefault();
            try {
                await signOut(auth);
                // If on an auth page, redirect to home after logout. Otherwise, just stay.
                if (window.location.pathname.includes('signup/') || window.location.pathname.includes('signin/')) {
                    window.location.href = '../index.html';
                }
            } catch (error) {
                console.error('Sign out failed:', error);
            }
            return;
        }

        // Handle storing redirect URL for signin/signup
        const isAuthLink = link.href.includes('signin/signin.html') || link.href.includes('signup/signup.html');
        if (isAuthLink && !window.location.pathname.match(/(\/signin\/|\/signup\/)/)) {
            sessionStorage.setItem('redirectUrl', window.location.pathname + window.location.search);
        }
    });

    // --- Liquid bubble effect for navigation ---
    const navbars = document.querySelectorAll('.nav');
    navbars.forEach(nav => {
        const links = nav.querySelectorAll('a');
        const bubble = nav.querySelector('.liquid-bubble');

        if (!bubble) return;

        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const linkRect = e.target.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();

                const leftPosition = linkRect.left - navRect.left;
                const linkWidth = linkRect.width;

                bubble.style.setProperty('--left', `${leftPosition}px`);
                bubble.style.setProperty('--width', `${linkWidth}px`);
                bubble.style.setProperty('--opacity', '1');
            });
            link.addEventListener('mouseleave', () => {
                bubble.style.setProperty('--opacity', '0');
            });
        });
    });

    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavPanel = document.querySelector('.mobile-nav-panel');

    if (menuToggle && mobileNavPanel) {
        menuToggle.addEventListener('click', () => {
            const isOpen = header.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        mobileNavPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 560) {
                header.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Header color change on scroll ---
    const heroSection = document.querySelector('.hero');

    if (!header || !heroSection) {
        return;
    }

    const scrollTriggerPosition = header.offsetTop + header.offsetHeight;

    const handleScroll = () => {

        if (heroSection.getBoundingClientRect().bottom <= scrollTriggerPosition) {
            header.classList.add('scrolled-past-hero');
        } else {
            header.classList.remove('scrolled-past-hero');
        }
    };

    window.addEventListener('scroll', handleScroll);

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const headerHeight = header.offsetHeight + parseInt(window.getComputedStyle(header).top);

    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0.5
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const href = `#${entry.target.id}`;
            const correspondingLink = document.querySelector(`.main-nav a[href="${href}"]`);

            if (entry.isIntersecting && correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                correspondingLink.classList.add('active-link');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});
