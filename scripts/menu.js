// Elementos del DOM
const btnIniciar = document.getElementById('btnIniciar');
const btnCreditos = document.getElementById('btnCreditos');
const menuModos = document.getElementById('menuModos');
const modeCards = document.querySelectorAll('.mode-card');
const botonSonido = document.getElementById('botonSonido');

function reproducirSonido() {
    botonSonido.currentTime = 0;
    botonSonido.play();
}

// Event Listener para el botón Iniciar
btnIniciar.addEventListener('click', () => {
    reproducirSonido();
    menuModos.classList.add('visible');
    menuModos.classList.remove('oculto');
});

// Event Listener para el botón Créditos
btnCreditos.addEventListener('click', () => {
    reproducirSonido();
    window.location.href = 'html/credits.html';
});

// Manejadores para las tarjetas de modo de juego
modeCards.forEach(card => {
    card.addEventListener('click', () => {
        reproducirSonido();
        const mode = card.dataset.mode;
        switch(mode) {
            case 'classic':
                window.location.href = 'html/principal.html';
                break;
            case 'timetrial':
                window.location.href = 'html/timetrial.html';
                break;
            case 'zen':
                window.location.href = 'html/zen.html';
                break;
        }
    });
});
