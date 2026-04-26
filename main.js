document.addEventListener('DOMContentLoaded', () => {
    // Liquid Blobs Movement Engine
    const isMobile = window.innerWidth < 768;
    const blobs = document.querySelectorAll('.liquid-blob');
    const blobData = [];
    let isModalOpen = false;
    let isPageHidden = document.hidden;

    document.addEventListener('visibilitychange', () => {
        isPageHidden = document.hidden;
    });    blobs.forEach((blob, index) => {
        // Optimized reduction on mobile: keep every 2nd blob (approx 10 blobs)
        if (isMobile && index % 2 !== 0) {
            blob.style.display = 'none';
            return;
        }

        blobData.push({
            el: blob,
            x: Math.random() * (window.innerWidth - 300),
            y: Math.random() * (window.innerHeight - 300),
            vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.8), // Even slower on mobile
            vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.8),
            rotation: Math.random() * 360,
            vr: (Math.random() - 0.5) * (isMobile ? 0.05 : 0.1)
        });
    });

    const updateBlobs = () => {
        if (isModalOpen || isPageHidden) {
            requestAnimationFrame(updateBlobs);
            return;
        }

        blobData.forEach((data) => {
            data.x += data.vx;
            data.y += data.vy;
            data.rotation += data.vr;

            if (data.x < -400) data.vx = Math.abs(data.vx);
            if (data.x > window.innerWidth) data.vx = -Math.abs(data.vx);
            if (data.y < -400) data.vy = Math.abs(data.vy);
            if (data.y > window.innerHeight) data.vy = -Math.abs(data.vy);

            data.el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0) rotate(${data.rotation}deg)`;
        });
        requestAnimationFrame(updateBlobs);
    };

    updateBlobs();


    // Project Data & Modal Engine
    const projectData = {
        aura: {
            title: "Aura Architects Portfolio",
            desc: "A premium architectural studio portfolio that crafts spaces transcending utility, blending structural integrity with artistic vision. Features high-end minimalist design and smooth transitions.",
            tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
            img: "assets/aura-architects.png",
            link: "https://iamsaif-cmd.github.io/My-Website-2/"
        },
        lumina: {
            title: "Lumina Capital Tracker",
            desc: "The next generation of asset management. Lumina provides a minimalist interface for tracking global investments, with high-fidelity glassmorphism panels and liquid background effects.",
            tech: ["Vanilla JS", "Three.js", "CSS Filters", "GSAP"],
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
        },
        product: {
            title: "Fluid Product Showcase",
            desc: "An immersive e-commerce experience designed for luxury brands. Features a liquid UI system where every interaction feels organic and responsive to the user's touch.",
            tech: ["WebRotate 360", "Canvas API", "Liquid UI", "SVG Filters"],
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200"
        }
    };

    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalLink = document.getElementById('modal-link');
    const closeBtn = document.querySelector('.close-modal');
    const mainContent = document.querySelector('main');
    const nav = document.querySelector('.glass-nav');

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const data = projectData[projectId];

            if (data) {
                modalImg.src = data.img;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;
                
                modalTech.innerHTML = '';
                data.tech.forEach(t => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = t;
                    modalTech.appendChild(tag);
                });

                if (data.link) {
                    modalLink.style.display = 'inline-flex';
                    modalLink.href = data.link;
                    modalLink.target = "_blank";
                    modalLink.rel = "noopener noreferrer";
                } else {
                    modalLink.style.display = 'none';
                }
                
                modal.classList.add('active');
                mainContent.classList.add('hide-content');
                nav.classList.add('hide-content');
                document.body.style.overflow = 'hidden';
                isModalOpen = true; // Pause background animations
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        mainContent.classList.remove('hide-content');
        nav.classList.remove('hide-content');
        document.body.style.overflow = 'auto';
        isModalOpen = false; // Resume animations
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Navigation Reflections logic
    const reflectionContainer = document.querySelector('.nav-reflection-container');
    const existingBlobs = document.querySelectorAll('.reflection-blob');
    const navBlobs = [];
    
    existingBlobs.forEach((el, i) => {
        navBlobs.push({
            el: el,
            x: Math.random() * 100,
            y: Math.random() * 100,
            targetX: 50,
            targetY: 50,
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!nav) return;
        const navRect = nav.getBoundingClientRect();
        if (e.clientY >= navRect.top && e.clientY <= navRect.bottom &&
            e.clientX >= navRect.left && e.clientX <= navRect.right) {
            
            const relX = ((e.clientX - navRect.left) / navRect.width) * 100;
            const relY = ((e.clientY - navRect.top) / navRect.height) * 100;
            
            navBlobs.forEach((blob, i) => {
                blob.targetX = relX + (i - 1) * 15;
                blob.targetY = relY;
            });
        }
    });

    const updateNavBlobs = () => {
        if (isModalOpen || isPageHidden) {
            requestAnimationFrame(updateNavBlobs);
            return;
        }
        navBlobs.forEach(blob => {
            blob.x += (blob.targetX - blob.x) * 0.12;
            blob.y += (blob.targetY - blob.y) * 0.12;
            blob.el.style.left = `${blob.x}%`;
            blob.el.style.top = `${blob.y}%`;
            blob.el.style.transform = `translate(-50%, -50%) scale(${1.2 + Math.sin(Date.now() * 0.003 + navBlobs.indexOf(blob)) * 0.3}) translateZ(0)`;
        });
        requestAnimationFrame(updateNavBlobs);
    };
    updateNavBlobs();

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.reveal, .glass-card, .section-title').forEach(el => observer.observe(el));

    // SMOOTH SCROLL ENGINE
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Robust Preloader Removal
    const removePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('loader-fade-out')) {
            setTimeout(() => {
                preloader.classList.add('loader-fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, 1000);
        }
    };

    // Safety Fail-safe: Hide loader after 5 seconds no matter what
    setTimeout(removePreloader, 5000);

    if (document.readyState === 'complete') {
        removePreloader();
    } else {
        window.addEventListener('load', removePreloader);
    }
});


