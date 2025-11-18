/**
 * MATEICOS - Main JavaScript
 * E-commerce functionality: Cart, Navigation, Reviews Carousel
 * Optimized and cleaned version
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

let cart = [];

// Load cart from localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try {
        cart = JSON.parse(savedCart);
    } catch (e) {
        cart = [];
        localStorage.removeItem('cart');
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setupSmoothScrolling();
    setupCartEventListeners();
    initReviewsCarousel();
    initMobileMenu();
    initProductCarousels();
});

// ============================================
// SMOOTH SCROLLING
// ============================================

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SHOPPING CART FUNCTIONS
// ============================================

function setupCartEventListeners() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-whatsapp');

    if (!cartIcon || !cartModal) return;

    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }

    // Close on outside click
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Checkout via WhatsApp
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', sendWhatsAppOrder);
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    return cart;
}

function addToCart(product) {
    if (!product || !product.id) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Producto eliminado del carrito');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1);
        saveCart();
        updateCartDisplay();
    }
}

function clearCart() {
    if (confirm('¿Seguro que querés vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification('Carrito vaciado');
    }
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countElement.textContent = totalItems;
        countElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">El carrito está vacío</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0';
        return;
    }

    let total = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;

        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toLocaleString('es-AR')}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1"
                               onchange="updateQuantity('${item.id}', this.value)">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toLocaleString('es-AR');
    }
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let message = '¡Hola! Quiero realizar el siguiente pedido:\n\n';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Subtotal: $${itemTotal.toLocaleString('es-AR')}\n\n`;
    });

    message += `*Total: $${total.toLocaleString('es-AR')}*`;

    const whatsappNumber = '2995901714';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}

// ============================================
// REVIEWS CAROUSEL
// ============================================

function initReviewsCarousel() {
    const track = document.querySelector('.resenas-track');
    if (!track) return;

    const cards = track.querySelectorAll('.resena-card');
    if (cards.length === 0) return;

    // Clone cards for infinite scroll effect
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    function animate() {
        scrollPosition += scrollSpeed;

        if (scrollPosition >= track.scrollWidth / 2) {
            scrollPosition = 0;
        }

        track.style.transform = `translateX(-${scrollPosition}px)`;
        requestAnimationFrame(animate);
    }

    // Pause on hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });

    animate();
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--verde-principal, #233c30);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-size: 0.95rem;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileMenu() {
    console.log('🔧 Initializing mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);

    if (!hamburger || !navMenu) {
        console.error('❌ CRITICAL: Hamburger or nav menu not found!');
        return;
    }

    console.log('✅ Elements found, adding click listener...');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        console.log('🍔 HAMBURGER CLICKED!');
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        console.log('Menu state:', isActive ? '🟢 OPEN' : '🔴 CLOSED');
        console.log('Hamburger classes:', hamburger.classList.toString());
        console.log('Nav menu classes:', navMenu.classList.toString());
        hamburger.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// PRODUCT IMAGE CAROUSEL
// ============================================

function initProductCarousels() {
    const carousels = document.querySelectorAll('.producto-image-carousel');

    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const images = container.querySelectorAll('img');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');
        const indicators = container.querySelectorAll('.carousel-indicator');

        let currentIndex = 0;

        function showImage(index) {
            // Remove active class from all images and indicators
            images.forEach(img => img.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));

            // Add active class to current image and indicator
            images[index].classList.add('active');
            indicators[index].classList.add('active');

            currentIndex = index;
        }

        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }

        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }

        // Event listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
            });
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showImage(index);
            });
        });

        // Optional: Auto-advance carousel every 5 seconds
        // setInterval(nextImage, 5000);
    });
}

// ============================================
// GLOBAL FUNCTIONS (for inline onclick handlers)
// ============================================

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
