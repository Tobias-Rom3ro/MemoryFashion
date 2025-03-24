// Elementos del DOM
const tablero = document.getElementById('tablero');
const contadorMovimientos = document.getElementById('contador-movimientos');
const contadorTiempo = document.getElementById('contador-tiempo');
const btnReiniciar = document.getElementById('reiniciar');
const estrellas = document.querySelectorAll('.estrellas .fa-star');
const botonesNivel = document.querySelectorAll('.btn-nivel');

// Importando los sonidos 
const sonidoAcierto = document.getElementById("sonidoAcierto");
const sonidoError = document.getElementById("sonidoError");
const sonidoVictoria = document.getElementById("sonidoVictoria");

// Variables del juego
let cartas = [];
let cartasVolteadas = [];
let movimientos = 0;
let parejasEncontradas = 0;
let tiempoTranscurrido = 0;
let cronometro;
let juegoIniciado = false;
let dificultad = 'medio'; // Dificultad por defecto
let totalParejas = 8; // Para nivel medio
let puntos = 1000; // Puntos iniciales
let intentosFallidos = 0;

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

// Inicializar el juego
function iniciarJuego() {
    // Detener cronómetro anterior si existe
    if (cronometro) {
        clearInterval(cronometro);
    }

    // Reiniciar variables
    cartas = [];
    cartasVolteadas = [];
    movimientos = 0;
    parejasEncontradas = 0;
    tiempoTranscurrido = 0;
    juegoIniciado = false;
    puntos = 1000;
    intentosFallidos = 0;

    // Actualizar contadores en la interfaz
    contadorMovimientos.textContent = '0';
    contadorTiempo.textContent = '00:00';
    document.getElementById('puntos').textContent = `Puntos: ${puntos}`;

    // Restaurar estrellas
    estrellas.forEach(estrella => {
        estrella.classList.remove('apagada');
    });

    // Establecer dificultad y crear tablero
    configurarDificultad();
    crearTablero();
}

// Configurar la dificultad seleccionada
function configurarDificultad() {
    const config = configuracionDificultad[dificultad];
    totalParejas = config.totalParejas;

    // Configurar el tablero según la dificultad
    tablero.className = 'tablero ' + dificultad;

    // Actualizar botones de nivel
    botonesNivel.forEach(btn => {
        if (btn.dataset.dificultad === dificultad) {
            btn.classList.add('seleccionado');
        } else {
            btn.classList.remove('seleccionado');
        }
    });
}

// Crear tablero con las cartas
function crearTablero() {
    tablero.innerHTML = '';

    // Seleccionar íconos según el número de parejas
    const iconosSeleccionados = iconosModa.slice(0, totalParejas);

    // Crear array de pares de cartas
    let paresDeCartas = [];
    iconosSeleccionados.forEach(icono => {
        // Agregar dos cartas con el mismo icono (la pareja)
        paresDeCartas.push({ icono: icono, encontrada: false });
        paresDeCartas.push({ icono: icono, encontrada: false });
    });

    // Mezclar las cartas aleatoriamente
    paresDeCartas = mezclarArray(paresDeCartas);
    cartas = paresDeCartas;

    // Crear elementos de las cartas en el DOM
    cartas.forEach((carta, index) => {
        const cartaElemento = document.createElement('div');
        cartaElemento.className = 'carta';
        cartaElemento.dataset.index = index;

        // Crear las caras de la carta
        const caraFrontal = document.createElement('div');
        caraFrontal.className = 'carta-frente';
        const iconoElemento = document.createElement('i');
        iconoElemento.className = `fas ${carta.icono} icono-moda`;
        caraFrontal.appendChild(iconoElemento);

        const caraTrasera = document.createElement('div');
        caraTrasera.className = 'carta-trasera';
        const iconoLogo = document.createElement('img');
        iconoLogo.src = '../resources/images/icon.png';
        iconoLogo.alt = 'Memory Fashion';
        iconoLogo.className = 'icono-trasero';
        caraTrasera.appendChild(iconoLogo);

        // Agregar las caras a la carta
        cartaElemento.appendChild(caraFrontal);
        cartaElemento.appendChild(caraTrasera);

        // Agregar evento de clic
        cartaElemento.addEventListener('click', voltearCarta);

        // Agregar la carta al tablero
        tablero.appendChild(cartaElemento);
    });
}

// Función para mezclar un array (algoritmo Fisher-Yates)
function mezclarArray(array) {
    let arrayCopia = [...array];
    for (let i = arrayCopia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopia[i], arrayCopia[j]] = [arrayCopia[j], arrayCopia[i]];
    }
    return arrayCopia;
}

// Manejar el evento de voltear una carta
function voltearCarta() {
    // Iniciar cronómetro en el primer clic
    if (!juegoIniciado) {
        iniciarCronometro();
        juegoIniciado = true;
    }

    const index = parseInt(this.dataset.index);
    const carta = cartas[index];

    // Verificar si la carta ya está volteada o ya fue encontrada
    if (this.classList.contains('volteada') || carta.encontrada || cartasVolteadas.length >= 2) {
        return;
    }

    // Voltear la carta
    this.classList.add('volteada');
    cartasVolteadas.push({ index: index, elemento: this });

    // Si hay dos cartas volteadas, verificar si son iguales
    if (cartasVolteadas.length === 2) {
        actualizarMovimientos();
        verificarCoincidencia();
    }
}

