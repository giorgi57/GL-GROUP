let isAdmin = false;
let posts = [];
let editingPostId = null;
let currentFilter = 'all';
let selectedImages = [];
let currentSearchTerm = ''; 

// ვალუტის მდგომარეობა
let currentCurrency = 'GEL'; 
const exchangeRate = 2.65; // 1 USD = 2.65 GEL

// პაროლი
const adminPassword = 'kobaxidze7413';

const categoryNames = {
    all: '🌟 ყველა განცხადება',
    cars: '🚗 ავტომობილები',
    houses: '🏡 სახლები',
    land: '🌾 მიწის ნაკვეთები',
    office: '🏢 საოფისე'
};

// Detail modal state
let currentDetailPost = null;
let currentDetailImageIndex = 0;

// Gallery state
let currentGalleryImages = [];
let currentGalleryIndex = 0;

// ენის თარგმანების ობიექტი
const translations = {
    ka: {
        all: 'ყველა',
        cars: '🚗 ავტომობილები',
        houses: '🏡 სახლები',
        land: '🌾 მიწის ნაკვეთები',
        office: '🏢 საოფისე',
        admin: 'ადმინი',
        logout: 'გასვლა',
        heroTitle: 'იპოვე შენი სამომავლო ქონება',
        heroSubtitle: 'ავტომობილები, სახლები, მიწის ნაკვეთები და საოფისე ფართები',
        authorization: 'ავტორიზაცია',
        password: 'პაროლი:',
        login: 'შესვლა',
        cancel: 'გაუქმება',
        addNewAd: 'ახალი განცხადების დამატება',
        category: 'კატეგორია:',
        title: 'სათაური:',
        price: 'ფასი', 
        description: 'დეტალური აღწერა:',
        photos: 'ფოტოები',
        maxPhotos: 'მაქსიმუმ 10 ფოტო',
        save: 'შენახვა',
        adminPanel: 'ადმინისტრატორის პანელი',
        newAd: 'ახალი განცხადება',
        allAds: '🌟 ყველა განცხადება',
        rooms: 'ოთახები', bedrooms: 'საძინებლები', area: 'ფართი', floor: 'სართული', bathrooms: 'სველი წერტილი', type: 'ტიპი', parking: 'პარკინგი', balcony: 'აივანი', address: 'მისამართი',
        brand: 'მარკა', model: 'მოდელი', year: 'წელი', mileage: 'გარბენი', engine: 'ძრავა', color: 'ფერი', transmission: 'ტრანსმისია', drive: 'წამყვანი',
        hectare: 'ჰექტარი', purpose: 'დანიშნულება', water: 'წყალი', electricity: 'ელექტროობა', road: 'გზა', landscape: 'ლანდშაფტი', location: 'ადგილმდებარეობა',
        ac: 'კონდიციონერი', internet: 'ინტერნეტი', security: 'უსაფრთხოება',
        search: '🔍 ძიება',
        searchPlaceholder: 'მოძებნეთ სათაურით ან აღწერით...',
        noAdsFound: 'განცხადებები არ მოიძებნა',
        noAdsInfo: 'ამ კატეგორიაში ჯერ არ არის დამატებული განცხადებები',
        contact: 'კონტაქტი',
        address: 'მისამართი:',
        phone: 'ტელეფონი:',
        email: 'ელ.ფოსტა:',
        social: 'სოციალური მედია',
        footerMission: 'უძრავი ქონების და ავტომობილების საუკეთესო განცხადებები ერთ სივრცეში.',
    },
    en: {
        all: 'All',
        cars: '🚗 Cars',
        houses: '🏡 Houses',
        land: '🌾 Land',
        office: '🏢 Office',
        admin: 'Admin',
        logout: 'Logout',
        heroTitle: 'Find Your Future Property',
        heroSubtitle: 'Cars, Houses, Land Plots, and Office Spaces',
        authorization: 'Authorization',
        password: 'Password:',
        login: 'Login',
        cancel: 'Cancel',
        addNewAd: 'Add New Post',
        category: 'Category:',
        title: 'Title:',
        price: 'Price',
        description: 'Detailed Description:',
        photos: 'Photos',
        maxPhotos: 'Maximum 10 photos',
        save: 'Save',
        adminPanel: 'Admin Panel',
        newAd: 'New Post',
        allAds: '🌟 All Ads',
        rooms: 'Rooms', bedrooms: 'Bedrooms', area: 'Area', floor: 'Floor', bathrooms: 'Bathrooms', type: 'Type', parking: 'Parking', balcony: 'Balcony', address: 'Address',
        brand: 'Brand', model: 'Model', year: 'Year', mileage: 'Mileage', engine: 'Engine', color: 'Color', transmission: 'Transmission', drive: 'Drive',
        hectare: 'Hectare', purpose: 'Purpose', water: 'Water', electricity: 'Electricity', road: 'Road', landscape: 'Landscape', location: 'Location',
        ac: 'AC', internet: 'Internet', security: 'Security',
        search: '🔍 Search',
        searchPlaceholder: 'Search by title or description...',
        noAdsFound: 'No Ads Found',
        noAdsInfo: 'There are currently no listings in this category',
        contact: 'Contact',
        address: 'Address:',
        phone: 'Phone:',
        email: 'Email:',
        social: 'Social Media',
        footerMission: 'The best property and auto listings in one place.',
    },
    ru: {
        all: 'Все',
        cars: '🚗 Авто',
        houses: '🏡 Дома',
        land: '🌾 Земля',
        office: '🏢 Офисы',
        admin: 'Админ',
        logout: 'Выход',
        heroTitle: 'Найди свою будущую недвижимость',
        heroSubtitle: 'Автомобили, дома, земля и офисы',
        authorization: 'Авторизация',
        password: 'Пароль:',
        login: 'Войти',
        cancel: 'Отмена',
        addNewAd: 'Добавить',
        category: 'Категория:',
        title: 'Заголовок:',
        price: 'Цена',
        description: 'Подробное описание:',
        photos: 'Фото',
        maxPhotos: 'Макс 10 фото',
        save: 'Сохранить',
        adminPanel: 'Админ',
        newAd: 'Новое',
        allAds: '🌟 Все объявления',
        rooms: 'Комнаты', bedrooms: 'Спальни', area: 'Площадь', floor: 'Этаж', bathrooms: 'Санузел', type: 'Тип', parking: 'Парковка', balcony: 'Балкон', address: 'Адрес',
        brand: 'Марка', model: 'Модель', year: 'Год', mileage: 'Пробег', engine: 'Двигатель', color: 'Цвет', transmission: 'Трансмиссия', drive: 'Привод',
        hectare: 'Гектар', purpose: 'Назначение', water: 'Вода', electricity: 'Электричество', road: 'Дорога', landscape: 'Ландшафт', location: 'Локация',
        ac: 'Кондиционер', internet: 'Интернет', security: 'Охрана',
        search: '🔍 Поиск',
        searchPlaceholder: 'Поиск по заголовку или описанию...',
        noAdsFound: 'Объявления не найдены',
        noAdsInfo: 'В этой категории пока нет объявлений',
        contact: 'Контакты',
        address: 'Адрес:',
        phone: 'Телефон:',
        email: 'Эл. почта:',
        social: 'Соцсети',
        footerMission: 'Лучшие объявления недвижимости и авто в одном месте.',
    }
};

