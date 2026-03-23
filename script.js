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
    // 3D DEVELOPER MODEL — Freepik Reference Style
    // ==========================================
    function init3DScene() {
        const container = document.getElementById('hero3dContainer');
        const canvas3d = document.getElementById('hero3dCanvas');
        if (!container || !canvas3d || typeof THREE === 'undefined') return;

        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;

        // Scene setup
        const scene = new THREE.Scene();
        // Adjust camera for a wider view to fit the new props
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 2.5, 8.5);
        camera.lookAt(0, 1.0, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas3d,
            alpha: true,
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;

        // Colors - Adapting Freepik reference to portfolio palette where necessary
        const skinColor = 0xeab676;
        const shirtColor = 0x8b8db0; // Greyish-purple matching reference
        const pantsColor = 0x243e72; // Darker blue jeans
        const chairColor = 0xd92d47; // Bold red armchair
        const laptopColor = 0x222228;
        const woodColor = 0xe2ba8f; // Side table
        const screenGlow = 0x00f0ff; 

        // Materials - Soft, smooth 'clay' materials
        const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7, metalness: 0.1 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.9, metalness: 0.0 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.9, metalness: 0.0 });
        const chairMat = new THREE.MeshStandardMaterial({ color: chairColor, roughness: 0.8, metalness: 0.1 });
        const hardMat = new THREE.MeshStandardMaterial({ color: laptopColor, roughness: 0.6, metalness: 0.3 });
        const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.8, metalness: 0.0 });
        const screenMat = new THREE.MeshStandardMaterial({ color: screenGlow, emissive: screenGlow, emissiveIntensity: 0.8, roughness: 0.1 });
        
        // Helper function for rounded boxes (simulated with standard geometry for simplicity + beveling where possible)
        function createPillBox(w, h, d, color) {
            const geo = new THREE.BoxGeometry(w, h, d);
            const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
            return new THREE.Mesh(geo, mat);
        }

        // Main groups
        const worldGroup = new THREE.Group();
        const character = new THREE.Group();
        scene.add(worldGroup);
        worldGroup.add(character);

        // ---- RED ARMCHAIR ----
        const chairGroup = new THREE.Group();
        chairGroup.position.set(0, 0, 0);
        worldGroup.add(chairGroup);

        // Seat
        const seatGeo = new THREE.BoxGeometry(1.6, 0.4, 1.4);
        const seat = new THREE.Mesh(seatGeo, chairMat);
        seat.position.set(0, 0.6, 0);
        seat.castShadow = true;
        seat.receiveShadow = true;
        chairGroup.add(seat);

        // Backrest
        const backRestGeo = new THREE.BoxGeometry(1.6, 1.2, 0.4);
        const backRest = new THREE.Mesh(backRestGeo, chairMat);
        backRest.position.set(0, 1.4, -0.5);
        backRest.castShadow = true;
        chairGroup.add(backRest);

        // Left Armrest
        const armRestGeo = new THREE.BoxGeometry(0.4, 0.6, 1.5);
        const leftArmRest = new THREE.Mesh(armRestGeo, chairMat);
        leftArmRest.position.set(-0.7, 1.1, 0.05);
        leftArmRest.castShadow = true;
        chairGroup.add(leftArmRest);

        // Right Armrest
        const rightArmRest = new THREE.Mesh(armRestGeo, chairMat);
        rightArmRest.position.set(0.7, 1.1, 0.05);
        rightArmRest.castShadow = true;
        chairGroup.add(rightArmRest);

        // Chair Legs (4 small cylinders)
        const chairLegGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.4, 16);
        [[-0.6, 0.2, -0.5], [0.6, 0.2, -0.5], [-0.6, 0.2, 0.5], [0.6, 0.2, 0.5]].forEach(pos => {
            const leg = new THREE.Mesh(chairLegGeo, new THREE.MeshStandardMaterial({color: 0x111111}));
            leg.position.set(...pos);
            chairGroup.add(leg);
        });

        // ---- CHARACTER (Sitting in Chair) ----
        character.position.set(0, 0.8, 0.1);

        // Torso (Shirt)
        const torsoGeo = new THREE.BoxGeometry(0.8, 0.9, 0.5);
        const torso = new THREE.Mesh(torsoGeo, shirtMat);
        torso.position.set(0, 0.5, 0);
        torso.castShadow = true;
        character.add(torso);

        // Neck
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.2), skinMat);
        neck.position.set(0, 1.0, 0);
        character.add(neck);

        // Head
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 1.35, 0);
        character.add(headGroup);

        const headGeo = new THREE.BoxGeometry(0.65, 0.75, 0.65); // Slightly square head
        const head = new THREE.Mesh(headGeo, skinMat);
        head.castShadow = true;
        headGroup.add(head);

        // Hair (parted style like reference)
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        const hairGeo = new THREE.BoxGeometry(0.75, 0.2, 0.7);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 0.35, 0);
        headGroup.add(hair);
        // Sideburns
        const sideburnL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.3), hairMat);
        sideburnL.position.set(-0.35, 0.1, -0.1);
        headGroup.add(sideburnL);
        const sideburnR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.3), hairMat);
        sideburnR.position.set(0.35, 0.1, -0.1);
        headGroup.add(sideburnR);

        // Eyes (black dots)
        const eyeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.rotation.x = Math.PI / 2;
        leftEye.position.set(-0.15, 0, 0.32);
        headGroup.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.rotation.x = Math.PI / 2;
        rightEye.position.set(0.15, 0, 0.32);
        headGroup.add(rightEye);

        // Arms (Reaching to lap)
        const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 16);
        
        // Left Arm
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-0.5, 0.8, 0);
        character.add(leftArmGroup);
        const lArm = new THREE.Mesh(armGeo, shirtMat);
        lArm.position.set(0, -0.3, 0.2);
        lArm.rotation.x = -0.6;
        lArm.rotation.z = 0.2;
        lArm.castShadow = true;
        leftArmGroup.add(lArm);
        const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMat);
        lHand.position.set(0.08, -0.65, 0.45);
        leftArmGroup.add(lHand);

        // Right Arm
        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.5, 0.8, 0);
        character.add(rightArmGroup);
        const rArm = new THREE.Mesh(armGeo, shirtMat);
        rArm.position.set(0, -0.3, 0.2);
        rArm.rotation.x = -0.6;
        rArm.rotation.z = -0.2;
        rArm.castShadow = true;
        rightArmGroup.add(rArm);
        const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMat);
        rHand.position.set(-0.08, -0.65, 0.45);
        rightArmGroup.add(rHand);

        // Legs (Blue jeans, stretched out to floor)
        const legGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.9, 16);
        
        // Left Leg (Upper thigh is flat on chair, lower leg hangs down)
        const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.8), pantsMat);
        leftThigh.position.set(-0.25, 0, 0.3);
        character.add(leftThigh);
        
        const leftCalf = new THREE.Mesh(legGeo, pantsMat);
        leftCalf.position.set(-0.25, -0.5, 0.55);
        leftCalf.rotation.x = 0;
        character.add(leftCalf);

        // Right Leg
        const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.8), pantsMat);
        rightThigh.position.set(0.25, 0, 0.3);
        character.add(rightThigh);

        const rightCalf = new THREE.Mesh(legGeo, pantsMat);
        rightCalf.position.set(0.25, -0.5, 0.55);
        rightCalf.rotation.x = 0;
        character.add(rightCalf);

        // Sneakers (Black and white)
        const shoeGeo = new THREE.BoxGeometry(0.2, 0.15, 0.4);
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        const createShoe = (x, y, z) => {
            const group = new THREE.Group();
            group.position.set(x, y, z);
            const body = new THREE.Mesh(shoeGeo, shoeMat);
            body.position.set(0, 0.05, 0.1);
            group.add(body);
            const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.42), soleMat);
            sole.position.set(0, -0.05, 0.1);
            group.add(sole);
            return group;
        };

        const leftShoe = createShoe(-0.25, -1.0, 0.55);
        character.add(leftShoe);
        const rightShoe = createShoe(0.25, -1.0, 0.55);
        character.add(rightShoe);


        // ---- LAPTOP (On Lap) ----
        const laptopGroup = new THREE.Group();
        laptopGroup.position.set(0, 0.22, 0.55);
        // Tilt laptop onto lap
        laptopGroup.rotation.x = 0.2;
        character.add(laptopGroup);

        // Base
        const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.6), hardMat);
        laptopBase.castShadow = true;
        laptopGroup.add(laptopBase);

        // Screen
        const screenAssembly = new THREE.Group();
        screenAssembly.position.set(0, 0.02, -0.3);
        screenAssembly.rotation.x = -0.4;
        laptopGroup.add(screenAssembly);

        const macScreen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.04), hardMat);
        macScreen.position.set(0, 0.3, 0);
        screenAssembly.add(macScreen);

        const display = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.55), screenMat);
        display.position.set(0, 0.3, 0.021);
        screenAssembly.add(display);

        // White glowing logo on back
        const appleGeo = new THREE.CircleGeometry(0.06, 32);
        const appleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });
        const logo = new THREE.Mesh(appleGeo, appleMat);
        logo.position.set(0, 0.3, -0.021);
        logo.rotation.y = Math.PI;
        screenAssembly.add(logo);


        // ---- SIDE TABLE & PLANT (Left Side) ----
        const tableGroup = new THREE.Group();
        tableGroup.position.set(-1.8, 0, 0.5);
        worldGroup.add(tableGroup);

        // Table Top
        const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), woodMat);
        tableTop.position.set(0, 0.8, 0);
        tableTop.receiveShadow = true;
        tableTop.castShadow = true;
        tableGroup.add(tableTop);

        // Table Legs
        const tLegGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.8, 8);
        const createTableLeg = (x, z) => {
            const leg = new THREE.Mesh(tLegGeo, woodMat);
            leg.position.set(x, 0.4, z);
            // Angle legs outward slightly
            leg.rotation.z = x > 0 ? -0.1 : 0.1;
            leg.rotation.x = z > 0 ? -0.1 : 0.1;
            return leg;
        };
        tableGroup.add(createTableLeg(-0.3, -0.2));
        tableGroup.add(createTableLeg(0.3, -0.2));
        tableGroup.add(createTableLeg(0, 0.3));

        // Potted Plant
        const potGroup = new THREE.Group();
        potGroup.position.set(0.1, 0.825, 0);
        tableGroup.add(potGroup);

        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.2, 16), new THREE.MeshStandardMaterial({color: 0xffffff}));
        pot.position.set(0, 0.1, 0);
        pot.castShadow = true;
        potGroup.add(pot);

        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
        const leaf1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 8), leavesMat);
        leaf1.position.set(0, 0.35, 0);
        potGroup.add(leaf1);
        const leaf2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), leavesMat);
        leaf2.position.set(-0.1, 0.25, -0.05);
        leaf2.rotation.z = 0.3;
        potGroup.add(leaf2);
        const leaf3 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), leavesMat);
        leaf3.position.set(0.1, 0.3, 0.05);
        leaf3.rotation.z = -0.2;
        leaf3.rotation.x = 0.2;
        potGroup.add(leaf3);


        // ---- FLOATING UI ELEMENTS (Behind & Around) ----
        const uiGroup = new THREE.Group();
        worldGroup.add(uiGroup);

        // Main Code Window
        const windowGroup = new THREE.Group();
        windowGroup.position.set(0, 2.5, -1.5);
        uiGroup.add(windowGroup);

        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.1), hardMat);
        windowGroup.add(winFrame);
        const winScreen = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.6, 0.11), new THREE.MeshStandardMaterial({color: 0x0f172a}));
        windowGroup.add(winScreen);
        
        // Code lines (colorful strips)
        const lineColors = [0x3b82f6, 0xef4444, 0xf59e0b, 0x10b981];
        for(let i=0; i<6; i++) {
            const w = 0.5 + Math.random() * 1.5;
            const line = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, 0.12), new THREE.MeshBasicMaterial({color: lineColors[i%4]}));
            line.position.set(-1.2 + w/2, 0.6 - i*0.2, 0);
            windowGroup.add(line);
        }

        // Floating Tags (Left side)
        const createTag = (text, color, x, y, z, rotY) => {
            const group = new THREE.Group();
            group.position.set(x, y, z);
            group.rotation.y = rotY;

            // Pill shape
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.1), new THREE.MeshStandardMaterial({color: color, roughness: 0.3}));
            box.castShadow = true;
            group.add(box);
            
            // Note: Since text geometry requires loading a font file which is asynchronous and complex without a bundler, 
            // we will simulate the text with little white blocks inside the pill for the aesthetic.
            const textSim = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.12), new THREE.MeshBasicMaterial({color: 0xffffff}));
            group.add(textSim);

            // Store original y for animation
            group.userData.baseY = y;
            group.userData.offset = Math.random() * Math.PI * 2;
            return group;
        };

        const tag1 = createTag('CSS', 0x3b82f6, -2.0, 2.6, -0.5, 0.3); // Blue
        uiGroup.add(tag1);
        const tag2 = createTag('PHP', 0xeab308, -2.2, 2.0, -0.2, 0.4); // Yellow
        uiGroup.add(tag2);
        const tag3 = createTag('C++', 0xef4444, -1.9, 1.4, 0.0, 0.2); // Red
        uiGroup.add(tag3);

        const floaters = [windowGroup, tag1, tag2, tag3];

        // Overall scene scale
        worldGroup.scale.set(0.9, 0.9, 0.9);
        worldGroup.position.set(0, -1.2, 0); // Ground level


        // ---- ADVANCED LIGHTING ----
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 0.8);
        scene.add(hemiLight);

        // Key light (soft studio lighting)
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 20;
        keyLight.shadow.camera.left = -5;
        keyLight.shadow.camera.right = 5;
        keyLight.shadow.camera.top = 5;
        keyLight.shadow.camera.bottom = -5;
        scene.add(keyLight);

        // Fill light to reduce harsh shadows
        const fillLight = new THREE.DirectionalLight(0xa78bfa, 0.5);
        fillLight.position.set(-5, 3, 5);
        scene.add(fillLight);

        // Screen glow (illuminating character's face)
        const screenLightParams = new THREE.PointLight(screenGlow, 1.0, 3);
        screenLightParams.position.set(0, 0.8, 0.8);
        character.add(screenLightParams);


        // ---- MOUSE TRACKING & INTERACTION ----
        let targetRotY = 0;
        let targetRotX = 0;
        let currentRotY = 0;
        let currentRotX = 0;

        document.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            targetRotY = ((e.clientX - cx) / window.innerWidth) * 0.8;
            targetRotX = ((e.clientY - cy) / window.innerHeight) * 0.4;
        });

        // ---- ANIMATION LOOP ----
        const clock = new THREE.Clock();

        function animate3D() {
            requestAnimationFrame(animate3D);
            const t = clock.getElapsedTime();

            currentRotY += (targetRotY - currentRotY) * 0.05;
            currentRotX += (targetRotX - currentRotX) * 0.05;

            // Head tracks mouse
            headGroup.rotation.y = currentRotY * 1.2;
            headGroup.rotation.x = currentRotX * 0.8;
            
            // Torso subtle shift
            character.rotation.y = currentRotY * 0.2;

            // Idle breathing
            const breath = Math.sin(t * 1.5) * 0.015;
            torso.position.y = 0.5 + breath;
            headGroup.position.y = 1.35 + breath * 1.5;

            // Floating UI elements
            floaters.forEach((f, index) => {
                if(f.userData.baseY) {
                    // It's a tag
                    f.position.y = f.userData.baseY + Math.sin(t * 1.5 + f.userData.offset) * 0.1;
                    f.rotation.z = Math.sin(t * 1.0 + f.userData.offset) * 0.05;
                } else {
                    // It's the main window
                    f.position.y = 2.5 + Math.sin(t * 1.2) * 0.1;
                    f.rotation.x = Math.sin(t * 0.8) * 0.02;
                }
            });

            // Very slow ambient rotation for the entire scene
            worldGroup.rotation.y = Math.sin(t * 0.2) * 0.1;

            renderer.render(scene, camera);
        }

        animate3D();

        // Responsive handling
        function onResize() {
            const w = container.clientWidth || 400;
            const h = container.clientHeight || 400;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', onResize);
    }

    // Initialize only when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init3DScene);
    } else {
        init3DScene();
    }

})();