// Actualizar contador de movimientos
function actualizarMovimientos() {
    movimientos++;
    contadorMovimientos.textContent = movimientos;

    // Actualizar estrellas según el número de movimientos
    actualizarEstrellas();
}

// Actualizar las estrellas según el rendimiento
function actualizarEstrellas() {
    // Thresholds para perder estrellas (ajustar según dificultad)
    const limitesPorDificultad = {
        facil: [4, 6],
        medio: [6, 10],
        dificil: [10, 16]
    };

    const limites = limitesPorDificultad[dificultad];

    if (movimientos > limites[1]) {
        estrellas[1].classList.add('apagada');
        estrellas[2].classList.add('apagada');
    } else if (movimientos > limites[0]) {
        estrellas[2].classList.add('apagada');
    }
}

// Verificar si las dos cartas volteadas coinciden
function verificarCoincidencia() {
    const carta1 = cartas[cartasVolteadas[0].index];
    const carta2 = cartas[cartasVolteadas[1].index];

    if (carta1.icono === carta2.icono) {
        // Las cartas coinciden
        setTimeout(() => {
            sonidoAcierto.currentTime = 0; // reiniciar el audio por si estaba sonando
            sonidoAcierto.play(); //reproducir el audio para cuando coincide la pareja
            cartasVolteadas.forEach(c => {
                c.elemento.classList.add('encontrada');
                cartas[c.index].encontrada = true;
            });
            cartasVolteadas = [];
            parejasEncontradas++;

            // Verificar si se han encontrado todas las parejas
            if (parejasEncontradas === totalParejas) {
                finalizarJuego(true);
            }
        }, 500);
    } else {
        // Las cartas no coinciden
        puntos -= 10; // Restar puntos por intento fallido
        intentosFallidos++;
        document.getElementById('puntos').textContent = `Puntos: ${puntos}`;
        setTimeout(() => {
            sonidoError.currentTime = 0; // reiniciar el audio por si estaba sonando
            sonidoError.play(); //reproducir el audio para cuando NO coincide la pareja
            cartasVolteadas.forEach(c => {
                c.elemento.classList.remove('volteada');
            });
            cartasVolteadas = [];
        }, 1000);
    }
}

// Iniciar el cronómetro
function iniciarCronometro() {
    cronometro = setInterval(() => {
        tiempoTranscurrido++;
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;
        contadorTiempo.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        puntos -= 1; // Restar puntos por tiempo
        document.getElementById('puntos').textContent = `Puntos: ${puntos}`;

        if (puntos <= 0) {
            finalizarJuego(false);
        }
    }, 1000);
}

// Finalizar el juego cuando se encuentran todas las parejas
function finalizarJuego(gano) {
    clearInterval(cronometro);

    // Calcular puntuación (estrellas)
    const estrellasSinApagar = document.querySelectorAll('.estrellas .fa-star:not(.apagada)').length;

    // Mostrar mensaje de victoria con SweetAlert
    setTimeout(() => {
        if (gano) {
            sonidoVictoria.currentTime = 0; //reiniciar el audio por si estab sonando 
            sonidoVictoria.play(); //reproducir sonido de victoria 
        }
        Swal.fire({
            title: gano ? '¡Felicidades!' : '¡Game Over!',
            html: `
                <p>Has ${gano ? 'completado' : 'perdido'} el reto</p>
                <p><i class="fas fa-shoe-prints"></i> Movimientos: ${movimientos}</p>
                <p><i class="fas fa-clock"></i> Tiempo: ${contadorTiempo.textContent}</p>
                <p>Puntuación: ${puntos}</p>
                <p>Intentos fallidos: ${intentosFallidos}</p>
            `,
            icon: gano ? 'success' : 'error',
            confirmButtonText: 'Jugar de nuevo',
            confirmButtonColor: '#d81b60'
        }).then((result) => {
            if (result.isConfirmed) {
                iniciarJuego();
            }
        });
    }, 500);
}

// Event Listeners
btnReiniciar.addEventListener('click', iniciarJuego);

// Event Listeners para los botones de nivel
botonesNivel.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover seleccionado de todos los botones
        botonesNivel.forEach(b => b.classList.remove('seleccionado'));
        // Agregar seleccionado al botón clickeado
        btn.classList.add('seleccionado');
        // Actualizar dificultad y reiniciar juego
        dificultad = btn.dataset.dificultad;
        iniciarJuego();
    });
});

// Iniciar el juego cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Configurar dificultad inicial
    dificultad = 'medio';
    // Seleccionar el botón de dificultad media
    botonesNivel.forEach(btn => {
        if (btn.dataset.dificultad === dificultad) {
            btn.classList.add('seleccionado');
        }
    });
    // Iniciar el juego
    iniciarJuego();
});