/**
 * DRAKE - ONEPAGE PORTFOLIO (EARTH LINES SPHERE DEMO)
 * Main Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Page Loader
    const pageLoader = document.querySelector('.page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (pageLoader) pageLoader.classList.add('fade-out');
        }, 350);
    });
    // Fallback if load event already fired
    setTimeout(() => {
        if (pageLoader) pageLoader.classList.add('fade-out');
    }, 1200);

    // 2. Interactive 3D Earth Lines Sphere Canvas Effect
    try {
        const canvas = document.getElementById('sphereCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let width, height;
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;
            let rotationX = 0, rotationY = 0;

            // Generate Sphere Grid Points (Latitude & Longitude Lines) - ENLARGED 3D WORLD
            let points = [];
            const rings = 18;
            const segments = 36;

            function initSpherePoints() {
                points = [];
                const radiusMultiplier = window.innerWidth <= 991 ? 0.58 : 0.52;
                const radius = Math.min(width, height) * radiusMultiplier;

                for (let i = 0; i <= rings; i++) {
                    const theta = (i * Math.PI) / rings;
                    const sinTheta = Math.sin(theta);
                    const cosTheta = Math.cos(theta);

                    for (let j = 0; j <= segments; j++) {
                        const phi = (j * 2 * Math.PI) / segments;
                        const x = radius * sinTheta * Math.cos(phi);
                        const y = radius * cosTheta;
                        const z = radius * sinTheta * Math.sin(phi);
                        points.push({ x, y, z, ring: i, seg: j });
                    }
                }
            }

            function resizeCanvas() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                initSpherePoints();
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - width / 2) * 0.0005;
                mouseY = (e.clientY - height / 2) * 0.0005;
            });

        function project(p, rx, ry) {
            // Rotate around Y axis
            let cosY = Math.cos(ry);
            let sinY = Math.sin(ry);
            let x1 = p.x * cosY + p.z * sinY;
            let z1 = -p.x * sinY + p.z * cosY;

            // Rotate around X axis
            let cosX = Math.cos(rx);
            let sinX = Math.sin(rx);
            let y2 = p.y * cosX - z1 * sinX;
            let z2 = p.y * sinX + z1 * cosX;

            // Perspective projection
            const fov = 850;
            const distance = fov / (fov + z2 + 300);

            // Center on right half for desktop, centered viewport for mobile
            const centerOffsetX = window.innerWidth > 991 ? width * 0.62 : width * 0.5;
            const centerOffsetY = window.innerWidth > 991 ? height * 0.5 : height * 0.42;

            return {
                x: x1 * distance + centerOffsetX,
                y: y2 * distance + centerOffsetY,
                z: z2,
                scale: distance
            };
        }

        function getPrimaryColor(alpha = 0.25) {
            const hex = getComputedStyle(document.documentElement).getPropertyValue('--primary_color').trim() || '#28e98c';
            // Parse hex to rgb
            let c = hex.replace('#', '');
            if (c.length === 3) c = c.split('').map(x => x + x).join('');
            const num = parseInt(c, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function renderSphere() {
            ctx.clearRect(0, 0, width, height);

            targetX += (mouseY - targetX) * 0.05;
            targetY += (mouseX - targetY) * 0.05;
            rotationX += 0.0018 + targetX * 0.1;
            rotationY += 0.0035 + targetY * 0.1;

            const projected = points.map(p => project(p, rotationX, rotationY));

            // Draw Longitude & Latitude Lines
            ctx.lineWidth = 0.85;

            for (let i = 0; i <= rings; i++) {
                ctx.beginPath();
                for (let j = 0; j <= segments; j++) {
                    const idx = i * (segments + 1) + j;
                    const p = projected[idx];
                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                const depth = (i / rings);
                ctx.strokeStyle = getPrimaryColor(0.06 + depth * 0.12);
                ctx.stroke();
            }

            for (let j = 0; j <= segments; j += 2) {
                ctx.beginPath();
                for (let i = 0; i <= rings; i++) {
                    const idx = i * (segments + 1) + j;
                    const p = projected[idx];
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = getPrimaryColor(0.08);
                ctx.stroke();
            }

            // Draw glowing node particles
            for (let k = 0; k < projected.length; k += 4) {
                const pt = projected[k];
                if (pt.z > -100) {
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, Math.max(0.6, pt.scale * 1.8), 0, Math.PI * 2);
                    ctx.fillStyle = getPrimaryColor(Math.min(0.8, pt.scale * 0.9));
                    ctx.fill();
                }
            }

            requestAnimationFrame(renderSphere);
        }

        renderSphere();
        }
    } catch (sphereErr) {
        console.warn('Canvas initialization notice:', sphereErr);
    }

    // 3. Color Customizer Switcher
    const colorSwatches = [
        { color: '#28e98c', rgb: '40, 233, 140' }, // Green
        { color: '#00d2d3', rgb: '0, 210, 211' },  // Cyan
        { color: '#9b51e0', rgb: '155, 81, 224' }, // Purple
        { color: '#fe6f1d', rgb: '254, 111, 29' }, // Orange
        { color: '#e4af12', rgb: '228, 175, 18' }, // Amber
        { color: '#14c5fd', rgb: '20, 197, 253' }, // Sky Blue
        { color: '#ff6b81', rgb: '255, 107, 129' },// Pink
        { color: '#cceb00', rgb: '204, 235, 0' }   // Lime
    ];

    function applyThemeColor(index) {
        const item = colorSwatches[index] || colorSwatches[0];
        document.documentElement.style.setProperty('--primary_color', item.color);
        document.documentElement.style.setProperty('--primary_rgb', item.rgb);
        document.documentElement.style.setProperty('--primary_glow', `rgba(${item.rgb}, 0.28)`);
        localStorage.setItem('drake_theme_color', index);

        // Update active class on boxed swatches
        document.querySelectorAll('.color-boxed a').forEach((el, idx) => {
            el.classList.toggle('clr-active', idx === index);
        });
    }

    // Restore saved color preference
    const savedColor = localStorage.getItem('drake_theme_color');
    if (savedColor !== null) {
        applyThemeColor(parseInt(savedColor, 10));
    }

    // Attach listeners to color switcher elements
    document.querySelectorAll('.color-boxed a').forEach((el, idx) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            applyThemeColor(idx);
        });
    });

    // Toggle Global Color Drawer
    const globalColorWrap = document.querySelector('.global-color');
    const colorSettingToggle = document.querySelector('.global-color .setting-toggle');
    const closeColorSettings = document.querySelectorAll('.global-color .close-settings, .global-color .overlay');

    if (colorSettingToggle && globalColorWrap) {
        colorSettingToggle.addEventListener('click', () => {
            globalColorWrap.classList.add('active');
        });
    }

    closeColorSettings.forEach(btn => {
        btn.addEventListener('click', () => {
            if (globalColorWrap) globalColorWrap.classList.remove('active');
        });
    });

    // 4. Responsive Mobile Sidebar Menu
    const responsiveMenu = document.getElementById('responsiveSidebarMenu') || document.querySelector('.responsive-sidebar-menu');
    const menuButtons = document.querySelectorAll('.icon-menu, #mobileMenuToggle, #desktopMenuToggle');
    const closeTriggers = document.querySelectorAll('.responsive-sidebar-menu .close-settings, .responsive-sidebar-menu .overlay, .responsive-sidebar-menu .scroll-to, #closeMenuBtn');
    let lastMenuActionTime = 0;

    function openNavMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        lastMenuActionTime = Date.now();
        if (responsiveMenu) {
            responsiveMenu.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    function closeNavMenu(e) {
        // Prevent accidental closing from ghost click immediately after touch open
        if (Date.now() - lastMenuActionTime < 350) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return;
        }
        if (responsiveMenu) {
            responsiveMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    function toggleNavMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (responsiveMenu && responsiveMenu.classList.contains('active')) {
            closeNavMenu(e);
        } else {
            openNavMenu(e);
        }
    }

    // Expose globally for inline fallback
    window.toggleNavDrawer = toggleNavMenu;
    window.openNavDrawer = openNavMenu;
    window.closeNavDrawer = closeNavMenu;

    menuButtons.forEach(btn => {
        btn.addEventListener('click', toggleNavMenu);
    });

    closeTriggers.forEach(btn => {
        btn.addEventListener('click', closeNavMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && responsiveMenu && responsiveMenu.classList.contains('active')) {
            closeNavMenu(e);
        }
    });

    // 5. ScrollSpy Navigation Highlighting & Dynamic Active Page Indicator
    const navLinks = document.querySelectorAll('.dmenu .scroll-to');
    const sections = document.querySelectorAll('.scroll-to-page');
    const activePageIndicator = document.getElementById('activePageName');

    const sectionTitleMap = {
        'home': 'Home',
        'about': 'About',
        'resume': 'Resume',
        'services': 'Services',
        'skills': 'Skills',
        'portfolio': 'Portfolio',
        'testimonial': 'Testimonials',
        'pricing': 'Pricing',
        'contact': 'Contact'
    };

    function updateScrollSpy() {
        const scrollY = window.pageYOffset + 200;
        let activeId = 'home';

        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 60) {
            activeId = 'contact';
        } else if (window.pageYOffset < 150) {
            activeId = 'home';
        } else {
            sections.forEach(sec => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                const id = sec.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    activeId = id;
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });

        if (activePageIndicator && sectionTitleMap[activeId]) {
            if (activePageIndicator.textContent !== sectionTitleMap[activeId]) {
                activePageIndicator.textContent = sectionTitleMap[activeId];
            }
        }

        // Back to top button visibility
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.pageYOffset > 450) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }

    window.addEventListener('scroll', updateScrollSpy);
    updateScrollSpy();

    // Back to top trigger
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Dynamic Typing Header Effect
    const typingElement = document.querySelector('.typing-role');
    if (typingElement) {
        const roles = [
            'AI-Powered Web Developer',
            'CSE Student @ Green University',
            'Master Prompt Engineer',
            'Google Antigravity & Claude AI',
            'OpenAI Codex & Automations',
            'Figma UI/UX & WordPress Creator'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2200; // Pause on complete text
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        setTimeout(typeLoop, 800);
    }

    // 7. Facts Animated Numbers Counter
    let factsAnimated = false;
    const factsSection = document.querySelector('.facts');

    function animateCounters() {
        if (!factsSection || factsAnimated) return;

        const rect = factsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
            factsAnimated = true;

            document.querySelectorAll('.counter-num').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 1600;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out expo
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = Math.floor(ease * target);
                    counter.textContent = currentVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target + suffix;
                    }
                }

                requestAnimationFrame(updateCount);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // 8. Portfolio Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 9. Portfolio Lightbox Modal
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.querySelector('.lightbox-close');

    const projectData = {
        'bureau': {
            title: 'Bureau - Architecture & Design Studio',
            category: 'Figma Design & WordPress',
            img: 'assets/images/portfolio1.jpg',
            desc: 'A minimalist digital portfolio designed in Figma and developed into a responsive WordPress website. Features custom post types, dynamic client galleries, and lightning-fast loading speeds.'
        },
        'moonex': {
            title: 'Moonex - Next-Gen Crypto & AI Analytics',
            category: 'Claude AI & Figma UI/UX',
            img: 'assets/images/portfolio2.jpg',
            desc: 'A futuristic analytics platform developed with Claude AI code intelligence and designed in Figma. Includes dark mode aesthetics, interactive real-time data views, and seamless responsiveness.'
        },
        'taskly': {
            title: 'Taskly - AI Workflow & Productivity SaaS',
            category: 'Google Antigravity & Codex',
            img: 'assets/images/portfolio3.jpg',
            desc: 'An AI-powered productivity web application built using Google Antigravity and OpenAI Codex. Structured with modular code, automated AI tasks, and a sleek user interface.'
        },
        'humaan': {
            title: 'PromptStudio - Prompt Engineering Studio',
            category: 'Prompt Engineering & AI Web',
            img: 'assets/images/portfolio4.jpg',
            desc: 'A specialized showcase and library for complex generative AI prompts. Developed to automate code generation, structure LLM workflows, and produce immediate web components.'
        },
        'lewis': {
            title: 'Lewis - Fashion E-Commerce Storefront',
            category: 'WordPress & Figma UI/UX',
            img: 'assets/images/portfolio5.jpg',
            desc: 'Modern e-commerce platform designed with Figma wireframes and powered by WordPress WooCommerce. Features tailored shopping flows, product carousels, and high conversion optimization.'
        }
    };

    document.querySelectorAll('.open-lightbox').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projKey = trigger.getAttribute('data-project');
            const data = projectData[projKey];

            if (data && lightboxModal) {
                if (lightboxImg) lightboxImg.src = data.img;
                if (lightboxTitle) lightboxTitle.textContent = data.title;
                if (lightboxCategory) lightboxCategory.textContent = data.category;
                if (lightboxDesc) lightboxDesc.textContent = data.desc;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            lightboxModal.classList.remove('active');
        }
    });

    // 10. Testimonial Carousel
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevTestimonialBtn = document.getElementById('prevTestimonial');
    const nextTestimonialBtn = document.getElementById('nextTestimonial');
    const currentSlideNum = document.getElementById('currentSlideNum');
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    function showSlide(index) {
        testimonialCards.forEach((card, idx) => {
            card.classList.toggle('active', idx === index);
        });
        if (currentSlideNum) {
            currentSlideNum.textContent = String(index + 1).padStart(2, '0');
        }
    }

    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        });
    }

    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        });
    }

    // Auto rotate testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 7000);

    // 11. File Upload Label Update
    const fileInput = document.getElementById('attachment');
    const filenameLabel = document.querySelector('.selected-filename');

    if (fileInput && filenameLabel) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                filenameLabel.textContent = fileInput.files[0].name;
                filenameLabel.style.display = 'inline-block';
            } else {
                filenameLabel.style.display = 'none';
            }
        });
    }

    // 12. Interactive Contact Form Handling & Toast Alert
    const contactForm = document.getElementById('contactForm');
    const toastAlert = document.getElementById('toastAlert');
    const toastMsg = document.getElementById('toastMsg');

    function showToast(message) {
        if (toastMsg) toastMsg.textContent = message;
        if (toastAlert) {
            toastAlert.classList.add('show');
            setTimeout(() => {
                toastAlert.classList.remove('show');
            }, 4500);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = document.getElementById('submitBtn');

            if (!fullName || !email || !message) {
                showToast('Please fill in all required fields (Name, Email, Message).');
                return;
            }

            // Animate submit button
            if (submitBtn) {
                const origHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="las la-spinner la-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="las la-check"></i> Message Sent!';
                    showToast(`Thank you, ${fullName}! Your message has been received. I'll get back to you shortly.`);
                    contactForm.reset();
                    if (filenameLabel) filenameLabel.style.display = 'none';

                    setTimeout(() => {
                        submitBtn.innerHTML = origHtml;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1200);
            }
        });
    }

});
