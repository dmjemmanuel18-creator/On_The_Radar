import { products } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const filterButtons = document.querySelectorAll('.filter-button');

    if (!productGrid) {
        console.error('Product grid not found!');
        return;
    }

    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.productId = product.id;

            productCard.innerHTML = /*html*/`
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-card-content">
                    <div class="product-details">
                        <h2>${product.name}</h2>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-button">
                        <a href="#" class="add-to-cart-button" aria-label="Add to cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </a>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filteredProducts = category === 'all'
                ? products
                : products.filter(product => product.category === category);

            renderProducts(filteredProducts);
        });
    });

    renderProducts(products);
});