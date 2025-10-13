// Variables globales
let cart = [];

// Cargar carrito desde localStorage si existe
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    try {
        cart = JSON.parse(savedCart);
    } catch (e) {
        cart = [];
    }
}

// Productos del catálogo
const productos = {
    'mates-imperiales': [
        {
            id: 'mate-imp-1',
            nombre: "Mate Imperial Premium",
            descripcion: "Mate de calabaza premium con detalles en alpaca",
            precio: 15000,
            imagen: "../assets/images/matecalabaza.jpg"
        },
        {
            id: 'mate-imp-2',
            nombre: "Mate Imperial Clásico",
            descripcion: "Mate de calabaza con virola de alpaca",
            precio: 12000,
            imagen: "../assets/images/mate4.webp"
        }
    ],
    'mates-torpedo': [
        {
            id: 'mate-tor-1',
            nombre: "Mate Torpedo Premium",
            descripcion: "Mate torpedo de calabaza con detalles en alpaca",
            precio: 13500,
            imagen: "../assets/images/matealgarrobo1.jpg"
        }
    ],
    'mates-camionero': [
        {
            id: 'mate-cam-1',
            nombre: "Mate Camionero Clásico",
            descripcion: "Mate camionero de calabaza",
            precio: 11000,
            imagen: "../assets/images/mate3.webp"
        }
    ],
    'yerberos-madera': [
        {
            id: 'yerb-mad-1',
            nombre: "Yerbero Artesanal de Madera",
            descripcion: "Yerbero de madera con tapa hermética",
            precio: 8500,
            imagen: "../assets/images/yerbero.jpeg"
        }
    ],
    'bombillas-alpaca': [
        {
            id: 'bomb-alp-1',
            nombre: "Bombilla Alpaca Premium",
            descripcion: "Bombilla de alpaca con diseños tradicionales",
            precio: 6500,
            imagen: "../assets/images/bombilla2.webp"
        }
    ]
};

// Función principal de inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando aplicación...');
    
    // Inicializar carrito
    updateCartCount();
    
    // Configurar navegación suave
    setupSmoothScrolling();
    
    // Configurar carrito
    setupCartEventListeners();
    
    // Configurar carrusel de reseñas
    initReviewsCarousel();
});

// Configurar navegación suave
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

// Configurar event listeners del carrito
function setupCartEventListeners() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = cartModal ? cartModal.querySelector('.close') : null;
    const checkoutBtn = document.getElementById('checkout-whatsapp');

    console.log('Configurando event listeners del carrito...');
    console.log('Cart icon:', cartIcon);
    console.log('Cart modal:', cartModal);

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Click en carrito');
            updateCartDisplay();
            if (cartModal) {
                cartModal.style.display = 'block';
                console.log('Modal abierto');
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Función para agregar al carrito (GLOBAL)
function addToCart(product) {
    console.log('Agregando producto al carrito:', product);
    
    try {
        // Validación mejorada del producto
        if (!product || typeof product !== 'object') {
            throw new Error('Producto no válido');
        }
        
        const requiredProps = ['id', 'name', 'price', 'image'];
        for (const prop of requiredProps) {
            if (!product[prop]) {
                throw new Error(`Falta la propiedad ${prop} en el producto`);
            }
        }
        
        if (typeof product.price !== 'number' || product.price <= 0) {
            throw new Error('El precio del producto no es válido');
        }
        
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Cantidad aumentada:', existingItem);
        } else {
            const newItem = { 
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1 
            };
            cart.push(newItem);
            console.log('Nuevo producto agregado:', newItem);
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Carrito actual:', cart);
        updateCartCount();
        updateCartDisplay();
        showNotification('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        showNotification('Error al agregar el producto', 'error');
    }
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        console.log('Contador actualizado:', totalItems);
    }
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-whatsapp');
    
    console.log('Actualizando display del carrito');
    
    if (!cartItems || !cartTotal) {
        console.error('No se encontraron elementos del carrito');
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6C757D; padding: 20px;">Tu carrito está vacío</p>';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        if (checkoutBtn) checkoutBtn.style.display = 'block';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='assets/images/placeholder.jpg'" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', -1)" 
                                class="quantity-btn" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" 
                                class="quantity-btn">+</button>
                    </div>
                    <p>Precio unitario: $${item.price.toLocaleString('es-AR')}</p>
                    <p><strong>Subtotal: $${(item.price * item.quantity).toLocaleString('es-AR')}</strong></p>
                </div>
                <button onclick="removeFromCart('${item.id}')" 
                        class="remove-btn" 
                        title="Eliminar producto">×</button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        // Agregar botón para vaciar carrito
        const clearCartBtn = document.createElement('button');
        clearCartBtn.className = 'clear-cart-btn';
        clearCartBtn.innerHTML = 'Vaciar Carrito';
        clearCartBtn.onclick = clearCart;
        cartItems.appendChild(clearCartBtn);
    }

    cartTotal.textContent = total.toLocaleString('es-AR');
    console.log('Total calculado:', total);
}

// Función para remover del carrito (GLOBAL)
function removeFromCart(productId) {
    console.log('Removiendo producto:', productId);
    cart = cart.filter(item => item.id !== productId);
    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Producto eliminado del carrito');
}

// Función para el checkout
function handleCheckout() {
    console.log('Iniciando checkout');
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    let message = '¡Hola! Me interesa comprar los siguientes productos:\n\n';
    let total = 0;

    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio unitario: $${item.price.toLocaleString()}\n`;
        message += `  Subtotal: $${(item.price * item.quantity).toLocaleString()}\n\n`;
        total += item.price * item.quantity;
    });

    message += `TOTAL: $${total.toLocaleString()}\n\n`;
    message += '¿Podrían confirmarme la disponibilidad y formas de pago?';
    
    const whatsappUrl = `https://wa.me/2995901714?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('Mensaje de WhatsApp generado');
}

// Función para mostrar notificaciones
function showNotification(message) {
    console.log('Mostrando notificación:', message);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2E5945;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 15px rgba(46, 89, 69, 0.3);
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
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

// Inicializar carrusel de reseñas
function initReviewsCarousel() {
    const reviewsTrack = document.querySelector('.resenas-track');
    if (!reviewsTrack) return;
    
    console.log('Inicializando carrusel de reseñas');
    
    // La animación ya está en CSS, solo necesitamos pausar en hover
    const reviewsCarousel = document.querySelector('.resenas-carousel');
    if (reviewsCarousel) {
        reviewsCarousel.addEventListener('mouseenter', () => {
            reviewsTrack.style.animationPlayState = 'paused';
        });
        
        reviewsCarousel.addEventListener('mouseleave', () => {
            reviewsTrack.style.animationPlayState = 'running';
        });
    }
}

// Función para actualizar la cantidad de un producto
function updateQuantity(productId, change) {
    try {
        const item = cart.find(item => item.id === productId);
        if (!item) {
            throw new Error('Producto no encontrado');
        }

        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
            return; // No permitir cantidades menores a 1
        }

        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification(`Cantidad actualizada: ${item.name}`);
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        showNotification('Error al actualizar cantidad', 'error');
    }
}

// Función para vaciar el carrito
function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification('Carrito vaciado');
    }
}

// Función mejorada para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    // Estilos según el tipo de notificación
    if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#2E5945';
    }
    
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

// Hacer funciones globales para que funcionen en el HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;

console.log('main.js cargado completamente');
