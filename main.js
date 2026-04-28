document.addEventListener('DOMContentLoaded', () => {
    // Liquid Blobs Canvas Engine (120fps Optimized)
    const canvas = document.getElementById('blob-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const isMobile = window.innerWidth < 768;
    const numBlobs = isMobile ? 8 : 20; // Drastic reduction for mobile cooling
    const colors = [
        '#a0feff', '#c0ffee', '#e0c0ff', '#ffeaa0', '#ffc0e0',
        '#c0e0ff', '#e0ffc0', '#ffd0c0', '#d0f0ff', '#fff0d0',
        '#f0d0ff', '#d0ffd0', '#ffd0f0', '#e0f0ff', '#f0ffe0'
    ];

    const blobData = [];
    let isModalOpen = false;
    let isPageHidden = document.hidden;
    let isCanvasVisible = true;

    document.addEventListener('visibilitychange', () => {
        isPageHidden = document.hidden;
    });

    // Initialize Blobs
    for (let i = 0; i < numBlobs; i++) {
        const radius = isMobile ? (200 + Math.random() * 150) : (350 + Math.random() * 250);
        blobData.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7),
            vy: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7),
            r: radius,
            color: colors[i % colors.length]
        });
    }

    // Pre-render a high-quality blob for performance
    const blobCanvas = document.createElement('canvas');
    const bCtx = blobCanvas.getContext('2d');
    const blobRes = 400; // Resolution of the pre-rendered blob
    blobCanvas.width = blobCanvas.height = blobRes;
    
    const createBlobPattern = (color) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = tempCanvas.height = blobRes;
        const tCtx = tempCanvas.getContext('2d');
        const grad = tCtx.createRadialGradient(blobRes/2, blobRes/2, 0, blobRes/2, blobRes/2, blobRes/2);
        
        let hex = color.replace('#', '');
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.55)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        tCtx.fillStyle = grad;
        tCtx.fillRect(0, 0, blobRes, blobRes);
        return tempCanvas;
    };

    const patterns = colors.map(c => createBlobPattern(c));

    let lastTime = performance.now();
    const updateBlobs = (currentTime) => {
        const deltaTime = (currentTime - lastTime) / 16.67;
        
        // Throttling for mobile: Skip frames if interval is too short to keep it cool
        if (isMobile && (currentTime - lastTime < 16)) { 
             requestAnimationFrame(updateBlobs);
             return;
        }
        
        lastTime = currentTime;

        if (isModalOpen || isPageHidden || !isCanvasVisible) {
            requestAnimationFrame(updateBlobs);
            return;
        }

        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        blobData.forEach((data, i) => {
            data.x += data.vx * deltaTime;
            data.y += data.vy * deltaTime;

            if (data.x < -data.r) data.vx = Math.abs(data.vx);
            if (data.x > width + data.r) data.vx = -Math.abs(data.vx);
            if (data.y < -data.r) data.vy = Math.abs(data.vy);
            if (data.y > height + data.r) data.vy = -Math.abs(data.vy);

            // Use pre-rendered pattern instead of generating radial gradient every frame
            const pattern = patterns[i % patterns.length];
            ctx.drawImage(pattern, data.x - data.r, data.y - data.r, data.r * 2, data.r * 2);
        });
        
        requestAnimationFrame(updateBlobs);
    };

    requestAnimationFrame(updateBlobs);

    // Pause canvas animation if scrolled out of view
    const canvasObserver = new IntersectionObserver((entries) => {
        isCanvasVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    canvasObserver.observe(canvas);


    // Project Data & Modal Engine
    const projectData = {
        aura: {
            title: "Aura Architects Portfolio",
            desc: "A premium architectural studio portfolio that crafts spaces transcending utility, blending structural integrity with artistic vision. Features high-end minimalist design and smooth transitions.",
            tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
            img: "assets/aura-architects.png",
            link: "https://iamsaif-cmd.github.io/My-Website-2/"
        },
        prismx: {
            title: "PRISM X Landing Page",
            desc: "A high-fidelity landing page for a next-gen device, featuring a fully responsive smartphone mockup, an interactive swipeable interface, and a highly optimized canvas particle system.",
            tech: ["HTML5", "CSS3", "Vanilla JS", "Canvas API"],
            img: "assets/prismx-demo.png",
            link: "https://iamsaif-cmd.github.io/My-Website-3/"
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

    // Cleanup: Remove any legacy inline styles from previous versions
    document.querySelectorAll('.project-card img').forEach(img => {
        img.style.cursor = '';
        img.style.pointerEvents = '';
    });


    // Image Viewer Lightbox Logic
    const imageViewer = document.getElementById('image-viewer');
    const viewerImg = document.getElementById('viewer-img');

    let lastModalOpenTime = 0;

    const openImageViewer = (src) => {
        // Prevent opening if modal isn't active or if it just opened (prevents double-click bugs)
        if (!modal.classList.contains('active')) return;
        if (Date.now() - lastModalOpenTime < 400) return;

        viewerImg.src = src;
        imageViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeImageViewer = (e) => {
        if (e) e.stopPropagation();
        imageViewer.classList.remove('active');
        if (!isModalOpen) {
            document.body.style.overflow = 'auto';
        }
    };

    if (imageViewer) {
        imageViewer.addEventListener('click', () => closeImageViewer());
    }

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
                lastModalOpenTime = Date.now();
                mainContent.classList.add('hide-content');
                nav.classList.add('hide-content');
                document.body.style.overflow = 'hidden';
                isModalOpen = true; // Pause background animations
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        imageViewer.classList.remove('active'); // Also close lightbox if open
        mainContent.classList.remove('hide-content');
        nav.classList.remove('hide-content');
        document.body.style.overflow = 'auto';
        isModalOpen = false; // Resume animations
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            // If clicking the modal image, open the viewer
            if (e.target === modalImg) {
                openImageViewer(modalImg.src);
            } 
            // If clicking the overlay (background), close the modal
            else if (e.target === modal) {
                closeModal();
            }
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


