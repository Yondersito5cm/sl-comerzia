// Número de WhatsApp de la empresa (Formato internacional sin '+', ej: 584141234567)
const TELEFONO_EMPRESA = "584120000000";

const productosContainer = document.getElementById('productos-container');
const btnAgregarFila = document.getElementById('btn-agregar-fila');
const contadorItems = document.getElementById('contador-items');
const orderForm = document.getElementById('order-form');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Toggle menú móvil
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Cerrar menú móvil automáticamente al tocar cualquier enlace
mobileMenu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});
});

// Función para actualizar el contador visual de filas
function actualizarContador() {
    const totalFilas = productosContainer.querySelectorAll('.producto-row').length;
    contadorItems.textContent = totalFilas;
}

// Función para crear una nueva celda/fila de producto
function crearFilaProducto(nombrePrellenado = '') {
    const row = document.createElement('div');
    row.className = 'producto-row grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-dark-800/90 border border-white/10 relative animate-fadeIn';
    
    row.innerHTML = `
        <div class="md:col-span-5">
            <label class="block text-[11px] text-gray-400 mb-1">Nombre / Descripción del Producto *</label>
            <input type="text" name="producto[]" required value="${nombrePrellenado}" placeholder="Ej: Repuesto / Artículo adicional"
                class="w-full px-3.5 py-2.5 rounded-lg bg-dark-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none">
        </div>
        <div class="md:col-span-3">
            <label class="block text-[11px] text-gray-400 mb-1">Color / Especificación</label>
            <input type="text" name="color[]" placeholder="Ej: Único / Negro"
                class="w-full px-3.5 py-2.5 rounded-lg bg-dark-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none">
        </div>
        <div class="md:col-span-3">
            <label class="block text-[11px] text-gray-400 mb-1">Cantidad *</label>
            <input type="number" name="cantidad[]" min="1" value="1" required
                class="w-full px-3.5 py-2.5 rounded-lg bg-dark-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none">
        </div>
        <div class="md:col-span-1 flex items-end justify-end">
            <button type="button" onclick="eliminarFila(this)" title="Eliminar producto"
                class="w-full md:w-10 h-10 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
        </div>
    `;

    productosContainer.appendChild(row);
    actualizarContador();
}

// Botón manual "+ Agregar otro producto"
btnAgregarFila.addEventListener('click', () => {
    crearFilaProducto();
});

// Función global para eliminar fila (mantiene al menos 1 fila obligatoria)
window.eliminarFila = function(boton) {
    const filas = productosContainer.querySelectorAll('.producto-row');
    if (filas.length > 1) {
        boton.closest('.producto-row').remove();
        actualizarContador();
    } else {
        // Si es la única fila, solo limpia los campos
        const inputs = filas[0].querySelectorAll('input');
        inputs[0].value = '';
        inputs[1].value = '';
        inputs[2].value = 1;
    }
};

// Función para añadir producto directo desde las tarjetas del catálogo
window.agregarDesdeCatalogo = function(nombreProducto) {
    const primeraFilaInput = productosContainer.querySelector('input[name="producto[]"]');
    
    // Si la primera fila está vacía, la rellena; si no, crea una fila nueva
    if (primeraFilaInput && primeraFilaInput.value.trim() === '') {
        primeraFilaInput.value = nombreProducto;
    } else {
        crearFilaProducto(nombreProducto);
    }

    // Desplaza suavemente hacia el formulario
    document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
};

// Procesar envío del formulario hacia WhatsApp
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const ciudad = document.getElementById('cliente-ciudad').value.trim();
    const notas = document.getElementById('cliente-notas').value.trim();

    const nombresProd = document.querySelectorAll('input[name="producto[]"]');
    const coloresProd = document.querySelectorAll('input[name="color[]"]');
    const cantidadesProd = document.querySelectorAll('input[name="cantidad[]"]');

    let listaTexto = "";
    nombresProd.forEach((input, index) => {
        const prod = input.value.trim();
        const col = coloresProd[index].value.trim() || "No especificado";
        const cant = cantidadesProd[index].value;

        listaTexto += `\n*${index + 1}.* ${prod}\n   • Color/Esp: ${col}\n   • Cantidad: ${cant} und.\n`;
    });

    let mensaje = `*NUEVA SOLICITUD DE PEDIDO - SL  COMERZIA, C.A.*\n\n`;
    mensaje += `*Cliente:* ${nombre}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    mensaje += `*Ciudad:* ${ciudad}\n`;
    mensaje += `----------------------------------\n`;
    mensaje += `*LISTA DE PRODUCTOS:*${listaTexto}`;
    mensaje += `----------------------------------\n`;
    if (notas) {
        mensaje += `*Notas:* ${notas}\n`;
    }

    const urlWhatsApp = `https://wa.me/${TELEFONO_EMPRESA}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
});