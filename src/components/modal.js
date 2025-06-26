import { getProductDetails } from '../services/api.js';
import { showLoader, hideLoader } from './loader.js';
import '../styles/modal.css';

/* Proxy + forzado a https */
const normalizeImageUrl = (url) => {
  // 1- Asegurarnos de que use https
  const httpsUrl = url.replace(/^http:/, 'https:');

  // 2- Si es de Nissei pasamos por el proxy
  const nisseiRegex = /(?:^|\/\/).*?nissei\.com(\.py)?/i;
  return nisseiRegex.test(httpsUrl)
    ? `https://images.weserv.nl/?url=${encodeURIComponent(httpsUrl)}`
    : httpsUrl;
};

// Componente Modal
export function createModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <span class="store-name-header"></span>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="modal-content">
                        <div class="product-image-container">
                            <div class="single-image"></div>
                            <div class="carousel" style="display: none;">
                                <div class="carousel-container"></div>
                                <button class="carousel-button prev">❮</button>
                                <button class="carousel-button next">❯</button>
                                <div class="carousel-dots"></div>
                            </div>
                        </div>
                        <h3 class="product-title"></h3>
                        <div class="product-price modal-value"></div>
                        <div class="product-description-container">
                            <p class="product-description modal-value"></p>
                        </div>
                        <div class="product-features"></div>
                        <div class="modal-info">
                            <div class="info-row rating-row">
                                <span class="modal-label">Valoración:</span>
                                <div class="product-rating modal-value"></div>
                            </div>
                            <div class="info-row">
                                <span class="modal-label">Disponibilidad:</span>
                                <span class="product-availability modal-value"></span>
                            </div>
                            <div class="info-row">
                                <span class="modal-label">Tienda:</span>
                                <span class="store-name modal-value"></span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a class="btn-primary product-link" target="_blank">
                                Visitar tienda
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Crear y agregar el modal si no existe
    if (!document.querySelector('.modal-overlay')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const carousel = modal.querySelector('.carousel');
    const singleImage = modal.querySelector('.single-image');
    const carouselContainer = modal.querySelector('.carousel-container');
    const prevBtn = modal.querySelector('.carousel-button.prev');
    const nextBtn = modal.querySelector('.carousel-button.next');
    const dotsContainer = modal.querySelector('.carousel-dots');

    let currentSlide = 0;
    let images = [];

    function updateCarousel() {
        carouselContainer.innerHTML = images.map((img, index) => `
            <div class="carousel-slide ${index === currentSlide ? 'active' : ''}">
                <img src="${img}" alt="Imagen del producto ${index + 1}">
            </div>
        `).join('');

        dotsContainer.innerHTML = images.map((_, index) => `
            <button class="carousel-dot ${index === currentSlide ? 'active' : ''}" 
                    data-index="${index}"></button>
        `).join('');

        // Actualizar eventos de los dots
        dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.index);
                updateCarousel();
            });
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateCarousel();
    }

    // Eventos del carrusel
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Función para crear estrellas de valoración
    function createRatingStars(rating) {
        const maxStars = 5;
        let starsHTML = '';
        
        for (let i = 1; i <= maxStars; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        return starsHTML;
    }

    // Función para mostrar el modal con los detalles del producto
    async function showProductDetails(url) {
        try {
            showLoader();
            const details = await getProductDetails(url);
            
            // Actualizar título y precio
            modal.querySelector('.product-title').textContent = details.name;
            modal.querySelector('.product-price').textContent = 
                `Gs. ${details.price.toLocaleString('es-PY')}`;

            // Manejar imágenes
            const processedImages = (details.images || []).map(normalizeImageUrl);

            if (processedImages.length > 1) {
                carousel.style.display = 'block';
                singleImage.style.display = 'none';

                images = processedImages;
                currentSlide = 0;
                updateCarousel();
            } else if (processedImages.length === 1) {
                carousel.style.display = 'none';
                singleImage.style.display = 'block';
                singleImage.innerHTML = `
                    <img src="${processedImages[0]}" alt="${details.name}">
                `;
            } else {
                // Si no hay imágenes, puedes mostrar un placeholder si lo deseas
            }

            // Actualizar descripción
            modal.querySelector('.product-description').textContent = details.description;

            // Actualizar características
            const featuresContainer = modal.querySelector('.product-features');
            if (details.features && details.features.length > 0) {
                featuresContainer.innerHTML = `
                    <div class="info-row">
                        <span class="modal-label">Características</span>
                    </div>
                    <ul class="features-list">
                        ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                `;
            } else {
                featuresContainer.innerHTML = '';
            }

            // Actualizar valoración
            const ratingElement = modal.querySelector('.product-rating');
            if (details.rating) {
                ratingElement.innerHTML = createRatingStars(details.rating);
                ratingElement.parentElement.style.display = 'flex';
            } else {
                ratingElement.parentElement.style.display = 'none';
            }

            // Actualizar disponibilidad y tienda
            modal.querySelector('.product-availability').textContent = details.availability;
            modal.querySelector('.store-name').textContent = details.store;
            modal.querySelector('.store-name-header').textContent = details.store;
            modal.querySelector('.product-link').href = details.link;

            // Mostrar modal
            hideLoader();
            modal.classList.add('active');
        } catch (error) {
            console.error('Error al cargar los detalles:', error);
            hideLoader();
        }
    }

    // Eventos para cerrar el modal
    function closeModal() {
        modal.classList.remove('active');
        // Limpiar el carrusel
        images = [];
        currentSlide = 0;
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    return {
        showProductDetails
    };
}
