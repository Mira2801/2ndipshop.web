// ============================================
// GLOBAL VARIABLES & CONFIGURATION
// ============================================

// Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-slide');
const dots = document.querySelectorAll('.nav-dot');
let autoSlideInterval;

// Recommended Slider
const recommendedContainer = document.getElementById('recommendedContainer');
const recommendedPrevBtn = document.getElementById('recommendedPrev');
const recommendedNextBtn = document.getElementById('recommendedNext');

// AI Chat Widget
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatSuggestions = document.getElementById('chatSuggestions');
const chatBadge = document.getElementById('chatBadge');

// Cart count element
const cartCountElement = document.getElementById('cartCount');

// ============================================
// CART FUNCTIONS
// ============================================

/**
 * Update cart count with animation
 */
function updateCartCount() {
    const savedCart = localStorage.getItem('iphoneCart');
    let totalItems = 0;
    
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        cart.forEach(item => {
            totalItems += item.quantity;
        });
    }
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        // Add animation to cart count when it changes
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }
}

/**
 * Add product to cart
 * @param {string} productId - ID of the product
 * @param {string} productName - Name of the product
 * @param {number} price - Price of the product
 */
function addToCart(productId, productName, price) {
    let cart = JSON.parse(localStorage.getItem('iphoneCart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('iphoneCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification(`${productName} added to cart!`);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 1000;
                animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
                transform: translateX(0);
                border-left: 4px solid #2ecc71;
            }
            
            .notification.error {
                border-left-color: #e74c3c;
            }
            
            .notification.info {
                border-left-color: #3498db;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #2c3e50;
                font-weight: 500;
            }
            
            .notification-content i {
                font-size: 18px;
                color: #2ecc71;
            }
            
            .notification.error .notification-content i {
                color: #e74c3c;
            }
            
            .notification.info .notification-content i {
                color: #3498db;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #95a5a6;
                cursor: pointer;
                font-size: 14px;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background-color: #f8f9fa;
                color: #e74c3c;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

/**
 * Highlight current page in navigation
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize smooth page transitions
 */
function initPageTransitions() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (!link.classList.contains('cart-icon')) {
            link.addEventListener('click', function(e) {
                if (this.href && !this.href.includes('#') && !this.href.includes('javascript:')) {
                    e.preventDefault();
                    const href = this.href;
                    
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        }
    });
    
    // Cart icon click transition
    const cartIconLink = document.querySelector('.cart-icon a');
    if (cartIconLink) {
        cartIconLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 300);
        });
    }
}

// ============================================
// BANNER SLIDER FUNCTIONS
// ============================================

/**
 * Change to specific slide
 * @param {number} slideIndex - Index of slide to show
 */
function changeSlide(slideIndex) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
    resetAutoSlide();
}

/**
 * Go to next slide
 */
function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    changeSlide(nextIndex);
}

/**
 * Go to previous slide
 */
function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1;
    changeSlide(prevIndex);
}

/**
 * Start auto slide interval
 */
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Slide every 4 seconds
}

/**
 * Reset auto slide timer
 */
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

/**
 * Initialize banner slider with events
 */
function initBannerSlider() {
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
    });
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    const slider = document.querySelector('.banner-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        }
        
        if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }
}

// ============================================
// RECOMMENDED SLIDER FUNCTIONS
// ============================================

/**
 * Scroll recommended slider
 * @param {string} direction - 'prev' or 'next'
 */
function scrollRecommended(direction) {
    const scrollAmount = 300;
    if (direction === 'next') {
        recommendedContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
        recommendedContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}

/**
 * Initialize recommended slider
 */
function initRecommendedSlider() {
    if (recommendedPrevBtn && recommendedNextBtn) {
        recommendedPrevBtn.addEventListener('click', () => scrollRecommended('prev'));
        recommendedNextBtn.addEventListener('click', () => scrollRecommended('next'));
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                scrollRecommended('prev');
            } else if (e.key === 'ArrowRight') {
                scrollRecommended('next');
            }
        });
    }
}

