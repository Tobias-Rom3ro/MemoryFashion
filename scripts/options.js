// Elementos del DOM
const optionsPanel = document.getElementById('optionsPanel');
const closeOptionsBtn = document.getElementById('closeOptions');
const saveOptionsBtn = document.getElementById('saveOptions');
const optionBtns = document.querySelectorAll('.option-btn');
const timetrialSettings = document.querySelector('.timetrial-settings');
const maxTimeInput = document.getElementById('maxTime');

// Configuración por defecto
const defaultConfig = {
    gameMode: 'classic',
    theme: 'light',
    sound: 'on',
    timetrialConfig: {
        maxTime: 120
    }
};

// Cargar configuración guardada o usar valores por defecto
let gameConfig = JSON.parse(localStorage.getItem('gameConfig')) || defaultConfig;

// Función para abrir el panel de opciones
function openOptionsPanel() {
    optionsPanel.style.display = 'flex';
    loadCurrentConfig();
}

// Función para cerrar el panel de opciones
function closeOptionsPanel() {
    optionsPanel.style.display = 'none';
}

// Función para cargar la configuración actual en el panel
function loadCurrentConfig() {
    // Modo de juego
    document.querySelector(`[data-mode="${gameConfig.gameMode}"]`).classList.add('selected');
    
    // Mostrar/ocultar configuración de contrareloj
    timetrialSettings.style.display = gameConfig.gameMode === 'timetrial' ? 'block' : 'none';
    
    // Valores de contrareloj
    maxTimeInput.value = gameConfig.timetrialConfig.maxTime;
    
    // Tema
    document.querySelector(`[data-theme="${gameConfig.theme}"]`).classList.add('selected');
    
    // Sonido
    document.querySelector(`[data-sound="${gameConfig.sound}"]`).classList.add('selected');
}

// Función para guardar la configuración
function saveConfig() {
    gameConfig = {
        gameMode: document.querySelector('.option-btn[data-mode].selected').dataset.mode,
        theme: document.querySelector('.option-btn[data-theme].selected').dataset.theme,
        sound: document.querySelector('.option-btn[data-sound].selected').dataset.sound,
        timetrialConfig: {
            maxTime: parseInt(maxTimeInput.value)
        }
    };
    
    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
    applyConfig();
    closeOptionsPanel();
}

// Función para aplicar la configuración
function applyConfig() {
    // Aplicar tema
    document.body.className = gameConfig.theme;
    
    // Aplicar configuración de sonido
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.muted = gameConfig.sound === 'off';
    });
    
    // Redirigir según el modo de juego si es necesario
    const currentPage = window.location.pathname.split('/').pop();
    const targetPage = gameConfig.gameMode === 'timetrial' ? 'timetrial.html' : 'principal.html';
    
    if (currentPage !== targetPage && currentPage !== 'index.html') {
        window.location.href = targetPage;
    }
}

// Event Listeners
document.getElementById('optionsButton').addEventListener('click', openOptionsPanel);
closeOptionsBtn.addEventListener('click', closeOptionsPanel);
saveOptionsBtn.addEventListener('click', saveConfig);

// Manejar selección de botones de opciones
optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover selección previa del mismo grupo
        const type = Object.keys(btn.dataset)[0]; // mode, theme, o sound
        document.querySelectorAll(`.option-btn[data-${type}]`).forEach(b => {
            b.classList.remove('selected');
        });
        
        // Añadir selección al botón clickeado
        btn.classList.add('selected');
        
        // Mostrar/ocultar configuración de contrareloj
        if (type === 'mode') {
            timetrialSettings.style.display = btn.dataset.mode === 'timetrial' ? 'block' : 'none';
        }
    });
});

// Validación de input numérico
maxTimeInput.addEventListener('change', () => {
    let value = parseInt(maxTimeInput.value);
    if (value < 30) maxTimeInput.value = 30;
    if (value > 300) maxTimeInput.value = 300;
});

// Aplicar configuración al cargar la página
applyConfig();
