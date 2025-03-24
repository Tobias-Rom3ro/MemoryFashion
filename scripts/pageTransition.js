// Add transition styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #fce8e8, #ffffff);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s;
    }

    .transition-overlay.active {
        opacity: 1;
        pointer-events: all;
    }

    .glitter {
        position: absolute;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        animation: glitter 1.5s ease-in-out infinite;
    }

    @keyframes glitter {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Create transition overlay
const overlay = document.createElement('div');
overlay.className = 'transition-overlay';
document.body.insertBefore(overlay, document.body.firstChild);

function createGlitter() {
    const overlay = document.querySelector('.transition-overlay');
    const numGlitters = 20;

    // Clear existing glitters
    overlay.innerHTML = '';

    // Create new glitters
    for (let i = 0; i < numGlitters; i++) {
        const glitter = document.createElement('div');
        glitter.className = 'glitter';
        glitter.style.left = `${Math.random() * 100}%`;
        glitter.style.top = `${Math.random() * 100}%`;
        glitter.style.animationDelay = `${Math.random() * 1.5}s`;
        overlay.appendChild(glitter);
    }
}

function handlePageTransition() {
    const links = document.querySelectorAll('a[data-transition]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.href;
            const overlay = document.querySelector('.transition-overlay');
            
            // Start transition
            overlay.classList.add('active');
            createGlitter();

            // Navigate after transition
            setTimeout(() => {
                window.location.href = target;
            }, 1000);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createGlitter();
    handlePageTransition();
});
