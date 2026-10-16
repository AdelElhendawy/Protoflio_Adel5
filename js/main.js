const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

function updateThemeIcon(theme) {
    if (!themeToggle || !themeIcon) return;

    const isDark = theme === 'dark';

    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
}

let savedTheme = 'light';

try {
    savedTheme = localStorage.getItem('theme') || 'light';
} catch (error) {
    savedTheme = 'light';
}

const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
html.setAttribute('data-theme', initialTheme);
updateThemeIcon(initialTheme);

themeToggle?.addEventListener('click', () => {
    const nextTheme =
        html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', nextTheme);
    updateThemeIcon(nextTheme);

    try {
        localStorage.setItem('theme', nextTheme);
    } catch (error) {
        // Theme switching still works if browser storage is unavailable.
    }
});

/* Mobile navigation */
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');

function closeMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
}

function toggleMenu() {
    if (!hamburger || !navMenu) return;

    const isOpen = !navMenu.classList.contains('active');

    hamburger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
    document.body.classList.toggle('menu-open', isOpen);
}

hamburger?.addEventListener('click', toggleMenu);

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

document.addEventListener('click', (event) => {
    if (
        navMenu?.classList.contains('active') &&
        !navMenu.contains(event.target) &&
        !hamburger?.contains(event.target)
    ) {
        closeMenu();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 968) closeMenu();
});

/* Navbar style, active link, and back-to-top button */
const sections = document.querySelectorAll('section[id]');
const scrollTopBtn = document.getElementById('scrollTop');

function updateOnScroll() {
    const scrollY = window.scrollY;

    navbar?.classList.toggle('scrolled', scrollY > 50);
    scrollTopBtn?.classList.toggle('show', scrollY > 400);

    let currentSection = '';

    sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 150) {
            currentSection = section.id;
        }
    });

    if (currentSection) {
        navLinks.forEach((link) => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${currentSection}`
            );
        });
    }
}

window.addEventListener('scroll', updateOnScroll, { passive: true });
updateOnScroll();

/* Typing animation */
const typedText = document.getElementById('typedText');
const titles = [
    'Front-End developer',
    'Back-End developer',
    'UI/UX designer',
    'freelancer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!typedText) return;

    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typedText.textContent = currentTitle.substring(0, charIndex);

    let speed = isDeleting ? 55 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        speed = 1800;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 400;
    }

    window.setTimeout(typeWriter, speed);
}

if (typedText) typeWriter();

/* Skill progress bars */
const progressBars = document.querySelectorAll('.progress');

if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.style.width = entry.target.dataset.width || '0%';
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.3 }
    );

    progressBars.forEach((bar) => progressObserver.observe(bar));
} else {
    progressBars.forEach((bar) => {
        bar.style.width = bar.dataset.width || '0%';
    });
}

/* Project filters */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((button) => {
    button.addEventListener('click', () => {
        filterBtns.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach((card) => {
            const matches =
                filter === 'all' || card.dataset.category === filter;

            card.classList.toggle('hidden', !matches);

            if (matches) {
                card.style.animation = 'none';
                requestAnimationFrame(() => {
                    card.style.animation = '';
                });
            }
        });
    });
});

/* Contact form demo message */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formMessage) {
        formMessage.textContent = 'Sending...';
        formMessage.style.color = 'var(--text-light)';
    }

    window.setTimeout(() => {
        if (formMessage) {
            formMessage.textContent =
                '✅ Your message has been sent successfully! I will reply to you soon.';
            formMessage.style.color = '#22c55e';
        }

        contactForm.reset();

        window.setTimeout(() => {
            if (formMessage) formMessage.textContent = '';
        }, 4000);
    }, 1200);
});

/* Back to top */
scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Reveal animations */
const revealElements = document.querySelectorAll(
    '.section, .skill-card, .stat, .contact-item'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.1 }
    );

    revealElements.forEach((element) => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add('revealed');
    });
}

/* Smooth in-page navigation */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            (navbar?.offsetHeight || 70);

        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    });
});