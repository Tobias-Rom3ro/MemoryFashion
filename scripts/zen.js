// Elementos del DOM
const tablero = document.getElementById('tablero');
const contadorMovimientos = document.getElementById('contador-movimientos');
const contadorTiempo = document.getElementById('contador-tiempo');
const btnReiniciar = document.getElementById('reiniciar');
const botonesNivel = document.querySelectorAll('.btn-nivel');
const estrellas = document.querySelectorAll('.estrellas .fa-star');
const puntos = document.getElementById('puntos');

// Sonidos
const musicaFondo = document.getElementById('musicaFondo');
const botonSonido = document.getElementById('botonSonido');
const sonidoAcierto = document.getElementById('sonidoAcierto');
const sonidoError = document.getElementById('sonidoError');
const sonidoVictoria = document.getElementById('sonidoVictoria');

// Variables del juego
let cartas = [];
let cartasVolteadas = [];
let movimientos = 0;
let parejasEncontradas = 0;
let tiempoInicio = 0;
let temporizador = null;
let juegoTerminado = false;
let nivelActual = 'medio';
let puntosActuales = 1000;

// Íconos de moda para las cartas
const iconosModa = [
    'fa-tshirt', 'fa-shoe-prints', 'fa-hat-wizard', 'fa-glasses',
    'fa-gem', 'fa-shopping-bag', 'fa-spa', 'fa-socks',
    'fa-crown', 'fa-ring', 'fa-vest', 'fa-scarf'
];

// Configuración de dificultades
const configuracionDificultad = {
    facil: { filas: 3, columnas: 2, totalParejas: 3 },
    medio: { filas: 4, columnas: 4, totalParejas: 8 },
    dificil: { filas: 5, columnas: 4, totalParejas: 10 }
};

// Cargar configuración guardada
const gameConfig = {
    timetrialConfig: {
        maxTime: 120
    }
};

// Función para mezclar array
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
    puntosActuales = 1000;
    contadorMovimientos.innerText = movimientos;
    puntos.innerText = `Puntos: ${puntosActuales}`;
    
    // Limpiar temporizador anterior
    if (temporizador) clearInterval(temporizador);
    tiempoInicio = Date.now();
    iniciarTemporizador();
    
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
        elementoCarta.classList.contains('volteada')) {
        return;
    }
    
    // Voltear la carta
    elementoCarta.classList.add('volteada');
    cartasVolteadas.push({ index: index, carta: carta });
    
    // Si hay dos cartas volteadas, verificar coincidencia
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
        setTimeout(() => {
            sonidoAcierto.currentTime = 0;
            sonidoAcierto.play();
            elemento1.classList.add('encontrada');
            elemento2.classList.add('encontrada');
            cartas[carta1.index].encontrada = true;
            cartas[carta2.index].encontrada = true;
            cartasVolteadas = [];
            parejasEncontradas++;
            
            // Verificar victoria
            if (parejasEncontradas === configuracionDificultad[nivelActual].totalParejas) {
                finalizarJuego(true);
            }
        }, 500);
    } else {
        // No coinciden
        setTimeout(() => {
            sonidoError.currentTime = 0;
            sonidoError.play();
            elemento1.classList.remove('volteada');
            elemento2.classList.remove('volteada');
            cartasVolteadas = [];
            // Restar puntos por error
            puntosActuales = Math.max(0, puntosActuales - 50);
            puntos.innerText = `Puntos: ${puntosActuales}`;
        }, 1000);
    }
}

// Función para el temporizador
function iniciarTemporizador() {
    temporizador = setInterval(() => {
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;
        contadorTiempo.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
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
    const config = configuracionDificultad[nivelActual];
    const movimientosOptimos = config.totalParejas * 2;
    const movimientosBuenos = movimientosOptimos * 1.5;
    const movimientosRegulares = movimientosOptimos * 2;

    if (movimientos > movimientosRegulares) {
        estrellas[2].classList.add('apagada');
        estrellas[1].classList.add('apagada');
    } else if (movimientos > movimientosBuenos) {
        estrellas[2].classList.add('apagada');
    }
}

// Función para finalizar el juego
function finalizarJuego(victoria) {
    juegoTerminado = true;
    clearInterval(temporizador);
    
    if (victoria) {
        const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
        const estrellasGanadas = 3 - document.querySelectorAll('.estrellas .apagada').length;
        
        // Calcular puntuación final
        const puntosTiempo = Math.max(0, 300 - tiempoFinal);
        const puntosEstrellas = estrellasGanadas * 200;
        const puntuacionFinal = puntosActuales + puntosTiempo + puntosEstrellas;
        
        setTimeout(() => {
            sonidoVictoria.play();
            Swal.fire({
                title: '¡Felicitaciones!',
                html: `
                    <p>¡Has completado el nivel ${nivelActual}!</p>
                    <p>Tiempo: ${Math.floor(tiempoFinal / 60)}:${(tiempoFinal % 60).toString().padStart(2, '0')}</p>
                    <p>Movimientos: ${movimientos}</p>
                    <p>Estrellas: ${estrellasGanadas}</p>
                    <p>Puntuación Final: ${puntuacionFinal}</p>
                `,
                icon: 'success',
                confirmButtonText: 'Jugar de nuevo'
            }).then(() => {
                inicializarJuego(nivelActual);
            });
        }, 500);
    }
}

// Event Listeners
btnReiniciar.addEventListener('click', () => {
    botonSonido.play();
    inicializarJuego(nivelActual);
});

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
