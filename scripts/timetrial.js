// Elementos del DOM
const tablero = document.getElementById('tablero');
const contadorMovimientos = document.getElementById('contador-movimientos');
const contadorTiempo = document.getElementById('contador-tiempo');
const btnReiniciar = document.getElementById('reiniciar');
const estrellas = document.querySelectorAll('.estrellas .fa-star');
const botonesNivel = document.querySelectorAll('.btn-nivel');

// Sonidos
const musicaFondo = document.getElementById('musicaFondo');
const botonSonido = document.getElementById('botonSonido');
const sonidoAcierto = document.getElementById('sonidoAcierto');
const sonidoError = document.getElementById('sonidoError');
const sonidoVictoria = document.getElementById('sonidoVictoria');
const sonidoDerrota = document.getElementById('sonidoDerrota');

// Variables del juego
let cartas = [];
let cartasVolteadas = [];
let movimientos = 0;
let parejasEncontradas = 0;
let temporizador = null;
let tiempoRestante = 120; // 2 minutos por defecto
let juegoTerminado = false;
let nivelActual = 'medio';

// Íconos de moda para las cartas
const iconosModa = [
    'fa-tshirt', 'fa-shoe-prints', 'fa-hat-wizard', 'fa-glasses',
    'fa-gem', 'fa-shopping-bag', 'fa-spa', 'fa-socks',
    'fa-crown', 'fa-ring', 'fa-vest', 'fa-scarf'
];

// Configuración de dificultades
const configuracionDificultad = {
    facil: { filas: 3, columnas: 2, totalParejas: 3, tiempo: 10 },
    medio: { filas: 4, columnas: 4, totalParejas: 8, tiempo: 50 },
    dificil: { filas: 5, columnas: 4, totalParejas: 10, tiempo: 140 }
};

// Cargar configuración guardada
const gameConfig = JSON.parse(localStorage.getItem('gameConfig')) || {
    timetrialConfig: {
        maxTime: 120
    }
};

// Función para barajar array
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para inicializar el juego
function inicializarJuego(nivel = 'medio') {
    // Resetear variables
    cartas = [];
    cartasVolteadas = [];
    movimientos = 0;
    parejasEncontradas = 0;
    juegoTerminado = false;
    nivelActual = nivel;
    contadorMovimientos.innerText = movimientos;
    
    // Establecer tiempo según la dificultad
    tiempoRestante = configuracionDificultad[nivel].tiempo;
    actualizarContadorTiempo();
    
    // Limpiar temporizador anterior
    if (temporizador) clearInterval(temporizador);
    
    // Actualizar estrellas
    estrellas.forEach(estrella => estrella.classList.remove('apagada'));
    
    // Actualizar botones de nivel
    botonesNivel.forEach(btn => {
        btn.classList.remove('seleccionado');
        if (btn.dataset.dificultad === nivel) {
            btn.classList.add('seleccionado');
        }
    });
    
    // Configurar tablero según dificultad
    const config = configuracionDificultad[nivel];
    tablero.className = `tablero ${nivel}`;
    
    // Crear y mezclar cartas
    const iconosSeleccionados = iconosModa.slice(0, config.totalParejas);
    let paresDeCartas = [];
    iconosSeleccionados.forEach(icono => {
        paresDeCartas.push({ icono: icono, encontrada: false });
        paresDeCartas.push({ icono: icono, encontrada: false });
    });
    cartas = mezclarArray(paresDeCartas);
    
    // Crear tablero
    crearTablero();
    
    // Iniciar temporizador
    iniciarTemporizador();
}

// Función para crear el tablero
function crearTablero() {
    tablero.innerHTML = '';
    cartas.forEach((carta, index) => {
        const elementoCarta = document.createElement('div');
        elementoCarta.className = 'carta';
        elementoCarta.innerHTML = `
            <div class="carta-frente">
                <i class="fas ${carta.icono} icono-moda"></i>
            </div>
            <div class="carta-trasera">
                <img src="../resources/images/icon.png" alt="Memory Fashion" class="icono-trasero">
            </div>
        `;
        elementoCarta.addEventListener('click', () => voltearCarta(index));
        tablero.appendChild(elementoCarta);
    });
}

