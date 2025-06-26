import { createModal } from './modal.js';
import '../styles/table.css';

// Componente Table
export function renderTable(products = null) {
  const resultsSection = document.createElement('section');
  resultsSection.className = 'results-section';

  // Modal reutilizable
  const modal = createModal();

  /* ───── CONFIG DE PAGINACIÓN ───── */
  const ITEMS_PER_PAGE = 10;
  let   currentPage    = 1;
  /* ──────────────────────────────── */

  const getProxiedImageUrl = (url) => {
    if (url.includes('nissei.com')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Función para truncar el nombre del producto
  const truncateProductName = (name) => {
    const maxLength = 40;
    if (name.length <= maxLength) return name;
    
    // Buscar el último espacio antes del límite para cortar en una palabra completa
    const truncated = name.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 ? name.substr(0, lastSpace) + '...' : truncated + '...';
  };

  /* 1. Estado inicial (sin búsqueda) */
  if (products === null) {
    resultsSection.innerHTML = `
      <div class="initial-message">
        <i class="fas fa-search"></i>
        <p>No hay productos que mostrar.</p>
        <span class="sub-message">Utiliza la barra de búsqueda para encontrar productos.</span>
      </div>
    `;
    return resultsSection;
  }

  /* 2. Sin resultados */
  if (products.length === 0) {
    resultsSection.innerHTML = `
      <div class="no-results">
        <i class="fas fa-exclamation-circle"></i>
        <p>No se encontraron productos</p>
        <span class="sub-message">Intenta con otros términos de búsqueda.</span>
      </div>
    `;
    return resultsSection;
  }

  /* 3. Contenedor de la tabla + paginación  (tbody vacío) */
  resultsSection.innerHTML = `
    <div class="table-container">
      <table class="results-table">
        <thead>
          <tr>
            <th>Tienda</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

    <section class="pagination-section" style="display:none;">
      <div class="pagination-container" id="paginationContainer"></div>
    </section>
  `;

  /* --- referencias DOM --- */
  const tbody              = resultsSection.querySelector('tbody');
  const paginationSection  = resultsSection.querySelector('.pagination-section');
  const paginationContainer= resultsSection.querySelector('#paginationContainer');

  /* Genera una fila HTML para un producto */
  const rowTemplate = (product) => `
    <tr>
      <td class="store-cell">
        <img 
          src="${getProxiedImageUrl(product.logoStore)}" 
          alt="Logo de la tienda"
          class="store-logo"
          onerror="this.onerror=null; this.src='https://via.placeholder.com/100x40?text=Logo';"
        />
      </td>
      <td class="product-cell">
        <div class="product-info">
          <img 
            src="${getProxiedImageUrl(product.image)}" 
            alt="${product.name}" 
            class="product-image"
            onerror="this.onerror=null; this.src='https://via.placeholder.com/60x60?text=Producto';"
          />
          <span title="${product.name}">${truncateProductName(product.name)}</span>
        </div>
      </td>
      <td class="price-cell">
        Gs. ${product.price.toLocaleString('es-PY')}
      </td>
      <td class="actions-cell">
        <a href="#" class="btn-visit" data-url="${product.link}">
          Ver más...
        </a>
      </td>
    </tr>
  `;

  /* ---------- RENDER DE PÁGINA ---------- */
  function renderPage(page) {
    currentPage = page;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = products.slice(start, start + ITEMS_PER_PAGE);

    /* 1. Pintar filas */
    tbody.innerHTML = pageItems.map(rowTemplate).join('');

    /* 2. Re-vincular eventos del modal */
    tbody.querySelectorAll('.btn-visit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.showProductDetails(btn.dataset.url);
      });
    });

    /* 3. Pintar / actualizar botones */
    renderPagination();
  }

  /* ---------- BOTONES DE PAGINACIÓN ---------- */
  function createBtn(text, disabled, handler) {
    const b = document.createElement('button');
    b.textContent = text;
    b.className   = 'pagination-btn';
    b.disabled    = disabled;
    b.addEventListener('click', handler);
    return b;
  }

  function renderPagination() {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    /* Ocultar sección si no se necesita */
    if (totalPages <= 1) {
      paginationSection.style.display = 'none';
      return;
    }
    paginationSection.style.display = 'block';
    paginationContainer.innerHTML   = '';

    /* « Prev */
    paginationContainer.appendChild(
      createBtn('«', currentPage === 1, () => renderPage(currentPage - 1))
    );

    /* Números */
    for (let i = 1; i <= totalPages; i++) {
      const btn = createBtn(i, false, () => renderPage(i));
      if (i === currentPage) btn.classList.add('active');
      paginationContainer.appendChild(btn);
    }

    /* Next » */
    paginationContainer.appendChild(
      createBtn('»', currentPage === totalPages, () => renderPage(currentPage + 1))
    );
  }

  /* Render inicial (página 1) */
  renderPage(1);

  return resultsSection;
}