// ============================================
// AI CHAT FUNCTIONS
// ============================================

/**
 * AI Responses database
 */
const aiResponses = {
    "greeting": "Hello! I'm your iPhone shopping assistant. I can help you choose the perfect iPhone based on your needs. What are you looking for in a phone?",
    "photography": "For photography, I recommend the iPhone 17 Pro Max or iPhone 16 Pro. They have advanced camera systems with multiple lenses, Night mode, and ProRAW support. The iPhone 17 Pro Max features a 48MP main camera with sensor-shift stabilization.",
    "latest": "The latest iPhone models are the iPhone 17 series, including iPhone 17, iPhone 17 Pro, and iPhone 17 Pro Max. They feature the A18 chip, improved cameras, and new color options.",
    "battery": "For the best battery life, consider the iPhone 17 Pro Max or iPhone 16 Pro Max. They offer all-day battery life and support fast charging. The iPhone 17 Pro Max has up to 29 hours of video playback.",
    "gaming": "For gaming, I recommend iPhone 17 Pro or iPhone 16 Pro with their A18/A17 Pro chips and ProMotion displays with 120Hz refresh rates. They provide smooth gaming performance and excellent graphics.",
    "budget": "If you're on a budget, consider iPhone 13 or iPhone 14. They offer great value with excellent performance and cameras at lower price points. iPhone 13 is currently our most affordable option.",
    "default": "I can help you compare iPhone models, features, prices, and make recommendations. You can ask about specific models, camera quality, battery life, storage options, or anything else about iPhones!"
};

/**
 * Toggle chat widget visibility
 */
function toggleChat() {
    chatContainer.classList.toggle('active');
    if (chatContainer.classList.contains('active')) {
        chatInput.focus();
        // Hide badge when chat is opened
        chatBadge.style.display = 'none';
    }
}

/**
 * Add message to chat
 * @param {string} text - Message text
 * @param {string} sender - 'user' or 'bot'
 */
function addMessage(text, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Add user message
 * @param {string} text - Message text
 */
function addUserMessage(text) {
    addMessage(text, 'user');
}

/**
 * Add bot message
 * @param {string} text - Message text
 */
function addBotMessage(text) {
    addMessage(text, 'bot');
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Get current time in HH:MM format
 * @returns {string} Current time
 */
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Get AI response based on user question
 * @param {string} userQuestion - User's question
 * @returns {string} AI response
 */
function getAIResponse(userQuestion) {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('photo') || question.includes('camera')) {
        return aiResponses.photography;
    } else if (question.includes('latest') || question.includes('new')) {
        return aiResponses.latest;
    } else if (question.includes('battery') || question.includes('charge')) {
        return aiResponses.battery;
    } else if (question.includes('game') || question.includes('performance')) {
        return aiResponses.gaming;
    } else if (question.includes('budget') || question.includes('cheap') || question.includes('affordable')) {
        return aiResponses.budget;
    } else if (question.includes('hello') || question.includes('hi') || question.includes('hey')) {
        return aiResponses.greeting;
    } else {
        return aiResponses.default;
    }
}

/**
 * Handle chat input
 */
function handleChatInput() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    // Add user message
    addUserMessage(userMessage);
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI thinking time
    setTimeout(() => {
        hideTypingIndicator();
        const aiResponse = getAIResponse(userMessage);
        addBotMessage(aiResponse);
    }, 1000 + Math.random() * 1000);
}

/**
 * Initialize AI chat widget
 */
