import '../styles/loader.css';

// Componente Loader
export function createLoader() {
    const loaderHTML = `
        <div class="loader-container">
            <div class="loader-backdrop"></div>
            <div class="loader">
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
            </div>
        </div>
    `;

    return loaderHTML;
}

export function showLoader() {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.classList.add('active');
    }
}

export function hideLoader() {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.classList.remove('active');
    }
} 