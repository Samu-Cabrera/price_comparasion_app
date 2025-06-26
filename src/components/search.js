import { searchProducts } from '../services/api.js';
import { createLoader, showLoader, hideLoader } from './loader.js';
import '../styles/loader.css';

// Componente Search
export function renderSearch(onSearch) {
  const searchSection = document.createElement('section');
  searchSection.className = 'search-section';
  searchSection.innerHTML = `
    <div class="search-container">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Buscar productos..." class="search-input">
        <button class="search-btn" id="searchBtn">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  `;

  // Crear y agregar el loader si no existe
  if (!document.querySelector('.loader-container')) {
    const loaderHTML = createLoader();
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
  }

  // Cargar última búsqueda al iniciar
  const loadLastSearch = () => {
    const lastSearchTerm = localStorage.getItem('lastSearchTerm');
    if (lastSearchTerm) {
      const input = searchSection.querySelector('#searchInput');
      input.value = lastSearchTerm;
    }
  };

  // Eventos
  const input = searchSection.querySelector('#searchInput');
  const btn = searchSection.querySelector('#searchBtn');

  const handleSearch = async () => {
    const searchTerm = input.value.trim();
    if (searchTerm) {
      try {
        showLoader();
        const result = await searchProducts(searchTerm);
        
        if (result && result.products) {
          // Guardar resultados en localStorage
          localStorage.setItem('lastSearchResults', JSON.stringify(result.products));
          localStorage.setItem('lastSearchTerm', searchTerm);
          
          onSearch(result.products);
        } else {
          throw new Error('No se recibieron productos válidos');
        }
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        onSearch([]);
        // Limpiar localStorage en caso de error
        localStorage.removeItem('lastSearchResults');
        localStorage.removeItem('lastSearchTerm');
      } finally {
        hideLoader();
      }
    }
  };

  btn.addEventListener('click', handleSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Cargar última búsqueda al montar el componente
  loadLastSearch();

  return searchSection;
}
