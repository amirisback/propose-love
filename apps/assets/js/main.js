document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data
        const response = await fetch('apps/data/content.json');
        if (!response.ok) throw new Error('Failed to load content');
        const data = await response.json();
        
        // Populate Hero
        document.getElementById('hero-subtitle').textContent = data.hero.subtitle;
        document.getElementById('hero-title').textContent = data.hero.title;
        document.getElementById('hero-description').textContent = data.hero.description;
        document.getElementById('hero-scroll-text').textContent = data.hero.scrollText;
        
        // Populate Timeline
        document.getElementById('timeline-title').textContent = data.timeline.title;
        document.getElementById('timeline-subtitle').textContent = data.timeline.subtitle;
        
        const timelineContainer = document.getElementById('timeline-container');
        let timelineHtml = '';
        data.timeline.events.forEach((event, index) => {
            const isLeft = index % 2 === 0;
            if (isLeft) {
                timelineHtml += `
                <div class="mb-12 flex flex-col md:flex-row justify-between items-center w-full fade-in-section">
                    <div class="order-1 md:w-5/12 hidden md:block"></div>
                    <div class="z-20 flex items-center order-1 shadow-xl w-8 h-8 rounded-full bg-rose-500 border-4 border-white mb-4 md:mb-0"></div>
                    <div class="order-1 bg-rose-50 rounded-2xl shadow-sm p-6 md:w-5/12 w-full border border-rose-100 hover:shadow-md transition-shadow">
                        <h3 class="font-bold text-gray-800 text-xl mb-1">${event.title}</h3>
                        <p class="text-sm text-rose-500 font-semibold mb-3">${event.date}</p>
                        <p class="text-gray-600 leading-relaxed text-sm">${event.description}</p>
                    </div>
                </div>`;
            } else {
                timelineHtml += `
                <div class="mb-12 flex flex-col md:flex-row justify-between items-center w-full fade-in-section">
                    <div class="order-1 bg-white rounded-2xl shadow-sm p-6 md:w-5/12 w-full border border-gray-100 hover:shadow-md transition-shadow mb-4 md:mb-0 text-left md:text-right">
                        <h3 class="font-bold text-gray-800 text-xl mb-1">${event.title}</h3>
                        <p class="text-sm text-rose-500 font-semibold mb-3">${event.date}</p>
                        <p class="text-gray-600 leading-relaxed text-sm">${event.description}</p>
                    </div>
                    <div class="z-20 flex items-center order-1 shadow-xl w-8 h-8 rounded-full bg-rose-500 border-4 border-white mb-4 md:mb-0"></div>
                    <div class="order-1 md:w-5/12 hidden md:block"></div>
                </div>`;
            }
        });
        timelineContainer.innerHTML = timelineHtml;
        
        // Populate Gallery
        document.getElementById('gallery-title').textContent = data.gallery.title;
        document.getElementById('gallery-subtitle').textContent = data.gallery.subtitle;
        
        const galleryContainer = document.getElementById('gallery-container');
        let galleryHtml = '';
        data.gallery.images.forEach(img => {
            const colSpan = img.wide ? 'md:col-span-2' : '';
            const textSize = img.wide ? 'text-xl' : 'text-lg';
            galleryHtml += `
            <div class="group relative rounded-2xl overflow-hidden shadow-lg aspect-square ${colSpan} fade-in-section">
                <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p class="text-white font-serif italic ${textSize} px-4 text-center">${img.caption}</p>
                </div>
            </div>`;
        });
        galleryContainer.innerHTML = galleryHtml;

        // Populate Reasons
        document.getElementById('reasons-title').textContent = data.reasons.title;
        
        const reasonsContainer = document.getElementById('reasons-container');
        let reasonsHtml = '';
        data.reasons.items.forEach((item, index) => {
            const delay = index * 100;
            reasonsHtml += `
            <div class="bg-rose-50 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-rose-100 text-center fade-in-section group" style="transition-delay: ${delay}ms;">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <span class="text-2xl">${item.icon}</span>
                </div>
                <h3 class="font-serif font-bold text-xl text-gray-800 mb-3">${item.title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">${item.description}</p>
            </div>`;
        });
        reasonsContainer.innerHTML = reasonsHtml;

        // Populate Proposal
        document.getElementById('proposal-target').textContent = data.proposal.targetName;
        document.getElementById('proposal-message').textContent = data.proposal.message;
        document.getElementById('proposal-question').textContent = data.proposal.question;
        document.getElementById('yes-btn').innerHTML = data.proposal.yesText;
        document.getElementById('no-btn').textContent = data.proposal.noText;
        document.getElementById('success-title').textContent = data.proposal.successTitle;
        document.getElementById('success-message-text').textContent = data.proposal.successMessage;

        // Setup animations and interactions after content is loaded
        setupInteractions();

    } catch (error) {
        console.error("Error loading content:", error);
    }
});

function setupInteractions() {
    // 1. Scroll animations (Fade in elements when visible)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // 2. Navbar glass effect on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
            navbar.classList.replace('glass', 'bg-white/95');
            navbar.classList.add('backdrop-blur-md');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.replace('bg-white/95', 'glass');
        }
    });

    // 3. Interactive 'No' Button Logic
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const proposalCard = document.getElementById('proposal-card');
    const successMessage = document.getElementById('success-message');
    
    const moveNoButton = () => {
        if (noBtn.style.position !== 'absolute') {
            noBtn.style.position = 'absolute';
        }

        const containerRect = proposalCard.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        const padding = 20;
        const maxX = containerRect.width - btnRect.width - padding * 2;
        const maxY = containerRect.height - btnRect.height - padding * 2;
        
        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
        
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.right = 'auto';
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // 4. "Yes" Button Action
    yesBtn.addEventListener('click', () => {
        noBtn.style.display = 'none';
        yesBtn.classList.remove('transform', 'hover:scale-110');
        yesBtn.classList.add('scale-110', 'cursor-default');
        yesBtn.innerHTML = '💍 💖 💍';
        
        successMessage.classList.remove('hidden');
        successMessage.classList.add('animate-pulse-slow');

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffffff']
            }));
        }, 250);
    });
}
