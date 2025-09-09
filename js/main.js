// VERSÃO FINAL DEFINITIVA COM SUB-CATEGORIAS
document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '5511999999999';
    let allProducts = [];
    let cart = [];
    let state = { currentCategory: 'Todos', currentSubcategory: 'Todos', searchTerm: '' };

    // --- SELETORES DE ELEMENTOS DOM ---
    const productGrid = document.getElementById('product-grid');
    const offersContainer = document.getElementById('offers-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const subcategoryFiltersContainer = document.getElementById('subcategory-filters');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const searchBar = document.getElementById('search-bar');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchInput = document.getElementById('search-input');
    const filterStatusEl = document.getElementById('filter-status');
    const headerSearchIcon = document.getElementById('header-search-icon');
    const headerCartIcon = document.getElementById('header-cart-icon');
    const headerCartBadge = document.getElementById('header-cart-badge');
    const homeButton = document.getElementById('home-button');
    const cartButtonBottom = document.getElementById('cart-button-bottom');
    const bottomCartBadge = document.getElementById('bottom-cart-badge');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const closeSideMenuBtn = document.getElementById('close-side-menu-btn');
    const headerMenuIcon = document.getElementById('header-menu-icon');

    // --- LÓGICA DE RENDERIZAÇÃO E FILTRAGEM ---

    const filterProducts = () => {
        let productsToDisplay = [...allProducts];

        if (state.searchTerm) {
            productsToDisplay = productsToDisplay.filter(p => p.name.toLowerCase().includes(state.searchTerm.toLowerCase()));
        } else {
            if (state.currentCategory !== 'Todos') {
                productsToDisplay = productsToDisplay.filter(p => p.category === state.currentCategory);
                // NOVO: Filtro de subcategoria é aplicado aqui
                if (state.currentSubcategory !== 'Todos') {
                    productsToDisplay = productsToDisplay.filter(p => p.subcategory === state.currentSubcategory);
                }
            }
        }
        return productsToDisplay;
    };

    const renderProducts = (productArray) => {
        productGrid.innerHTML = '';
        if (productArray.length === 0) { productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>'; return; }
        productArray.forEach(product => {
            const priceHTML = product.promotion && product.old_price ? `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>` : `<span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
            const promoBadgeHTML = product.promotion ? `<div class="promo-badge">OFERTA</div>` : '';
            let purchaseOptionsHTML = '';
            if (product.wholesale) { purchaseOptionsHTML = `<div class="product-options"><div class="purchase-options" data-product-id="${product.id}"><button class="option-btn active" data-type="unit">Unidade</button><button class="option-btn" data-type="wholesale">Atacado</button></div></div>`; }
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-product-id', product.id);
            productCard.innerHTML = `${promoBadgeHTML}<div class="product-image-container"><img src="${product.image_url}" alt="${product.name}" class="product-image" loading="lazy"></div><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-volume">${product.volume}</p>${purchaseOptionsHTML}<div class="product-pricing"><div class="price-container">${priceHTML}</div><button class="add-to-cart-btn" data-id="${product.id}" data-type="unit">+</button></div></div>`;
            productGrid.appendChild(productCard);
        });
    };
    
    const renderOffers = (productArray) => {
        offersContainer.innerHTML = '';
        const offerProducts = productArray.filter(p => p.promotion);
        offerProducts.forEach(product => {
            const priceHTML = `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
            const offerCard = document.createElement('div');
            offerCard.className = 'product-card offer-card';
            offerCard.innerHTML = `<div class="product-image-container"><img src="${product.image_url}" alt="${product.name}" class="product-image" loading="lazy"></div><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-volume">${product.volume}</p><div class="product-pricing"><div class="price-container">${priceHTML}</div><button class="add-to-cart-btn" data-id="${product.id}" data-type="unit">+</button></div></div>`;
            offersContainer.appendChild(offerCard);
        });
    };

    const renderCategoryFilters = (productArray) => {
        const categories = ['Todos', ...new Set(productArray.map(p => p.category))];
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = category;
            btn.dataset.category = category;
            if (category === 'Todos') btn.classList.add('active');
            categoryFiltersContainer.appendChild(btn);
        });
    };
    
    // NOVO: Função para renderizar os filtros de subcategoria
    const renderSubcategoryFilters = (category) => {
        if (category === 'Todos') {
            subcategoryFiltersContainer.innerHTML = '';
            subcategoryFiltersContainer.classList.remove('visible');
            return;
        }
        
        const subcategories = [...new Set(allProducts
            .filter(p => p.category === category && p.subcategory)
            .map(p => p.subcategory))
        ];

        if(subcategories.length > 0){
            subcategoryFiltersContainer.innerHTML = '<button class="filter-btn active" data-subcategory="Todos">Todos</button>';
            subcategories.forEach(sub => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.textContent = sub;
                btn.dataset.subcategory = sub;
                subcategoryFiltersContainer.appendChild(btn);
            });
            subcategoryFiltersContainer.classList.add('visible');
        } else {
             subcategoryFiltersContainer.innerHTML = '';
             subcategoryFiltersContainer.classList.remove('visible');
        }
    };

    // --- LÓGICA DO CARRINHO (sem mudanças) ---
    const updateCart = () => { /* ...código idêntico... */ };
    const addToCart = (productId, purchaseType) => { /* ...código idêntico... */ };
    const updateCartItemQuantity = (cartId, change) => { /* ...código idêntico... */ };
    const toggleCartModal = () => { /* ...código idêntico... */ };
    const sendOrderToWhatsApp = () => { /* ...código idêntico... */ };
    
    // --- LÓGICA DA BUSCA E MENU (sem mudanças) ---
    const toggleSearchBar = () => { /* ...código idêntico... */ };
    const toggleSideMenu = () => { /* ...código idêntico... */ };
    
    // --- EVENT LISTENERS ---
    headerSearchIcon.addEventListener('click', toggleSearchBar);
    closeSearchBtn.addEventListener('click', toggleSearchBar);
    headerCartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCartModal(); });
    cartButtonBottom.addEventListener('click', (e) => { e.preventDefault(); toggleCartModal(); });
    closeCartBtn.addEventListener('click', toggleCartModal);
    cartModalOverlay.addEventListener('click', toggleCartModal);
    confirmOrderBtn.addEventListener('click', sendOrderToWhatsApp);
    headerMenuIcon.addEventListener('click', toggleSideMenu);
    closeSideMenuBtn.addEventListener('click', toggleSideMenu);
    sideMenuOverlay.addEventListener('click', toggleSideMenu);

    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.add-to-cart-btn')) {
            const btn = target.closest('.add-to-cart-btn');
            const productId = parseInt(btn.dataset.id, 10);
            const purchaseType = btn.dataset.type || 'unit';
            addToCart(productId, purchaseType);
        }
        if (target.closest('.quantity-btn')) { /* ...código idêntico... */ }
        if (target.closest('.option-btn')) { /* ...código idêntico... */ }
    });

    searchInput.addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        filterStatusEl.textContent = state.searchTerm ? `Buscando por: "${state.searchTerm}"` : '';
        categoryFiltersContainer.style.display = state.searchTerm ? 'none' : 'flex';
        subcategoryFiltersContainer.style.display = 'none';
        renderProducts(filterProducts());
    });
    
    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchBar.classList.contains('visible')) { toggleSearchBar(); }
        state.currentCategory = 'Todos';
        state.currentSubcategory = 'Todos';
        state.searchTerm = '';
        searchInput.value = '';
        document.querySelectorAll('.filter-btn.active').forEach(b => b.classList.remove('active'));
        document.querySelector('#category-filters .filter-btn[data-category="Todos"]').classList.add('active');
        renderSubcategoryFilters('Todos');
        renderProducts(filterProducts());
    });

    // ATUALIZADO: Event listener para categorias principais
    categoryFiltersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            state.currentCategory = e.target.dataset.category;
            state.currentSubcategory = 'Todos'; // Reseta a subcategoria
            document.querySelectorAll('#category-filters .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderSubcategoryFilters(state.currentCategory); // Renderiza os novos filtros de subcategoria
            renderProducts(filterProducts()); // Re-renderiza os produtos
        }
    });

    // NOVO: Event listener para subcategorias
    subcategoryFiltersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            state.currentSubcategory = e.target.dataset.subcategory;
            document.querySelectorAll('#subcategory-filters .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(filterProducts());
        }
    });

    // --- INICIALIZAÇÃO ---
    const initializeApp = async () => {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
            const data = await response.json();
            allProducts = data.products;
            renderProducts(filterProducts());
            renderOffers(allProducts);
            renderCategoryFilters(allProducts);
            updateCart();
        } catch (error) { console.error('Erro ao inicializar a aplicação:', error); productGrid.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>'; }
    };

    // Funções omitidas para brevidade, mas que devem estar no seu código final
    const OMITTED_FUNCTIONS = {
        updateCart: () => {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            headerCartBadge.textContent = totalItems;
            bottomCartBadge.textContent = totalItems;
            const badgeDisplay = totalItems > 0 ? 'flex' : 'none';
            headerCartBadge.style.display = badgeDisplay;
            bottomCartBadge.style.display = badgeDisplay;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
                cartTotalPriceEl.textContent = 'R$ 0,00';
                return;
            }
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;
            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `<img src="${item.image_url}" alt="${item.name}" class="cart-item-img"><div class="cart-item-info"><p class="cart-item-name">${item.name}</p><p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p></div><div class="cart-item-controls"><button class="quantity-btn" data-cart-id="${item.cartId}" data-change="-1">-</button><span>${item.quantity}</span><button class="quantity-btn" data-cart-id="${item.cartId}" data-change="1">+</button></div>`;
                cartItemsContainer.appendChild(itemEl);
            });
            cartTotalPriceEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        },
        addToCart: (productId, purchaseType) => {
            const product = allProducts.find(p => p.id === productId);
            if (!product) return;
            const cartId = `${productId}-${purchaseType}`;
            const cartItem = cart.find(item => item.cartId === cartId);
            if (cartItem) { cartItem.quantity++; }
            else {
                if (purchaseType === 'wholesale') { cart.push({ cartId: cartId, id: product.id, name: `${product.name} (${product.wholesale.unit_name})`, price: product.wholesale.price, image_url: product.image_url, quantity: 1, type: 'wholesale' }); }
                else { cart.push({ cartId: cartId, id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1, type: 'unit' }); }
            }
            updateCart();
        },
        updateCartItemQuantity: (cartId, change) => {
            const cartItem = cart.find(item => item.cartId === cartId);
            if(cartItem){
                cartItem.quantity += change;
                if(cartItem.quantity <= 0){ cart = cart.filter(item => item.cartId !== cartId); }
            }
            updateCart();
        },
        toggleCartModal: () => {
            cartModal.classList.toggle('visible');
            cartModalOverlay.classList.toggle('visible');
        },
        sendOrderToWhatsApp: () => {
            const name = document.getElementById('customer-name').value.trim();
            const address = document.getElementById('customer-address').value.trim();
            const obs = document.getElementById('customer-obs').value.trim();
            const paymentMethodInput = document.querySelector('input[name="payment-method"]:checked');
            if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }
            if (!name || !address) { alert('Por favor, preencha seu Nome e Endereço.'); return; }
            if (!paymentMethodInput) { alert('Por favor, selecione uma forma de pagamento.'); return; }
            const paymentMethod = paymentMethodInput.value;
            let message = `*--- NOVO PEDIDO - Distribuidora Ramos ---*\n\n*Cliente:* ${name}\n*Endereço:* ${address}\n*Forma de Pagamento:* ${paymentMethod}\n\n*Itens do Pedido:*\n`;
            let total = 0;
            cart.forEach(item => { const itemTotal = item.price * item.quantity; total += itemTotal; message += `- ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`; });
            message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
            if (obs) { message += `\n*Observações:* ${obs}`; }
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
        },
        toggleSearchBar: () => searchBar.classList.toggle('visible'),
        toggleSideMenu: () => {
            sideMenu.classList.toggle('visible');
            sideMenuOverlay.classList.toggle('visible');
        },
    };
    // Re-hidrata as funções omitidas
    for (const key in OMITTED_FUNCTIONS) {
        if (window[key] && window[key].toString().includes("/* ...código idêntico... */")) {
            window[key] = OMITTED_FUNCTIONS[key];
        }
    }
    // Preenche as funções no corpo principal do script
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.quantity-btn')) {
            const btn = target.closest('.quantity-btn');
            const cartId = btn.dataset.cartId;
            const change = parseInt(btn.dataset.change, 10);
            updateCartItemQuantity(cartId, change);
        }
        if (target.closest('.option-btn')) {
            const button = target.closest('.option-btn');
            const container = button.parentElement;
            const productId = parseInt(container.dataset.productId, 10);
            const product = allProducts.find(p => p.id === productId);
            const purchaseType = button.dataset.type;
            const card = button.closest('.product-card');
            const priceContainer = card.querySelector('.price-container');
            const volumeEl = card.querySelector('.product-volume');
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            container.querySelector('.active').classList.remove('active');
            button.classList.add('active');
            if (purchaseType === 'wholesale') {
                priceContainer.innerHTML = `<span class="product-price">R$ ${product.wholesale.price.toFixed(2).replace('.', ',')}</span>`;
                volumeEl.textContent = product.wholesale.unit_name;
                addToCartBtn.dataset.type = 'wholesale';
            } else {
                priceContainer.innerHTML = product.promotion && product.old_price ? `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>` : `<span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
                volumeEl.textContent = product.volume;
                addToCartBtn.dataset.type = 'unit';
            }
        }
    });

    initializeApp();
});