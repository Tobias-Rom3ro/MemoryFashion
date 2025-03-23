# Memory Fashion

¡Un juego de memoria con estilo! Encuentra todas las parejas de íconos relacionados con la moda mientras pones a prueba tu memoria.

![Memory Fashion Game](screenshots/memory-game.png)

## 🎮 Descripción

Memory Fashion es un juego de memoria interactivo donde tendrás que encontrar pares de cartas coincidentes relacionadas con el mundo de la moda. El juego cuenta con diferentes niveles de dificultad, sistema de puntuación por estrellas, cronómetro y contador de movimientos.

## ✨ Características

- **Tres niveles de dificultad**: 
  - Fácil: 3x2 cartas (3 parejas)
  - Medio: 4x4 cartas (8 parejas)
  - Difícil: 5x4 cartas (10 parejas)
- **Íconos de moda**: Variedad de íconos como camisetas, zapatos, sombreros, gafas, joyas y más
- **Sistema de puntuación**: Obtén hasta 3 estrellas dependiendo de tu rendimiento
- **Cronómetro**: Mide el tiempo que tardas en completar el juego
- **Contador de movimientos**: Lleva el registro de cuántos intentos realizas
- **Animaciones**: Efectos visuales atractivos cuando encuentras parejas
- **Diseño responsivo**: Adaptado para dispositivos móviles y de escritorio

## 💻 Tecnologías utilizadas

- HTML5
- CSS3 (con animaciones y diseño responsivo)
- JavaScript (ES6+)
- Font Awesome (íconos)
- Google Fonts
- SweetAlert2 (para notificaciones)

## 🚀 Cómo usar

1. Clona este repositorio o descárgalo como ZIP
2. Abre el archivo `index.html` en tu navegador
3. Selecciona un nivel de dificultad (por defecto es Medio)
4. Haz clic en las cartas para voltearlas y encontrar las parejas
5. Intenta encontrar todas las parejas en el menor tiempo y con la menor cantidad de movimientos posible

## 🎯 Cómo jugar

- Haz clic en una carta para voltearla
- Luego, haz clic en otra carta para intentar encontrar su pareja
- Si las dos cartas coinciden, permanecerán volteadas
- Si no coinciden, se voltearán de nuevo después de un breve momento
- El juego termina cuando encuentras todas las parejas
- Tu puntuación se basa en la cantidad de movimientos realizados:
  - 3 estrellas: Rendimiento excelente
  - 2 estrellas: Buen rendimiento
  - 1 estrella: Rendimiento regular

## 🔧 Personalización

Puedes personalizar fácilmente este juego modificando:
- Los íconos en el array `iconosModa` en `script.js`
- Los colores en `style.css`
- La configuración de dificultad en `configuracionDificultad` en `script.js`

## 🔜 Posibles mejoras futuras

- Añadir efectos de sonido
- Implementar un sistema de puntuación global
- Crear más temas aparte de moda
- Añadir un modo contrarreloj
