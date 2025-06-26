import './styles/style.css'
import { app } from './app.js'

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.querySelector('#app');
  appContainer.innerHTML = '';
  app(); // La función app ahora maneja la inserción en el DOM
});

