/* ==========================================
   PORTFOLIO INTERACTIONS — Kushagra Kumar
   Warm Aurora Theme
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // PARTICLE SYSTEM — Warm tones
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    // Warm color palette for particles
    const particleColors = [
        { r: 245, g: 166, b: 35 },   // amber
        { r: 255, g: 107, b: 107 },   // coral
        { r: 78, g: 205, b: 196 },    // teal
        { r: 167, g: 139, b: 250 },   // lavender
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.35 + 0.08;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 70);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    const alpha = 0.04 * (1 - distance / 110);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Connect to mouse if close
            const dxM = particles[i].x - mouseX;
            const dyM = particles[i].y - mouseY;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);
            if (distM < 160) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(245, 166, 35, ${0.08 * (1 - distM / 160)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // ==========================================
    // CURSOR GLOW
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    let glowX = 0, glowY = 0, currentGlowX = 0, currentGlowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glowX = e.clientX;
        glowY = e.clientY;
    });

    function updateGlow() {
        currentGlowX += (glowX - currentGlowX) * 0.08;
        currentGlowY += (glowY - currentGlowY) * 0.08;
        cursorGlow.style.left = currentGlowX + 'px';
        cursorGlow.style.top = currentGlowY + 'px';
        requestAnimationFrame(updateGlow);
    }
    updateGlow();

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'build full-stack web apps',
        'automate real-world problems',
        'love clean & scalable code',
        'turn ideas into products',
        'explore cloud & AI'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function typeEffect() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before next
        }

        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1200);

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const sections = document.querySelectorAll('.section, .hero');

    // Shrink on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    // Active section highlight
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ==========================================
    // THEME TOGGLE (Light/Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==========================================
    // SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // STATS COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    const duration = 1500;
                    const start = performance.now();

                    function animateCount(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        num.textContent = Math.round(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            num.textContent = target;
                        }
                    }

                    requestAnimationFrame(animateCount);
                });
            }
        });
    }, { threshold: 0.3 });

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) statsObserver.observe(aboutStats);

    // ==========================================
    // 3D TILT EFFECT ON PROJECT CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ==========================================
    // MAGNETIC BUTTON EFFECT
    // ==========================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s ease';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // SCROLL INDICATOR HIDE
    // ==========================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        if (scrollIndicator) {
            scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
        }
    });

    // ==========================================
    // CONTACT FORM — Sends via Web3Forms API
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
            `;
            submitBtn.disabled = true;

            const formData = {
                access_key: '54fe71c4-5d8c-44c2-bf89-7480ebf42b85',
                name: document.getElementById('formName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                message: document.getElementById('formMessage').value.trim(),
                subject: 'New Portfolio Message!'
            };

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();

                if (result.success) {
                    submitBtn.innerHTML = `
                        <span>Message Sent!</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    `;
                    submitBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #f5a623)';
                    contactForm.reset();
                } else {
                    submitBtn.innerHTML = `<span>Failed — Try Again</span>`;
                    submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                }
            } catch (error) {
                submitBtn.innerHTML = `<span>Error — Try Again</span>`;
                submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            }

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // ==========================================
    // SKILL TAG HOVER GLOW
    // ==========================================
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.boxShadow = '0 0 24px rgba(245, 166, 35, 0.12)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.boxShadow = '';
        });
    });

    // ==========================================
    // PROFILE PHOTO FALLBACK — Generate initials
    // ==========================================
    const profileImg = document.getElementById('profileImg');
    if (profileImg) {
        profileImg.addEventListener('error', function () {
            // Create a canvas-based placeholder with initials
            const placeholder = document.createElement('canvas');
            placeholder.width = 400;
            placeholder.height = 400;
            const pctx = placeholder.getContext('2d');

            // Gradient background
            const grad = pctx.createLinearGradient(0, 0, 400, 400);
            grad.addColorStop(0, '#1c1823');
            grad.addColorStop(0.5, '#2a2333');
            grad.addColorStop(1, '#1c1823');
            pctx.fillStyle = grad;
            pctx.fillRect(0, 0, 400, 400);

            // Add subtle pattern
            pctx.strokeStyle = 'rgba(245, 166, 35, 0.05)';
            pctx.lineWidth = 1;
            for (let i = 0; i < 400; i += 20) {
                pctx.beginPath();
                pctx.moveTo(i, 0);
                pctx.lineTo(i, 400);
                pctx.stroke();
                pctx.beginPath();
                pctx.moveTo(0, i);
                pctx.lineTo(400, i);
                pctx.stroke();
            }

            // Initials
            pctx.fillStyle = '#f5a623';
            pctx.font = 'bold 120px Inter, sans-serif';
            pctx.textAlign = 'center';
            pctx.textBaseline = 'middle';
            pctx.fillText('KK', 200, 185);

            // Subtitle
            pctx.fillStyle = 'rgba(240, 236, 228, 0.4)';
            pctx.font = '500 16px Inter, sans-serif';
            pctx.fillText('Software Developer', 200, 260);

            this.src = placeholder.toDataURL();
        });
    }

})();
