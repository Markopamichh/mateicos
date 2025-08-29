// Productos del catálogo
const productos = [
    {
        id: 1,
        nombre: "Mate Imperial Premium",
        descripcion: "Mate de calabaza premium con detalles en alpaca",
        precio: 15000,
        imagen: "assets/images/mate3.webp"
    },
    {
        id: 2,
        nombre: "Yerbero Artesanal",
        descripcion: "Yerbero de madera con tapa hermética",
        precio: 8500,
        imagen: "assets/images/yerbero2.jpeg"
    },
    {
        id: 3,
        nombre: "Bombilla Alpaca Premium",
        descripcion: "Bombilla Alpaca Premiumo",
        precio: 6500,
        imagen: "assets/images/bombilla2.webp"
    },
    {
        id: 1,
        nombre: "Bombilla Alpaca Premium",
        descripcion: "Bombilla Alpaca Premiumo",
        precio: 15000,
        imagen: "assets/images/bombilla3.webp"
    },
    {
        id: 1,
        nombre: "Mate torpedo Premium",
        descripcion: "Mate de calabaza premium con detalles en alpaca",
        precio: 15000,
        imagen: "assets/images/mate2.webp"
    },
    {
        id: 1,
        nombre: "Mate Imperial Premium",
        descripcion: "Mate de calabaza premium con detalles en alpaca",
        precio: 15000,
        imagen: "assets/images/mate4.webp"
    },
    {
        id: 1,
        nombre: "Mate Imperial Premium",
        descripcion: "Mate de calabaza premium con detalles en alpaca",
        precio: 15000,
        imagen: "assets/images/mate3.webp"
    },
    // Agregar más productos aquí
];

// Reseñas de clientes
const resenas = [
    {
        nombre: "María González",
        comentario: "Excelente calidad en los productos. Mi mate imperial es hermoso y el servicio fue impecable."
    },
    {
        nombre: "Juan Pérez",
        comentario: "Las bombillas son espectaculares, muy buena atención y envío rápido."
    },
    {
        nombre: "Laura Rodríguez",
        comentario: "El yerbero que compré es perfecto, mantiene la yerba siempre fresca."
    },
    {
        nombre: "Laura Rodríguez",
        comentario: "El yerbero que compré es perfecto, mantiene la yerba siempre fresca."
    },
    {
        nombre: "Laura Rodríguez",
        comentario: "El yerbero que compré es perfecto, mantiene la yerba siempre fresca."
    },
    {
        nombre: "Laura Rodríguez",
        comentario: "El yerbero que compré es perfecto, mantiene la yerba siempre fresca."
    },
    // Agregar más reseñas aquí
];

// Carrito de compras
let carrito = [];

// DOM Elements
const catalogoContainer = document.getElementById('catalogo-productos');
const resenasCarousel = document.querySelector('.resenas-carousel');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-whatsapp');

// Cargar productos en el catálogo
function cargarProductos() {
    catalogoContainer.innerHTML = productos.map(producto => `
        <div class="catalogo-item">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="catalogo-item-content">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar reseñas en carrusel
function cargarResenas() {
    // Duplicar las reseñas para efecto infinito
    const resenasInfinitas = [...resenas, ...resenas, ...resenas];
    
    resenasCarousel.innerHTML = resenasInfinitas.map(resena => `
        <div class="resena-card">
            <div class="cliente-info">
                <h4>${resena.nombre}</h4>
            </div>
            <p>${resena.comentario}</p>
        </div>
    `).join('');
    
    iniciarCarrusel();
}

// Carrusel automático infinito para reseñas
function iniciarCarrusel() {
    const resenaCards = document.querySelectorAll('.resena-card');
    const cardWidth = 320; // Ancho de cada tarjeta + margen
    let currentPosition = 0;
    const totalWidth = resenaCards.length * cardWidth / 3; // Dividido por 3 porque tenemos 3 copias
    let animationFrame;
    let isPaused = false;
    
    function animate() {
        if (!isPaused) {
            currentPosition -= 0.5; // Velocidad más suave
            
            // Reiniciar posición cuando llegamos al final del primer conjunto
            if (Math.abs(currentPosition) >= totalWidth) {
                currentPosition = 0;
            }
            
            resenasCarousel.style.transform = `translateX(${currentPosition}px)`;
        }
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Pausar al pasar el mouse
    resenasCarousel.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    // Reanudar al quitar el mouse
    resenasCarousel.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Iniciar animación
    animate();
}

// Funciones del carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    cartCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (cartItems) {
        cartItems.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <h4>${item.nombre}</h4>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>$${item.precio * item.cantidad}</p>
                </div>
                <button onclick="eliminarDelCarrito(${item.id})">×</button>
            </div>
        `).join('');

        cartTotal.textContent = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

// Event Listeners
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', () => {
    const mensaje = generarMensajeWhatsApp();
    const whatsappURL = `https://wa.me/2995901714?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
});

function generarMensajeWhatsApp() {
    let mensaje = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n";
    carrito.forEach(item => {
        mensaje += `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}\n`;
    });
    mensaje += `\nTotal: $${carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)}`;
    return mensaje;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarResenas();
});

// Smooth Scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
