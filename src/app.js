import { renderHeader } from './components/header.js';
import { renderSearch } from './components/search.js';
import { renderTable } from './components/table.js';
import './styles/style.css';
import './styles/search.css';
import './styles/table.css';

// Función para obtener los productos del localStorage
function getStoredProducts() {
  const storedProducts = localStorage.getItem('lastSearchResults');
  return storedProducts ? JSON.parse(storedProducts) : null;
}

export function app() {
  const appContainer = document.querySelector('#app');
  appContainer.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  const header = renderHeader();
  container.appendChild(header);

  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';

  // Función para actualizar la tabla
  function updateTableWithProducts(products) {
    const resultsContainer = mainContent.querySelector('.results-container');
    if (resultsContainer) {
      const table = renderTable(products);
      resultsContainer.innerHTML = '';
      resultsContainer.appendChild(table);
    }
  }

  // Renderizar barra de búsqueda
  const search = renderSearch(updateTableWithProducts);
  mainContent.appendChild(search);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';

  const storedProducts = getStoredProducts();
  const initialTable = renderTable(storedProducts);
  resultsContainer.appendChild(initialTable);

  mainContent.appendChild(resultsContainer);

  container.appendChild(mainContent);

  appContainer.appendChild(container);
}

// Iniciar la aplicación      
app();
