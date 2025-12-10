// --- BASE DE DATOS DE USUARIOS ---
const credentials = {
    'Recepcionista': { pass: 'R123', role: 'recepcion' },
    'Cajero':        { pass: 'C123', role: 'caja' },
    'Administrador': { pass: 'A123', role: 'admin' }
};

// --- FUNCIÓN DE LOGIN ---
function login() {
    const user = document.getElementById('username').value.trim(); // Quita espacios
    const pass = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');

    // Validar si el usuario existe y la contraseña coincide
    if (credentials[user] && credentials[user].pass === pass) {
        // Login Exitoso
        errorMsg.style.display = 'none';
        enterSystem(credentials[user].role);
        // Limpiar campos por seguridad
        document.getElementById('password').value = '';
    } else {
        // Error
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Usuario o contraseña incorrectos";
        
        // Efecto visual de error
        document.querySelector('.login-card').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
}

// --- NAVEGACIÓN ---
function enterSystem(roleId) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Mostrar la vista correspondiente
    document.getElementById(roleId + '-view').classList.add('active');
}

function logout() {
    location.reload(); // Recarga la página para volver al login
}

// --- LÓGICA RECEPCIÓN (MESAS) ---
const tableGrid = document.getElementById('table-grid');
const freeCount = document.getElementById('free-count');
const busyCount = document.getElementById('busy-count');
let tables = Array.from({length: 12}, (_, i) => ({ id: i + 1, status: 'free' }));

function renderTables() {
    tableGrid.innerHTML = '';
    let free = 0;
    tables.forEach(table => {
        const div = document.createElement('div');
        div.className = `table-item ${table.status}`;
        div.innerHTML = `
            <span class="material-icons">deck</span>
            <b>Mesa ${table.id}</b>
            <small>${table.status === 'free' ? 'Libre' : 'Ocupada'}</small>
        `;
        div.onclick = () => {
            table.status = table.status === 'free' ? 'busy' : 'free';
            renderTables();
        };
        tableGrid.appendChild(div);
        if(table.status === 'free') free++;
    });
    freeCount.innerText = free;
    busyCount.innerText = tables.length - free;
}
renderTables(); // Iniciar mesas

// --- LÓGICA CAJA (CARRITO) ---
let cart = [];
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cart-list');
    const totalEl = document.getElementById('total-price');
    list.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <li>
                ${item.name} - S/ ${item.price.toFixed(2)}
                <span onclick="cart.splice(${index},1); updateCart()" style="color:red;cursor:pointer">x</span>
            </li>
        `;
    });
    totalEl.innerText = total.toFixed(2);
}

function processPayment() {
    if(cart.length === 0) return alert("Agrega platos a la comanda primero.");
    const total = document.getElementById('total-price').innerText;
    alert(`✅ Cobro exitoso por S/ ${total}\nImprimiendo ticket...`);
    cart = [];
    updateCart();
}