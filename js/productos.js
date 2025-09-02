document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('mates.html')) {
        cargarProductosPorCategoria('mates');
    } else if (path.includes('yerberos.html')) {
        cargarProductosPorCategoria('yerberos');
    } else if (path.includes('bombillas.html')) {
        cargarProductosPorCategoria('bombillas');
    }
});

function cargarProductosPorCategoria(categoria) {
    const containerId = `catalogo-productos-${categoria}`;
    const container = document.getElementById(containerId);
    let productosCategoria = [];

    categorias[categoria].subcategorias.forEach(subcat => {
        if (productos[subcat.id]) {
            productosCategoria = [...productosCategoria, ...productos[subcat.id]];
        }
    });

    container.innerHTML = productosCategoria.map(producto => `
        <div class="catalogo-item">
            <img src="../${producto.imagen}" alt="${producto.nombre}">
            <div class="catalogo-item-content">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
                <button class="btn-agregar">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Definición de productos (debería estar en un archivo separado y cargarse antes)
const productos = {
    'mates-imperiales': [
        {
            id: 1,
            nombre: "Mate Imperial Premium",
            descripcion: "Mate de calabaza premium con detalles en alpaca",
            precio: 15000,
            imagen: "assets/images/mate3.webp"
        },
        {
            id: 2,
            nombre: "Mate Imperial Clásico",
            descripcion: "Mate de calabaza con virola de alpaca",
            precio: 12000,
            imagen: "assets/images/mate4.webp"
        }
    ],
    'mates-torpedo': [
        {
            id: 3,
            nombre: "Mate Torpedo Premium",
            descripcion: "Mate torpedo de calabaza con detalles en alpaca",
            precio: 13500,
            imagen: "assets/images/mate2.webp"
        }
    ],
    'mates-camionero': [
        {
            id: 4,
            nombre: "Mate Camionero Clásico",
            descripcion: "Mate camionero de calabaza",
            precio: 11000,
            imagen: "assets/images/mate3.webp"
        }
    ],
    'yerberos-madera': [
        {
            id: 5,
            nombre: "Yerbero Artesanal de Madera",
            descripcion: "Yerbero de madera con tapa hermética",
            precio: 8500,
            imagen: "assets/images/yerbero.jpeg"
        }
    ],
    'yerberos-ceramica': [
        {
            id: 6,
            nombre: "Yerbero de Cerámica Premium",
            descripcion: "Yerbero de cerámica con diseño exclusivo",
            precio: 7500,
            imagen: "assets/images/yerbero2.jpeg"
        }
    ],
    'bombillas-alpaca': [
        {
            id: 7,
            nombre: "Bombilla Alpaca Premium",
            descripcion: "Bombilla de alpaca con diseños tradicionales",
            precio: 6500,
            imagen: "assets/images/bombilla2.webp"
        }
    ],
    'bombillas-acero': [
        {
            id: 8,
            nombre: "Bombilla Acero Inoxidable",
            descripcion: "Bombilla de acero inoxidable premium",
            precio: 4500,
            imagen: "assets/images/bombilla3.webp"
        }
    ]
};