function initAIChat() {
    if (!chatToggle || !chatContainer) return;
    
    // Toggle chat visibility
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    
    // Send message on button click
    chatSend.addEventListener('click', handleChatInput);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatInput();
        }
    });
    
    // Quick suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatInput.value = question;
            handleChatInput();
        });
    });
    
    // Auto-open chat after 10 seconds
    setTimeout(() => {
        if (chatContainer && !chatContainer.classList.contains('active')) {
            chatBadge.style.display = 'flex';
            chatToggle.classList.add('pulse');
            setTimeout(() => {
                chatToggle.classList.remove('pulse');
            }, 3000);
        }
    }, 10000);
    
    // Close chat when clicking outside
    document.addEventListener('click', function(event) {
        if (chatContainer && chatToggle && !chatContainer.contains(event.target) && 
            !chatToggle.contains(event.target) && chatContainer.classList.contains('active')) {
            toggleChat();
        }
    });
}

// ============================================
// ANIMATION FUNCTIONS
// ============================================

/**
 * Add staggered animations to elements
 */
function addStaggeredAnimations() {
    // Features section animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1 + 1.2}s`;
    });
    
    // Recommended cards animations
    const recommendedCards = document.querySelectorAll('.recommended-card');
    recommendedCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1 + 1.4}s`;
    });
    
    // Add hover effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .feature-card, .slider-btn, .nav-dot, .recommended-card, .recommended-btn, .recommended-nav');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });
}

/**
 * Add pulse animation to chat toggle
 */
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 1s ease-in-out 3;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// BUY NOW BUTTON HANDLING
// ============================================

/**
 * Initialize buy now buttons
 */
function initBuyNowButtons() {
    document.querySelectorAll('.recommended-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === 'purchase.html') {
                // Already a link, let it navigate naturally
                return;
            }
            
            e.preventDefault();
            
            // Get product info from the card
            const card = this.closest('.recommended-card');
            const productName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace('RM ', '').replace(',', ''));
            
            // Add to cart
            const productId = productName.toLowerCase().replace(/\s+/g, '-');
            addToCart(productId, productName, price);
        });
    });
    
    // Also handle slider buy buttons
    document.querySelectorAll('.slider-slide .btn').forEach(button => {
        if (button.textContent.includes('Buy Now')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info from slide
                const slide = this.closest('.slider-slide');
                const slideTitle = slide.querySelector('h2').textContent;
                const priceText = slide.querySelector('.slide-price').textContent;
                const price = parseFloat(priceText.replace('RM ', '').replace(',', ''));
                
                // Add to cart
                const productId = slideTitle.toLowerCase().replace(/\s+/g, '-');
                addToCart(productId, slideTitle, price);
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    updateCartCount();
    highlightCurrentPage();
    initPageTransitions();
    
    // Initialize sliders
    initBannerSlider();
    initRecommendedSlider();
    
    // Initialize AI chat
    initAIChat();
    
    // Initialize animations
    addStaggeredAnimations();
    addPulseAnimation();
    
    // Initialize buy now buttons
    initBuyNowButtons();
    
    // Preload animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const placeholderText = this.alt || 'iPhone Image';
            const color = this.closest('.slide-1') ? '#1a1f71' : 
                         this.closest('.slide-2') ? '#ff6b6b' :
                         this.closest('.slide-3') ? '#2ecc71' :
                         this.closest('.slide-4') ? '#9b59b6' :
                         this.closest('.recommended-image') ? '#3498db' : '#667eea';
            
            this.src = `https://via.placeholder.com/400x400/${color.replace('#', '')}/ffffff?text=${encodeURIComponent(placeholderText)}`;
        });
    });
    
    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .recommended-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// ============================================
// UTILITY FUNCTIONS (Available globally)
// ============================================

/**
 * Format price in RM format
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
window.formatPrice = function(price) {
    return `RM ${price.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// EXPORT FUNCTIONS FOR MODULAR USE
// ============================================

// Make functions available globally if needed
window.App = {
    updateCartCount,
    addToCart,
    showNotification,
    highlightCurrentPage,
    initPageTransitions,
    changeSlide,
    nextSlide,
    prevSlide,
    initBannerSlider,
    scrollRecommended,
    initRecommendedSlider,
    toggleChat,
    handleChatInput,
    initAIChat,
    initBuyNowButtons
};