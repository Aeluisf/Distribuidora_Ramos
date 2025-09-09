// VERSÃO FINAL E ESTÁVEL
document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '5511999999999';
    let allProducts = [];
    let cart = [];
    let state = { currentCategory: 'Todos', currentSubcategory: 'Todos', searchTerm: '' };
    let scrollY = 0;

    const dom = {
        body: document.body,
        mainContent: document.querySelector('.main-content'),
        productGrid: document.getElementById('product-grid'),
        offersContainer: document.getElementById('offers-container'),
        categoryFilters: document.getElementById('category-filters'),
        subcategoryFilters: document.getElementById('subcategory-filters'),
        cartModalOverlay: document.getElementById('cart-modal-overlay'),
        cartModal: document.getElementById('cart-modal'),
        closeCartBtn: document.getElementById('close-cart-btn'),
        cartItemsContainer: document.getElementById('cart-items-container'),
        cartTotalPriceEl: document.getElementById('cart-total-price'),
        confirmOrderBtn: document.getElementById('confirm-order-btn'),
        searchBar: document.getElementById('search-bar'),
        closeSearchBtn: document.getElementById('close-search-btn'),
        searchInput: document.getElementById('search-input'),
        headerMenuIcon: document.getElementById('header-menu-icon'),
        headerSearchIcon: document.getElementById('header-search-icon'),
        headerCartIcon: document.getElementById('header-cart-icon'),
        headerCartBadge: document.getElementById('header-cart-badge'),
        homeButton: document.getElementById('home-button'),
        categoriesButton: document.getElementById('categories-button'),
        cartButtonBottom: document.getElementById('cart-button-bottom'),
        bottomCartBadge: document.getElementById('bottom-cart-badge'),
        navItems: document.querySelectorAll('.nav-item'),
        sideMenu: document.getElementById('side-menu'),
        sideMenuOverlay: document.getElementById('side-menu-overlay'),
        closeSideMenuBtn: document.getElementById('close-side-menu-btn'),
        menuHome: document.getElementById('menu-home'),
        menuAbout: document.getElementById('menu-about'),
        menuContact: document.getElementById('menu-contact'),
        aboutPage: document.getElementById('about-page'),
        contactPage: document.getElementById('contact-page'),
        contentPages: document.querySelectorAll('.content-page'),
        closePageBtns: document.querySelectorAll('.close-page-btn')
    };

    // --- FUNÇÕES DE CONTROLE DE TELA (COM TRAVA DE ROLAGEM DEFINITIVA) ---
    const lockScroll = () => {
        scrollY = window.scrollY;
        dom.body.classList.add('body-no-scroll');
        dom.body.style.top = `-${scrollY}px`;
    };

    const unlockScroll = () => {
        dom.body.classList.remove('body-no-scroll');
        dom.body.style.top = '';
        window.scrollTo(0, scrollY);
    };

    const showPage = (pageElement) => {
        pageElement.classList.remove('hidden');
        setTimeout(() => pageElement.classList.add('visible'), 10);
        dom.mainContent.style.display = 'none';
        lockScroll();
    };

    const hideAllPages = () => {
        dom.contentPages.forEach(p => {
            p.classList.remove('visible');
            setTimeout(() => p.classList.add('hidden'), 300);
        });
        dom.mainContent.style.display = 'block';
        unlockScroll();
    };

    const toggleCartModal = () => {
        const isActive = dom.cartModal.classList.toggle('visible');
        dom.cartModalOverlay.classList.toggle('visible', isActive);
        isActive ? lockScroll() : unlockScroll();
    };
    
    const toggleSideMenu = () => {
        const isActive = dom.sideMenu.classList.toggle('visible');
        dom.sideMenuOverlay.classList.toggle('visible', isActive);
        isActive ? lockScroll() : unlockScroll();
    };

    const toggleSearchBar = () => dom.searchBar.classList.toggle('visible');
    
    // O restante do seu arquivo JavaScript continua aqui...
    // (renderProducts, addToCart, event listeners, etc.)
    // ...
    const filterProducts = () => {
        let products = [...allProducts];
        if (state.searchTerm) {
            products = products.filter(p => p.name.toLowerCase().includes(state.searchTerm.toLowerCase()));
        } else if (state.currentCategory !== 'Todos') {
            products = products.filter(p => p.category === state.currentCategory);
            if (state.currentSubcategory !== 'Todos') {
                products = products.filter(p => p.subcategory === state.currentSubcategory);
            }
        }
        return products;
    };
    const renderProducts = (productArray) => {
        dom.productGrid.innerHTML = '';
        if (productArray.length === 0) { dom.productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>'; return; }
        const fragment = document.createDocumentFragment();
        productArray.forEach(product => {
            const priceHTML = product.promotion && product.old_price ? `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>` : `<span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
            const promoBadgeHTML = product.promotion ? `<div class="promo-badge">OFERTA</div>` : '';
            let purchaseOptionsHTML = '';
            if (product.wholesale) { purchaseOptionsHTML = `<div class="product-options"><div class="purchase-options" data-product-id="${product.id}"><button class="option-btn active" data-type="unit">Unidade</button><button class="option-btn" data-type="wholesale">Atacado</button></div></div>`; }
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-product-id', product.id);
            productCard.innerHTML = `${promoBadgeHTML}<div class="product-image-container"><img src="${product.image_url}" alt="${product.name}" class="product-image" loading="lazy"></div><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-volume">${product.volume}</p>${purchaseOptionsHTML}<div class="product-pricing"><div class="price-container">${priceHTML}</div><button class="add-to-cart-btn" data-id="${product.id}" data-type="unit">+</button></div></div>`;
            fragment.appendChild(productCard);
        });
        dom.productGrid.appendChild(fragment);
    };
    const renderOffers = (productArray) => {
        dom.offersContainer.innerHTML = '';
        const offerProducts = productArray.filter(p => p.promotion);
        const fragment = document.createDocumentFragment();
        offerProducts.forEach(product => {
            const priceHTML = `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
            const offerCard = document.createElement('div');
            offerCard.className = 'product-card offer-card';
            offerCard.innerHTML = `<div class="product-image-container"><img src="${product.image_url}" alt="${product.name}" class="product-image" loading="lazy"></div><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-volume">${product.volume}</p><div class="product-pricing"><div class="price-container">${priceHTML}</div><button class="add-to-cart-btn" data-id="${product.id}" data-type="unit">+</button></div></div>`;
            fragment.appendChild(offerCard);
        });
        dom.offersContainer.appendChild(fragment);
    };
    const renderCategoryFilters = (productArray) => {
        const categories = ['Todos', ...new Set(productArray.map(p => p.category))];
        dom.categoryFilters.innerHTML = '';
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = category;
            btn.dataset.category = category;
            if (category === 'Todos') btn.classList.add('active');
            dom.categoryFilters.appendChild(btn);
        });
    };
    const renderSubcategoryFilters = (category) => {
        if (category === 'Todos') { dom.subcategoryFilters.innerHTML = ''; dom.subcategoryFilters.classList.remove('visible'); return; }
        const subcategories = [...new Set(allProducts.filter(p => p.category === category && p.subcategory).map(p => p.subcategory))];
        if(subcategories.length > 0){
            dom.subcategoryFilters.innerHTML = '<button class="filter-btn active" data-subcategory="Todos">Todos</button>';
            subcategories.forEach(sub => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.textContent = sub;
                btn.dataset.subcategory = sub;
                dom.subcategoryFilters.appendChild(btn);
            });
            dom.subcategoryFilters.classList.add('visible');
        } else { dom.subcategoryFilters.innerHTML = ''; dom.subcategoryFilters.classList.remove('visible'); }
    };
    const updateCart = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badgeDisplay = totalItems > 0 ? 'flex' : 'none';
        dom.headerCartBadge.textContent = totalItems;
        dom.bottomCartBadge.textContent = totalItems;
        dom.headerCartBadge.style.display = badgeDisplay;
        dom.bottomCartBadge.style.display = badgeDisplay;
        if (cart.length === 0) { dom.cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>'; dom.cartTotalPriceEl.textContent = 'R$ 0,00'; return; }
        dom.cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        const fragment = document.createDocumentFragment();
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `<img src="${item.image_url}" alt="${item.name}" class="cart-item-img"><div class="cart-item-info"><p class="cart-item-name">${item.name}</p><p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p></div><div class="cart-item-controls"><button class="quantity-btn" data-cart-id="${item.cartId}" data-change="-1">-</button><span>${item.quantity}</span><button class="quantity-btn" data-cart-id="${item.cartId}" data-change="1">+</button></div>`;
            fragment.appendChild(itemEl);
        });
        dom.cartItemsContainer.appendChild(fragment);
        dom.cartTotalPriceEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    };
    const addToCart = (productId, purchaseType) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        const cartId = `${productId}-${purchaseType}`;
        const cartItem = cart.find(item => item.cartId === cartId);
        if (cartItem) { cartItem.quantity++; }
        else {
            if (purchaseType === 'wholesale') { cart.push({ cartId, id: product.id, name: `${product.name} (${product.wholesale.unit_name})`, price: product.wholesale.price, image_url: product.image_url, quantity: 1, type: 'wholesale' }); }
            else { cart.push({ cartId, id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1, type: 'unit' }); }
        }
        updateCart();
    };
    const updateCartItemQuantity = (cartId, change) => {
        const cartItem = cart.find(item => item.cartId === cartId);
        if(cartItem){
            cartItem.quantity += change;
            if(cartItem.quantity <= 0){ cart = cart.filter(item => item.cartId !== cartId); }
        }
        updateCart();
    };
    const sendOrderToWhatsApp = () => {
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
        window.open(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`, '_blank');
    };
    
    // Event Listeners...
    dom.headerSearchIcon.addEventListener('click', toggleSearchBar);
    dom.closeSearchBtn.addEventListener('click', toggleSearchBar);
    dom.headerCartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCartModal(); });
    dom.cartButtonBottom.addEventListener('click', (e) => { e.preventDefault(); toggleCartModal(); });
    dom.closeCartBtn.addEventListener('click', toggleCartModal);
    dom.cartModalOverlay.addEventListener('click', toggleCartModal);
    dom.confirmOrderBtn.addEventListener('click', sendOrderToWhatsApp);
    dom.headerMenuIcon.addEventListener('click', toggleSideMenu);
    dom.closeSideMenuBtn.addEventListener('click', toggleSideMenu);
    dom.sideMenuOverlay.addEventListener('click', toggleSideMenu);
    dom.closePageBtns.forEach(btn => btn.addEventListener('click', hideAllPages));
    dom.menuHome.addEventListener('click', (e) => { e.preventDefault(); hideAllPages(); toggleSideMenu(); });
    dom.menuAbout.addEventListener('click', (e) => { e.preventDefault(); showPage(dom.aboutPage); toggleSideMenu(); });
    dom.menuContact.addEventListener('click', (e) => { e.preventDefault(); showPage(dom.contactPage); toggleSideMenu(); });
    dom.mainContent.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.add-to-cart-btn')) {
            const btn = target.closest('.add-to-cart-btn');
            addToCart(parseInt(btn.dataset.id, 10), btn.dataset.type || 'unit');
        }
        if (target.closest('.option-btn')) {
            const button = target.closest('.option-btn');
            const container = button.parentElement;
            const card = button.closest('.product-card');
            const product = allProducts.find(p => p.id === parseInt(card.dataset.productId, 10));
            container.querySelector('.active').classList.remove('active');
            button.classList.add('active');
            updateCardUI(card, product, button.dataset.type);
        }
    });
    const updateCardUI = (card, product, type) => {
        const priceContainer = card.querySelector('.price-container');
        const volumeEl = card.querySelector('.product-volume');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (type === 'wholesale') {
            priceContainer.innerHTML = `<span class="product-price">R$ ${product.wholesale.price.toFixed(2).replace('.', ',')}</span>`;
            volumeEl.textContent = product.wholesale.unit_name;
            addToCartBtn.dataset.type = 'wholesale';
        } else {
            priceContainer.innerHTML = product.promotion && product.old_price ? `<span class="old-price">R$ ${product.old_price.toFixed(2).replace('.', ',')}</span><span class="product-price promotional">R$ ${product.price.toFixed(2).replace('.', ',')}</span>` : `<span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>`;
            volumeEl.textContent = product.volume;
            addToCartBtn.dataset.type = 'unit';
        }
    };
    dom.cartItemsContainer.addEventListener('click', (e) => {
        if(e.target.closest('.quantity-btn')){
            const btn = e.target.closest('.quantity-btn');
            updateCartItemQuantity(btn.dataset.cartId, parseInt(btn.dataset.change, 10));
        }
    });
    dom.searchInput.addEventListener('input', () => {
        state.searchTerm = dom.searchInput.value;
        document.querySelector('.filter-status').textContent = state.searchTerm ? `Buscando por: "${state.searchTerm}"` : '';
        dom.categoryFilters.style.display = state.searchTerm ? 'none' : 'flex';
        dom.subcategoryFilters.style.display = 'none';
        renderProducts(filterProducts());
    });
    dom.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            dom.navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            if(item.id === 'categories-button'){
                document.querySelector('.catalog-section').scrollIntoView({ behavior: 'smooth' });
            } else if (item.id === 'home-button') {
                document.querySelector('body').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    dom.categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            state.currentCategory = e.target.dataset.category;
            state.currentSubcategory = 'Todos';
            dom.categoryFilters.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            renderSubcategoryFilters(state.currentCategory);
            renderProducts(filterProducts());
        }
    });
    dom.subcategoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            state.currentSubcategory = e.target.dataset.subcategory;
            dom.subcategoryFilters.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            renderProducts(filterProducts());
        }
    });

    const initializeApp = async () => {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Falha ao carregar produtos');
            const data = await response.json();
            allProducts = data.products;
            
            renderProducts(filterProducts());
            renderOffers(allProducts);
            renderCategoryFilters(allProducts);
            updateCart();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            dom.productGrid.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        }
    };
    
    initializeApp();
});