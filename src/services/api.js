// Base URL para el backend.
// 1) En producción se establece mediante la variable de entorno VITE_API_BASE_URL (inyectada por Vite).
// 2) En desarrollo se hace fallback a la API local.
const API_BASE_URL = (
  import.meta.env && import.meta.env.VITE_API_BASE_URL
) || 'https://pricecomparasionserver-production.up.railway.app/api';

// --- Función para buscar productos ---
export async function searchProducts(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
}

// --- Función para obtener detalles del producto ---
export async function getProductDetails(url) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/details/?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    throw error;
  }
} 