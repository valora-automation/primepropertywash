// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Before/After Slider Functionality
class ComparisonSlider {
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector('.comparison-image-wrapper');
        this.handle = container.querySelector('.slider-handle');
        this.afterImage = container.querySelector('.after-image');
        this.isDragging = false;
        this.currentPercentage = 50;
        this.rect = null;
        this.animationFrame = null;

        this.init();
    }

    init() {
        // Mouse events
        this.wrapper.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Touch events
        this.wrapper.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());

        // Set initial position
        this.updateSlider(this.currentPercentage);
    }

    startDrag(e) {
        this.isDragging = true;
        this.wrapper.classList.add('dragging');
        this.wrapper.style.cursor = 'grabbing';
        // Cache the bounding rect to avoid repeated calls
        this.rect = this.wrapper.getBoundingClientRect();
        this.updatePosition(e);
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        // Use requestAnimationFrame for smooth updates
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationFrame = requestAnimationFrame(() => {
            this.updatePosition(e);
        });
    }

    stopDrag() {
        this.isDragging = false;
        this.wrapper.classList.remove('dragging');
        this.wrapper.style.cursor = 'grab';
        this.rect = null;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    updatePosition(e) {
        // Use cached rect if available, otherwise get fresh one
        if (!this.rect) {
            this.rect = this.wrapper.getBoundingClientRect();
        }
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - this.rect.left;
        const percentage = Math.max(0, Math.min(100, (x / this.rect.width) * 100));
        this.currentPercentage = percentage;
        this.updateSlider(percentage);
    }

    updateSlider(percentage) {
        // Optimize updates using will-change and direct style updates
        this.afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        this.handle.style.left = `${percentage}%`;
    }
}

// Initialize all comparison sliders
const comparisonSliders = document.querySelectorAll('.comparison-slider');
comparisonSliders.forEach(slider => {
    new ComparisonSlider(slider);
});

// Image Slider Navigation
let currentSlide = 0;
const sliderItems = document.querySelectorAll('.slider-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const sliderDots = document.querySelector('.slider-dots');

// Create dots
if (sliderDots && sliderItems.length > 0) {
    sliderItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
}

const dots = document.querySelectorAll('.slider-dot');

function showSlide(index) {
    sliderItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    // Query dots dynamically to ensure we have the latest list
    const currentDots = document.querySelectorAll('.slider-dot');
    currentDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

// Initialize first slide on page load
if (sliderItems.length > 0) {
    showSlide(0);
}

function goToSlide(index) {
    showSlide(index);
}

function nextSlide() {
    const next = (currentSlide + 1) % sliderItems.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
    showSlide(prev);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Auto-play slider (optional - can be disabled)
// let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover
// const sliderContainer = document.querySelector('.slider-container');
// if (sliderContainer) {
//     sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
//     sliderContainer.addEventListener('mouseleave', () => {
//         autoSlideInterval = setInterval(nextSlide, 5000);
//     });
// }

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe elements for scroll reveal
document.querySelectorAll('.service-card, .benefit-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Form Submission Handler
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', data);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: fadeInUp 0.5s ease;
        `;
        successMessage.textContent = 'Thank you! We\'ll contact you soon.';
        document.body.appendChild(successMessage);
        
        // Reset form
        quoteForm.reset();
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => successMessage.remove(), 500);
        }, 3000);
    });
}

// Lazy Loading Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add fade-out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Prevent form resubmission on page reload
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

