// Componente Header
export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="logo">
      <h1>Comparador de Precios</h1>
    </div>
    <p class="subtitle">Encuentra los mejores precios en todas las tiendas</p>
  `;
  return header;
} 