// Función para voltear carta
function voltearCarta(index) {
    if (juegoTerminado) return;
    
    const carta = cartas[index];
    const elementoCarta = document.querySelectorAll('.carta')[index];
    
    // Verificar si la carta ya está volteada o encontrada
    if (cartasVolteadas.length === 2 || carta.encontrada || 
        elementoCarta.classList.contains('volteada')) return;
    
    // Voltear la carta
    elementoCarta.classList.add('volteada');
    cartasVolteadas.push({ index, carta });
    botonSonido.play();
    
    if (cartasVolteadas.length === 2) {
        movimientos++;
        contadorMovimientos.innerText = movimientos;
        actualizarEstrellas();
        verificarCoincidencia();
    }
}

// Función para verificar coincidencia
function verificarCoincidencia() {
    const [carta1, carta2] = cartasVolteadas;
    const elemento1 = document.querySelectorAll('.carta')[carta1.index];
    const elemento2 = document.querySelectorAll('.carta')[carta2.index];
    
    if (carta1.carta.icono === carta2.carta.icono) {
        // Coincidencia encontrada
        carta1.carta.encontrada = true;
        carta2.carta.encontrada = true;
        parejasEncontradas++;
        sonidoAcierto.play();
        
        // Verificar victoria
        if (parejasEncontradas === configuracionDificultad[nivelActual].totalParejas) {
            finalizarJuego(true);
        }
    } else {
        // No coinciden
        sonidoError.play();
        setTimeout(() => {
            elemento1.classList.remove('volteada');
            elemento2.classList.remove('volteada');
        }, 1000);
    }
    
    // Limpiar cartas volteadas
    setTimeout(() => {
        cartasVolteadas = [];
    }, 1000);
}

// Función para el temporizador
function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tiempoRestante--;
        actualizarContadorTiempo();
        
        // Añadir clase de urgencia cuando quede poco tiempo
        if (tiempoRestante <= 10) {
            contadorTiempo.parentElement.classList.add('urgente');
        }
        
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            finalizarJuego(false);
        }
    }, 1000);
}

// Función para actualizar el contador de tiempo
function actualizarContadorTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    contadorTiempo.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Función para actualizar las estrellas según los movimientos
function actualizarEstrellas() {
    const movimientosPorEstrella = configuracionDificultad[nivelActual].totalParejas * 2;
    
    if (movimientos > movimientosPorEstrella * 2) {
        estrellas[2].classList.add('apagada');
        estrellas[1].classList.add('apagada');
    } else if (movimientos > movimientosPorEstrella * 1.5) {
        estrellas[2].classList.add('apagada');
    }
}

// Función para finalizar el juego
function finalizarJuego(victoria) {
    juegoTerminado = true;
    clearInterval(temporizador);
    
    if (victoria) {
        const estrellasTotales = [...estrellas].filter(e => !e.classList.contains('apagada')).length;
        sonidoVictoria.play();
        
        Swal.fire({
            title: '¡Victoria!',
            html: `
                ¡Completaste el nivel con ${movimientos} movimientos!<br>
                Tiempo restante: ${contadorTiempo.textContent}<br>
                Estrellas conseguidas: ${estrellasTotales}
            `,
            icon: 'success',
            confirmButtonText: 'Jugar de nuevo',
            confirmButtonColor: '#d81b60',
            background: '#fff',
            iconColor: '#d81b60'
        }).then((result) => {
            if (result.isConfirmed) {
                inicializarJuego(nivelActual);
            }
        });
    } else {
        sonidoDerrota.play();
        
        Swal.fire({
            title: '¡Se acabó el tiempo!',
            html: `
                <div style="font-family: 'Londrina Solid', sans-serif;">
                    <p style="font-size: 1.2em; margin-bottom: 15px;">¡Será a la próxima!</p>
                    <p>Parejas encontradas: ${parejasEncontradas} de ${configuracionDificultad[nivelActual].totalParejas}</p>
                    <p>Movimientos realizados: ${movimientos}</p>
                </div>
            `,
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#d81b60',
            background: '#fff',
            iconColor: '#d81b60'
        }).then((result) => {
            if (result.isConfirmed) {
                inicializarJuego(nivelActual);
            }
        });
    }
}

// Event Listeners
btnReiniciar.addEventListener('click', () => inicializarJuego(nivelActual));

botonesNivel.forEach(boton => {
    boton.addEventListener('click', () => {
        botonSonido.play();
        const nivel = boton.dataset.dificultad;
        inicializarJuego(nivel);
    });
});

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarJuego('medio');
});
