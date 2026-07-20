document.addEventListener('DOMContentLoaded', () => {

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