let currentLang = 'ka';


// ========== ვალუტის გადამრთველი ==========
function toggleCurrency() {
    currentCurrency = currentCurrency === 'GEL' ? 'USD' : 'GEL';
    const symbol = currentCurrency === 'GEL' ? '₾' : '$';
    document.querySelector('.currency-symbol').textContent = symbol;
    localStorage.setItem('currency', currentCurrency);
    displayPosts();
    if (currentDetailPost) {
        updateDetailModalPrice();
    }
    // updateModalPriceLabel() აღარ არის საჭირო, რადგან Select-ი თავად აჩვენებს ვალუტას
}

function convertPrice(priceGEL) {
    if (!priceGEL) return 0;
    const priceNum = parseFloat(priceGEL);
    // priceGEL ყოველთვის ინახება ლარში (GEL)
    if (currentCurrency === 'USD') {
        return (priceNum / exchangeRate).toFixed(0);
    }
    return priceNum;
}

function formatPriceWithCurrency(priceGEL) {
    if (!priceGEL) return '';
    const converted = convertPrice(priceGEL);
    // Add comma separator for thousands
    const formatted = converted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const symbol = currentCurrency === 'GEL' ? '₾' : '$';
    return `${formatted} ${symbol}`;
}

// ========== ფორმის ველების განახლება კატეგორიის მიხედვით ==========
function updateFormFields() {
    const category = document.getElementById('postCategory').value;
    
    // დავმალოთ ყველა კატეგორიის ველი
    document.querySelectorAll('.category-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // გამოვაჩინოთ მხოლოდ არჩეული კატეგორიის ველები
    const targetField = document.getElementById(`${category}Fields`);
    if (targetField) {
        targetField.style.display = 'block';
    }
}

// ========== INITIALIZATION & LOADERS ==========
function loadPosts() {
    const saved = localStorage.getItem('posts');
    if (saved) {
        posts = JSON.parse(saved);
    }
    updateFilterInfo();
    displayPosts();
}

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('#themeToggle .theme-icon');
    if (icon) {
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('#themeToggle .theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// ========== LANGUAGE ==========
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.classList.toggle('active');
}

function changeLanguage(lang) {
    currentLang = lang;
    const langCode = lang === 'ka' ? 'ქარ' : lang.toUpperCase();
    document.getElementById('currentLang').innerHTML = `
        ${lang === 'ka' ? '🇬🇪' : lang === 'en' ? '🇬🇧' : lang === 'ru' ? '🇷🇺' : ''} ${langCode}
    `;
    
    // თარგმანების განახლება
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // ნავიგაციის ბმულების ტექსტის განახლება
    document.querySelectorAll('.nav-link').forEach(link => {
        const categoryKey = link.getAttribute('data-category');
        const text = translations[lang][categoryKey] || categoryNames[categoryKey] || link.textContent;
        link.textContent = text;
    });

    // ფორმის სათაურის განახლება
    if (!editingPostId) {
        document.getElementById('postFormTitle').textContent = translations[currentLang].addNewAd || 'ახალი განცხადების დამატება';
    }
    
    // ძიების placeholder-ის განახლება
    document.getElementById('searchInput').placeholder = translations[currentLang].searchPlaceholder || 'მოძებნეთ სათაურით ან აღწერით...';


    localStorage.setItem('lang', lang);
    updateFilterInfo(); 
    
    const menu = document.getElementById('languageMenu');
    menu.classList.remove('active');
}

// ========== PAGE LOAD & ADMIN CHECK ==========
window.onload = () => {
    loadTheme();
    
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
        const symbol = currentCurrency === 'GEL' ? '₾' : '$';
        document.querySelector('.currency-symbol').textContent = symbol;
    }
    
    const savedLang = localStorage.getItem('lang') || 'ka';
    if (savedLang) {
        changeLanguage(savedLang); 
    }
    
    loadPosts();
    updateFormFields(); 

    // შემოწმება, არის თუ არა ადმინ-რეჟიმი ჩართული (session storage)
    if (sessionStorage.getItem('isAdmin') === 'true') {
        isAdmin = true;
        document.getElementById('adminPanel').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        displayPosts(); 
    }
};

// ========== MOBILE MENU TOGGLE ==========
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// ========== CLICK OUTSIDE HANDLERS ==========
document.addEventListener('click', (event) => {
    const menu = document.getElementById('languageMenu');
    const btn = document.querySelector('.lang-btn');
    
    if (menu.classList.contains('active') && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove('active');
    }
    
    const navMenu = document.getElementById('navMenu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');

    if (navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileBtn.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// ========== SEARCH FUNCTIONALITY ==========
function liveSearch() {
    const input = document.getElementById('searchInput');
    currentSearchTerm = input.value.toLowerCase().trim();
    
    // ძიების შემდეგ აუცილებლად განვაახლოთ პოსტები
    displayPosts();
}

// ========== FILTERING ==========
function filterCategory(category) {
    currentFilter = category;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === category) {
            link.classList.add('active');
        }
    });

    updateFilterInfo();
    displayPosts();
}

function updateFilterInfo() {
    const filterInfo = document.getElementById('filterInfo');
    const filteredPosts = currentFilter === 'all' 
        ? posts 
        : posts.filter(p => p.category === currentFilter);
    
    // ვიღებთ კატეგორიის სახელს მიმდინარე ენაზე
    const categoryText = translations[currentLang][currentFilter] || categoryNames[currentFilter];
    
    filterInfo.querySelector('h2').textContent = categoryText; 
    document.getElementById('filterCount').textContent = `${filteredPosts.length}`; 
}

// ========== DISPLAY POSTS (CARD VIEW) ==========
function displayPosts() {
    const container = document.getElementById('postsContainer');
    
    let filteredPosts = currentFilter === 'all' 
        ? posts 
        : posts.filter(p => p.category === currentFilter);
        
    // 1. ფილტრაცია ძიების ტერმინით (თუ არსებობს)
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(currentSearchTerm) ||
            post.text.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    // 2. ცარიელი სტატუსი
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>${translations[currentLang].noAdsFound || 'განცხადებები არ მოიძებნა'}</h3>
                <p>${translations[currentLang].noAdsInfo || 'ამ კატეგორიაში ჯერ არ არის დამატებული განცხადებები'}</p>
            </div>
        `;
        return;
    }

    // 3. პოსტების რენდერინგი
    container.innerHTML = filteredPosts.map(post => {
        const hasImages = post.images && post.images.length > 0;
        const categoryBadgeText = categoryNames[post.category] || post.category;
        
        const imageSlider = hasImages ? `
            <div class="post-image-slider" id="slider-${post.id}" onclick="openDetailModal(${post.id})">
                ${post.images.map((img, idx) => `
                    <img src="${img}" alt="${post.title}" class="slider-image ${idx === 0 ? 'active' : ''}">
                `).join('')}
                ${post.images.length > 1 ? `
                    <button class="slider-btn slider-prev" onclick="event.stopPropagation(); changeSlide(${post.id}, -1)">&#10094;</button>
                    <button class="slider-btn slider-next" onclick="event.stopPropagation(); changeSlide(${post.id}, 1)">&#10095;</button>
                    <div class="slider-dots">
                        ${post.images.map((_, idx) => `
                            <div class="slider-dot ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation(); goToSlide(${post.id}, ${idx})"></div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="post-category-badge">${categoryBadgeText}</div>
            </div>
        ` : `<div class="post-image-slider" onclick="openDetailModal(${post.id})">
                <div class="post-image-placeholder">🖼️ სურათი არ არის</div>
                <div class="post-category-badge">${categoryBadgeText}</div>
             </div>`;

        return `
            <div class="post-card">
                ${imageSlider}
                <div class="post-content" onclick="openDetailModal(${post.id})">
                    ${post.price ? `<div class="post-price">${formatPriceWithCurrency(post.price)}</div>` : ''}
                    <div class="post-title">${post.title}</div>
                    <div class="post-text">${post.text.substring(0, 100) + (post.text.length > 100 ? '...' : '')}</div>
                </div>
                ${isAdmin ? `
                    <div class="post-actions">
                        <button class="btn-edit" onclick="event.stopPropagation(); editPost(${post.id})">✏️ რედაქტირება</button>
                        <button class="btn-delete" onclick="event.stopPropagation(); deletePost(${post.id})">🗑️ წაშლა</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ========== CARD SLIDER LOGIC ==========
function changeSlide(postId, direction) {
    const slider = document.getElementById(`slider-${postId}`);
    if (!slider) return;

    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    
    // Safety check
    if (currentIndex === -1) currentIndex = 0; 
    if (images.length === 0) return;

    // Remove active classes
    images[currentIndex].classList.remove('active');
    if (dots.length > 0) dots[currentIndex].classList.remove('active');

    // Calculate new index
    currentIndex = (currentIndex + direction + images.length) % images.length;

    // Add new active classes
    images[currentIndex].classList.add('active');
    if (dots.length > 0) dots[currentIndex].classList.add('active');
}

function goToSlide(postId, index) {
    const slider = document.getElementById(`slider-${postId}`);
    if (!slider) return;

    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    const currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    // Safety check
    if (currentIndex === -1) currentIndex = 0;
    if (images.length === 0) return;

    // Remove active classes
    images[currentIndex].classList.remove('active');
    if (dots.length > 0) dots[currentIndex].classList.remove('active');

    // Add new active classes
    images[index].classList.add('active');
    if (dots.length > 0) dots[index].classList.add('active');
}

// ========== DETAIL MODAL SPECS GENERATOR ==========
function generateSpecsHTML(post) {
    let specsHTML = '<div class="specs-grid">';
    
    // Helper function to get translated label
    const getLabel = (key) => translations[currentLang][key] || key;
    
    if (post.category === 'cars') {
        if (post.specs.brand) specsHTML += `<div class="spec-item"><span class="spec-label">🚗 ${getLabel('brand')}:</span><span class="spec-value">${post.specs.brand}</span></div>`;
        if (post.specs.model) specsHTML += `<div class="spec-item"><span class="spec-label">📋 ${getLabel('model')}:</span><span class="spec-value">${post.specs.model}</span></div>`;
        if (post.specs.year) specsHTML += `<div class="spec-item"><span class="spec-label">📅 ${getLabel('year')}:</span><span class="spec-value">${post.specs.year}</span></div>`;
        if (post.specs.mileage) specsHTML += `<div class="spec-item"><span class="spec-label">🛣️ ${getLabel('mileage')}:</span><span class="spec-value">${parseFloat(post.specs.mileage).toLocaleString()} კმ</span></div>`;
        if (post.specs.engine) specsHTML += `<div class="spec-item"><span class="spec-label">⚙️ ${getLabel('engine')}:</span><span class="spec-value">${post.specs.engine}</span></div>`;
        if (post.specs.color) specsHTML += `<div class="spec-item"><span class="spec-label">🎨 ${getLabel('color')}:</span><span class="spec-value">${post.specs.color}</span></div>`;
        if (post.specs.transmission) specsHTML += `<div class="spec-item"><span class="spec-label">🔧 ${getLabel('transmission')}:</span><span class="spec-value">${post.specs.transmission}</span></div>`;
        if (post.specs.drive) specsHTML += `<div class="spec-item"><span class="spec-label">🚙 ${getLabel('drive')}:</span><span class="spec-value">${post.specs.drive}</span></div>`;
    } 
    else if (post.category === 'houses') {
        if (post.specs.rooms) specsHTML += `<div class="spec-item"><span class="spec-label">🛏️ ${getLabel('rooms')}:</span><span class="spec-value">${post.specs.rooms}</span></div>`;
        if (post.specs.bedrooms) specsHTML += `<div class="spec-item"><span class="spec-label">🏠 ${getLabel('bedrooms')}:</span><span class="spec-value">${post.specs.bedrooms}</span></div>`;
        if (post.specs.area) specsHTML += `<div class="spec-item"><span class="spec-label">📐 ${getLabel('area')}:</span><span class="spec-value">${post.specs.area} მ²</span></div>`;
        if (post.specs.floor) specsHTML += `<div class="spec-item"><span class="spec-label">🏢 ${getLabel('floor')}:</span><span class="spec-value">${post.specs.floor}</span></div>`;
        if (post.specs.bathrooms) specsHTML += `<div class="spec-item"><span class="spec-label">🚿 ${getLabel('bathrooms')}:</span><span class="spec-value">${post.specs.bathrooms}</span></div>`;
        if (post.specs.type) specsHTML += `<div class="spec-item"><span class="spec-label">🏗️ ${getLabel('type')}:</span><span class="spec-value">${post.specs.type}</span></div>`;
        if (post.specs.parking) specsHTML += `<div class="spec-item"><span class="spec-label">🅿️ ${getLabel('parking')}:</span><span class="spec-value">${post.specs.parking}</span></div>`;
        if (post.specs.balcony) specsHTML += `<div class="spec-item"><span class="spec-label">🏡 ${getLabel('balcony')}:</span><span class="spec-value">${post.specs.balcony}</span></div>`;
        if (post.specs.address) specsHTML += `<div class="spec-item" style="grid-column: 1/-1;"><span class="spec-label">📍 ${getLabel('address')}:</span><span class="spec-value">${post.specs.address}</span></div>`;
    } 
    else if (post.category === 'land') {
        if (post.specs.area) specsHTML += `<div class="spec-item"><span class="spec-label">📐 ${getLabel('area')}:</span><span class="spec-value">${post.specs.area} მ²</span></div>`;
        if (post.specs.hectare) specsHTML += `<div class="spec-item"><span class="spec-label">📏 ${getLabel('hectare')}:</span><span class="spec-value">${post.specs.hectare} ha</span></div>`;
        if (post.specs.purpose) specsHTML += `<div class="spec-item"><span class="spec-label">🏗️ ${getLabel('purpose')}:</span><span class="spec-value">${post.specs.purpose}</span></div>`;
        if (post.specs.water) specsHTML += `<div class="spec-item"><span class="spec-label">💧 ${getLabel('water')}:</span><span class="spec-value">${post.specs.water}</span></div>`;
        if (post.specs.electricity) specsHTML += `<div class="spec-item"><span class="spec-label">⚡ ${getLabel('electricity')}:</span><span class="spec-value">${post.specs.electricity}</span></div>`;
        if (post.specs.road) specsHTML += `<div class="spec-item"><span class="spec-label">🛣️ ${getLabel('road')}:</span><span class="spec-value">${post.specs.road}</span></div>`;
        if (post.specs.landscape) specsHTML += `<div class="spec-item"><span class="spec-label">🏞️ ${getLabel('landscape')}:</span><span class="spec-value">${post.specs.landscape}</span></div>`;
        if (post.specs.location) specsHTML += `<div class="spec-item" style="grid-column: 1/-1;"><span class="spec-label">📍 ${getLabel('location')}:</span><span class="spec-value">${post.specs.location}</span></div>`;
    } 
    else if (post.category === 'office') {
        if (post.specs.area) specsHTML += `<div class="spec-item"><span class="spec-label">📐 ${getLabel('area')}:</span><span class="spec-value">${post.specs.area} მ²</span></div>`;
        if (post.specs.floor) specsHTML += `<div class="spec-item"><span class="spec-label">🏢 ${getLabel('floor')}:</span><span class="spec-value">${post.specs.floor}</span></div>`;
        if (post.specs.rooms) specsHTML += `<div class="spec-item"><span class="spec-label">🚪 ${getLabel('rooms')}:</span><span class="spec-value">${post.specs.rooms}</span></div>`;
        if (post.specs.bathrooms) specsHTML += `<div class="spec-item"><span class="spec-label">🚿 ${getLabel('bathrooms')}:</span><span class="spec-value">${post.specs.bathrooms}</span></div>`;
        if (post.specs.parking) specsHTML += `<div class="spec-item"><span class="spec-label">🅿️ ${getLabel('parking')}:</span><span class="spec-value">${post.specs.parking}</span></div>`;
        if (post.specs.ac) specsHTML += `<div class="spec-item"><span class="spec-label">❄️ ${getLabel('ac')}:</span><span class="spec-value">${post.specs.ac}</span></div>`;
        if (post.specs.internet) specsHTML += `<div class="spec-item"><span class="spec-label">📶 ${getLabel('internet')}:</span><span class="spec-value">${post.specs.internet}</span></div>`;
        if (post.specs.security) specsHTML += `<div class="spec-item"><span class="spec-label">🔒 ${getLabel('security')}:</span><span class="spec-value">${post.specs.security}</span></div>`;
        if (post.specs.address) specsHTML += `<div class="spec-item" style="grid-column: 1/-1;"><span class="spec-label">📍 ${getLabel('address')}:</span><span class="spec-value">${post.specs.address}</span></div>`;
    }
    
    specsHTML += '</div>';
    return specsHTML;
}

// ========== DETAIL MODAL ==========
function openDetailModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    currentDetailPost = post;
    currentDetailImageIndex = 0;
    
    document.getElementById('detailCategory').textContent = categoryNames[post.category] || post.category;
    document.getElementById('detailTitle').textContent = post.title;
    document.getElementById('detailPrice').textContent = post.price ? formatPriceWithCurrency(post.price) : 'ფასი არ არის მითითებული';
    document.getElementById('detailDescription').textContent = post.text;
    
    // სპეციფიკური მახასიათებლები
    const specsContainer = document.getElementById('detailSpecs');
    const hasSpecs = post.specs && Object.values(post.specs).some(val => val && val.toString().trim() !== '');

    if (hasSpecs) {
        specsContainer.innerHTML = '<h3>ℹ️ დეტალები</h3>' + generateSpecsHTML(post);
        specsContainer.style.display = 'block';
    } else {
        specsContainer.innerHTML = '';
        specsContainer.style.display = 'none';
    }
    
    // ფოტოები
    const images = post.images || [];
    if (images.length > 0) {
        document.getElementById('detailMainImage').src = images[0];
        document.getElementById('detailImageCounter').textContent = `1 / ${images.length}`;
        
        const thumbnailsContainer = document.getElementById('detailThumbnails');
        thumbnailsContainer.innerHTML = images.map((img, idx) => `
            <img src="${img}" alt="Thumbnail ${idx + 1}" 
                 class="${idx === 0 ? 'active' : ''}" 
                 onclick="setDetailImage(${idx})">
        `).join('');
        
        const navBtns = document.querySelector('#detailModal .gallery-nav');
        if (images.length > 1) {
            navBtns.style.display = 'flex';
        } else {
            navBtns.style.display = 'none';
        }

        // მთავარ სურათზე კლიკი ხსნის დიდ გალერეას
        document.getElementById('detailMainImage').onclick = () => openGallery(images, 0);

    } else {
        document.getElementById('detailMainImage').src = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'50%\' x=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'10\' fill=\'%23ccc\'>NO IMAGE</text></svg>';
        document.getElementById('detailImageCounter').textContent = `0 / 0`;
        document.getElementById('detailThumbnails').innerHTML = '';
        document.querySelector('#detailModal .gallery-nav').style.display = 'none';
        document.getElementById('detailMainImage').onclick = null;
    }
    
    if (isAdmin) {
        document.getElementById('detailAdminActions').style.display = 'flex';
    } else {
        document.getElementById('detailAdminActions').style.display = 'none';
    }
    
    document.getElementById('detailModal').style.display = 'block';
}

function closeDetailModalOutside(event) {
    if (event.target.id === 'detailModal') {
        closeModal('detailModal');
    }
}

function changeDetailImage(direction) {
    if (!currentDetailPost || !currentDetailPost.images || currentDetailPost.images.length === 0) return;
    
    const images = currentDetailPost.images;
    currentDetailImageIndex = (currentDetailImageIndex + direction + images.length) % images.length;
    setDetailImage(currentDetailImageIndex);
}

function setDetailImage(index) {
    if (!currentDetailPost || !currentDetailPost.images || currentDetailPost.images.length === 0) return;
    
    currentDetailImageIndex = index;
    document.getElementById('detailMainImage').src = currentDetailPost.images[index];
    document.getElementById('detailImageCounter').textContent = `${index + 1} / ${currentDetailPost.images.length}`;
    
    const thumbnails = document.querySelectorAll('#detailThumbnails img');
    thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
}

function updateDetailModalPrice() {
    if (!currentDetailPost) return;
    document.getElementById('detailPrice').textContent = currentDetailPost.price ? formatPriceWithCurrency(currentDetailPost.price) : 'ფასი არ არის მითითებული';
}

function contactSeller() {
    alert('📞 საკონტაქტო ინფორმაცია:\n\n📍 ქ. თბილისი, პეტრიაშვილის ქ. #1\n📞 +995 555 12 34 56');
}

function shareAd() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: currentDetailPost.title,
            text: currentDetailPost.text,
            url: url
        });
    } else {
        // Fallback: clipboard copy
        navigator.clipboard.writeText(url).then(() => {
            alert('📤 ლინკი დაკოპირდა!');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('ლინკის დაკოპირება ვერ მოხერხდა.');
        });
    }
}

function editPostFromDetail() {
    if (!currentDetailPost) return;
    closeModal('detailModal');
    editPost(currentDetailPost.id);
}

function deletePostFromDetail() {
    if (!currentDetailPost) return;
    const postId = currentDetailPost.id;
    closeModal('detailModal');
    deletePost(postId);
}

// ========== GALLERY MODAL (FULLSCREEN) ==========
function openGallery(images, startIndex = 0) {
    currentGalleryImages = images;
    currentGalleryIndex = startIndex;
    
    document.getElementById('galleryModal').style.display = 'block';
    updateGalleryImage();
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
}

function changeGalleryImage(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    updateGalleryImage();
}

function updateGalleryImage() {
    if (currentGalleryImages.length === 0) return;
    
    document.getElementById('galleryImage').src = currentGalleryImages[currentGalleryIndex];
    document.getElementById('galleryCounter').textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
}

// ========== ADMIN & MODALS ==========
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showLoginModal() {
    if (isAdmin) {
        alert('თქვენ უკვე შესული ხართ ადმინისტრატორის რეჟიმში.');
        return;
    }
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('passwordInput').value = '';
}

function login() {
    const password = document.getElementById('passwordInput').value;
    
    if (password === adminPassword) {
        isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true'); // სესიის შენახვა
        
        document.getElementById('adminPanel').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        
        closeModal('loginModal');
        displayPosts(); // განვაახლოთ პოსტები, რომ გამოჩნდეს ადმინ ღილაკები
        alert('წარმატებით შეხვედით ადმინისტრატორის რეჟიმში!');
    } else {
        alert('არასწორი პაროლი!');
        document.getElementById('passwordInput').value = '';
    }
}

function logout() {
    if (confirm('დარწმუნებული ხართ, რომ გსურთ გასვლა?')) {
        isAdmin = false;
        sessionStorage.removeItem('isAdmin');
        
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'flex';
        document.getElementById('logoutBtn').style.display = 'none';
        
        displayPosts(); 
        alert('გასვლა წარმატებით განხორციელდა.');
    }
}

function resetPostForm() {
    document.getElementById('postForm').reset();
    document.getElementById('postFormTitle').textContent = translations[currentLang].addNewAd || 'ახალი განცხადების დამატება';
    editingPostId = null;
    selectedImages = [];
    document.getElementById('selectedImagesContainer').innerHTML = '';
    document.getElementById('photoCounter').textContent = '0/10';
    updateFormFields();
    
    // ვალუტის გადაყენება GEL-ზე
    document.getElementById('postCurrency').value = 'GEL';
}

function showAddPostModal() {
    if (!isAdmin) return;
    resetPostForm();
    document.getElementById('postModal').style.display = 'block';
}

// ========== IMAGE HANDLER (BASE64) ==========
function handleImageSelect(event) {
    const files = Array.from(event.target.files);
    
    // დავუმატოთ მხოლოდ 10-მდე ფოტო
    const remainingSlots = 10 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
        alert(`შეგიძლიათ დაამატოთ მხოლოდ ${10 - selectedImages.length} ფოტო. მაქსიმუმია 10.`);
    }

    let loadedCount = 0;
    filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImages.push(e.target.result);
            loadedCount++;
            if (loadedCount === filesToAdd.length) {
                renderSelectedImages();
            }
        };
        reader.readAsDataURL(file);
    });

    // ფაილის ინფუთის გასუფთავება, რათა იგივე ფაილების ხელახლა არჩევა მოხდეს
    event.target.value = null;
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    renderSelectedImages();
}

function renderSelectedImages() {
    const container = document.getElementById('selectedImagesContainer');
    container.innerHTML = selectedImages.map((imgSrc, index) => `
        <div class="selected-image-item">
            <img src="${imgSrc}" alt="Selected Image ${index + 1}">
            <button type="button" onclick="removeImage(${index})">&times;</button>
        </div>
    `).join('');

    document.getElementById('photoCounter').textContent = `${selectedImages.length}/10`;
}

// ========== POST CRUD OPERATIONS ==========

function getPostData(category) {
    const postCurrency = document.getElementById('postCurrency').value;
    let priceInput = parseFloat(document.getElementById('postPrice').value) || 0;
    
    // თუ მომხმარებელმა USD აირჩია, ფასი გადავიყვანოთ GEL-ში შენახვისთვის
    let priceGEL = priceInput;
    if (postCurrency === 'USD') {
        priceGEL = priceInput * exchangeRate;
    }

    const baseData = {
        id: editingPostId || Date.now(),
        category: category,
        title: document.getElementById('postTitle').value.trim(),
        // ყოველთვის ვინახავთ GEL-ში
        price: priceGEL, 
        // ვინახავთ ორიგინალ ვალუტას რედაქტირებისთვის
        originalCurrency: postCurrency, 
        text: document.getElementById('postText').value.trim(),
        images: selectedImages
    };

    if (!baseData.title || !baseData.text) {
        alert('სათაური და აღწერა აუცილებელია!');
        return null;
    }

    let specs = {};

    // Helper to get spec value safely
    const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : '';

    if (category === 'cars') {
        specs = {
            brand: getValue('carBrand'),
            model: getValue('carModel'),
            year: getValue('carYear'),
            mileage: getValue('carMileage'),
            engine: getValue('carEngine'),
            color: getValue('carColor'),
            transmission: getValue('carTransmission'),
            drive: getValue('carDrive'),
        };
    } else if (category === 'houses') {
        specs = {
            rooms: getValue('houseRooms'),
            bedrooms: getValue('houseBedrooms'),
            area: getValue('houseArea'),
            floor: getValue('houseFloor'),
            bathrooms: getValue('houseBathrooms'),
            type: getValue('houseType'),
            parking: getValue('houseParking'),
            balcony: getValue('houseBalcony'),
            address: getValue('houseAddress')
        };
    } else if (category === 'land') {
        specs = {
            area: getValue('landArea'),
            hectare: getValue('landHectare'),
            purpose: getValue('landPurpose'),
            water: getValue('landWater'),
            electricity: getValue('landElectricity'),
            road: getValue('landRoad'),
            landscape: getValue('landLandscape'),
            location: getValue('landLocation')
        };
    } else if (category === 'office') {
        specs = {
            area: getValue('officeArea'),
            floor: getValue('officeFloor'),
            rooms: getValue('officeRooms'),
            bathrooms: getValue('officeBathrooms'),
            parking: getValue('officeParking'),
            ac: getValue('officeAC'),
            internet: getValue('officeInternet'),
            security: getValue('officeSecurity'),
            address: getValue('officeAddress')
        };
    }

    baseData.specs = specs;
    return baseData;
}

function addPost(event) {
    event.preventDefault();
    if (!isAdmin) return alert('ავტორიზაციაა საჭირო.');

    const category = document.getElementById('postCategory').value;
    const postData = getPostData(category);

    if (!postData) return; // Validation failed

    if (editingPostId) {
        // რედაქტირება
        const index = posts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            posts[index] = postData;
            alert('განცხადება წარმატებით განახლდა!');
        }
    } else {
        // დამატება
        posts.unshift(postData); // უახლესი პოსტი თავში
        alert('განცხადება წარმატებით დაემატა!');
    }

    savePosts();
    closeModal('postModal');
    displayPosts();
    updateFilterInfo();
    resetPostForm();
}

function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || !isAdmin) return;

    editingPostId = postId;
    document.getElementById('postFormTitle').textContent = `განცხადების რედაქტირება: ${post.title}`;

    // ძირითადი ველები
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postText').value = post.text;
    
    // ვალუტა და ფასი
    const originalCurrency = post.originalCurrency || 'GEL'; 
    document.getElementById('postCurrency').value = originalCurrency; 
    
    let displayPrice = post.price;
    // თუ ორიგინალი USD იყო, უკან გადავიყვანოთ დოლარში ჩვენების მიზნით
    if (originalCurrency === 'USD') {
        displayPrice = (post.price / exchangeRate).toFixed(0);
    }
    document.getElementById('postPrice').value = displayPrice || '';

    // სურათები
    selectedImages = post.images || [];
    renderSelectedImages();

    // კატეგორიის ველების განახლება
    updateFormFields();

    // სპეციფიკური ველები (Helper function)
    const setFieldValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    };

    if (post.specs) {
        if (post.category === 'cars') {
            setFieldValue('carBrand', post.specs.brand);
            setFieldValue('carModel', post.specs.model);
            setFieldValue('carYear', post.specs.year);
            setFieldValue('carMileage', post.specs.mileage);
            setFieldValue('carEngine', post.specs.engine);
            setFieldValue('carColor', post.specs.color);
            setFieldValue('carTransmission', post.specs.transmission);
            setFieldValue('carDrive', post.specs.drive);
        } else if (post.category === 'houses') {
            setFieldValue('houseRooms', post.specs.rooms);
            setFieldValue('houseBedrooms', post.specs.bedrooms);
            setFieldValue('houseArea', post.specs.area);
            setFieldValue('houseFloor', post.specs.floor);
            setFieldValue('houseBathrooms', post.specs.bathrooms);
            setFieldValue('houseType', post.specs.type);
            setFieldValue('houseParking', post.specs.parking);
            setFieldValue('houseBalcony', post.specs.balcony);
            setFieldValue('houseAddress', post.specs.address);
        } else if (post.category === 'land') {
            setFieldValue('landArea', post.specs.area);
            setFieldValue('landHectare', post.specs.hectare);
            setFieldValue('landPurpose', post.specs.purpose);
            setFieldValue('landWater', post.specs.water);
            setFieldValue('landElectricity', post.specs.electricity);
            setFieldValue('landRoad', post.specs.road);
            setFieldValue('landLandscape', post.specs.landscape);
            setFieldValue('landLocation', post.specs.location);
        } else if (post.category === 'office') {
            setFieldValue('officeArea', post.specs.area);
            setFieldValue('officeFloor', post.specs.floor);
            setFieldValue('officeRooms', post.specs.rooms);
            setFieldValue('officeBathrooms', post.specs.bathrooms);
            setFieldValue('officeParking', post.specs.parking);
            setFieldValue('officeAC', post.specs.ac);
            setFieldValue('officeInternet', post.specs.internet);
            setFieldValue('officeSecurity', post.specs.security);
            setFieldValue('officeAddress', post.specs.address);
        }
    }

    document.getElementById('postModal').style.display = 'block';
}

function deletePost(postId) {
    if (!isAdmin) return;
    if (confirm('დარწმუნებული ხართ, რომ გსურთ განცხადების წაშლა?')) {
        posts = posts.filter(p => p.id !== postId);
        savePosts();
        displayPosts();
        updateFilterInfo();
        alert('განცხადება წაიშალა!');
    }
}