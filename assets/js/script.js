// Smooth scrolling for in-page navigation with sticky-header offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// Reveal-on-scroll for cards
const observeReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.service-category, .infra-card, .stat').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
};

// Highlight active nav link based on scroll position
const observeNav = () => {
    const links = document.querySelectorAll('.site-nav a[href^="#"]');
    if (!links.length) return;

    const sections = Array.from(links)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const updateActive = () => {
        let current = links[0];
        sections.forEach((section, i) => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = links[i];
            }
        });
        links.forEach(link => link.classList.remove('active'));
        current.classList.add('active');
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
};

// Simulate service status indicators and header status pill
const updateServiceStatus = () => {
    document.querySelectorAll('.service-item .status-dot').forEach(dot => {
        const online = Math.random() > 0.06;
        dot.classList.toggle('down', !online);
    });
};

const updateHeaderStatus = () => {
    const headerStatus = document.querySelector('.header-status');
    if (!headerStatus) return;
    const pill = headerStatus.querySelector('.status-dot');
    const label = headerStatus.querySelector('span:last-child');
    let degraded = false;

    document.querySelectorAll('.service-item .status-dot').forEach(dot => {
        if (dot.classList.contains('down')) degraded = true;
    });

    if (pill) pill.classList.toggle('down', degraded);
    if (label) label.textContent = degraded ? 'Degraded Service Detected' : 'All Systems Operational';
};

// Bind status sync so the header reflects service state
const syncStatus = () => {
    updateServiceStatus();
    updateHeaderStatus();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    observeReveal();
    observeNav();
    syncStatus();
    setInterval(syncStatus, 20000);
}