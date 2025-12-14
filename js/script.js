let isAdmin = false;
let posts = [];
let editingPostId = null;
let currentFilter = 'all';
let selectedImages = [];

// ✅ პაროლი განახლებულია!
const adminPassword = 'kobaxidze7413'; 

const categoryNames = {
    all: '🌟 ყველა განცხადება',
    cars: '🚗 ავტომობილები',
    houses: '🏡 სახლები',
    land: '🌾 მიწის ნაკვეთები',
    office: '🏢 საოფისე'
};

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
        heroTitle: 'იპოვე შენი სამომავლო სახლი',
        heroSubtitle: 'ავტომობილები, სახლები, მიწის ნაკვეთები და საოფისე ფართები',
        authorization: 'ავტორიზაცია',
        password: 'პაროლი:',
        defaultPassword: 'ნაგულისხმევი პაროლი: <strong>admin123</strong>', 
        login: 'შესვლა',
        cancel: 'გაუქმება',
        addNewAd: 'ახალი განცხადების დამატება',
        category: 'კატეგორია:',
        title: 'სათაური:',
        price: 'ფასი (₾):',
        description: 'აღწერა:',
        photos: 'ფოტოები',
        maxPhotos: 'მაქსიმუმ 10 ფოტო',
        save: 'შენახვა',
        adminPanel: 'ადმინისტრატორის პანელი',
        newAd: 'ახალი განცხადება',
        allAds: 'ყველა განცხადება'
    },
    en: {
        all: 'All',
        cars: '🚗 Cars',
        houses: '🏡 Houses',
        land: '🌾 Land Plots',
        office: '🏢 Office',
        admin: 'Admin',
        logout: 'Logout',
        heroTitle: 'Find Your Future Home',
        heroSubtitle: 'Cars, Houses, Land Plots, and Office Spaces',
        authorization: 'Authorization',
        password: 'Password:',
        defaultPassword: 'Default Password: <strong>admin123</strong>',
        login: 'Login',
        cancel: 'Cancel',
        addNewAd: 'Add New Post',
        category: 'Category:',
        title: 'Title:',
        price: 'Price (₾):',
        description: 'Description:',
        photos: 'Photos',
        maxPhotos: 'Maximum 10 photos',
        save: 'Save',
        adminPanel: 'Administrator Panel',
        newAd: 'New Post',
        allAds: 'All Ads'
    },
    ru: {
        all: 'Все',
        cars: '🚗 Автомобили',
        houses: '🏡 Дома',
        land: '🌾 Земля',
        office: '🏢 Офисы',
        admin: 'Админ',
        logout: 'Выход',
        heroTitle: 'Найди свой будущий дом',
        heroSubtitle: 'Автомобили, дома, земельные участки и офисные помещения',
        authorization: 'Авторизация',
        password: 'Пароль:',
        defaultPassword: 'Пароль по умолчанию: <strong>admin123</strong>',
        login: 'Войти',
        cancel: 'Отмена',
        addNewAd: 'Добавить объявление',
        category: 'Категория:',
        title: 'Заголовок:',
        price: 'Цена (₾):',
        description: 'Описание:',
        photos: 'Фотографии',
        maxPhotos: 'Максимум 10 фотографий',
        save: 'Сохранить',
        adminPanel: 'Панель администратора',
        newAd: 'Новое объявление',
        allAds: 'Все объявления'
    }
};

let currentLang = 'ka'; 

// ---------------------- 
// MEMORY & INITIALIZATION
// ----------------------

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

// ---------------------- 
// LANGUAGE AND THEME
// ----------------------

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

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    // ✅ გამოიყენება toggle მენიუს გასახსნელად/დასახურად
    menu.classList.toggle('active');
}

function changeLanguage(lang) {
    currentLang = lang;
    const langCode = lang === 'ka' ? 'ქარ' : lang.toUpperCase();
    document.getElementById('currentLang').innerHTML = `
        ${lang === 'ka' ? '🇬🇪' : lang === 'en' ? '🇬🇧' : lang === 'ru' ? '🇷🇺' : ''} ${langCode}
    `;
    
    // თარგმანის განახლება
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key]; 
        }
    });

    // ლოკალური შენახვა
    localStorage.setItem('lang', lang);
    
    // ✅ მენიუ დაიხურება ენის არჩევის შემდეგ
    const menu = document.getElementById('languageMenu');
    menu.classList.remove('active'); 
}

// Load everything on page load
window.onload = () => {
    loadTheme();
    
    if (localStorage.getItem('lang')) {
        const savedLang = localStorage.getItem('lang');
        const langCode = savedLang === 'ka' ? 'ქარ' : savedLang.toUpperCase();
        document.getElementById('currentLang').innerHTML = `
            ${savedLang === 'ka' ? '🇬🇪' : savedLang === 'en' ? '🇬🇧' : savedLang === 'ru' ? '🇷🇺' : ''} ${langCode}
        `;
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[savedLang] && translations[savedLang][key]) {
                element.innerHTML = translations[savedLang][key]; 
            }
        });
    }
    loadPosts(); 
};

// გარე დაწკაპუნებით ენის მენიუს დახურვა
document.addEventListener('click', (event) => {
    const menu = document.getElementById('languageMenu');
    const btn = document.querySelector('.lang-btn');
    
    // თუ მენიუ გახსნილია და დაწკაპუნება არ არის მენიუზე ან ღილაკზე
    if (menu.classList.contains('active') && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove('active');
    }
    
    // მობილური მენიუს დახურვა
    const navMenu = document.getElementById('navMenu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');

    if (navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileBtn.contains(event.target)) {
        
        navMenu.classList.remove('active');
    }
});


// ---------------------- 
// FILTERING & DISPLAY
// ----------------------

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
    
    const categoryText = categoryNames[currentFilter];
    
    filterInfo.innerHTML = `
        <h2>${categoryText}</h2>
        <p>${filteredPosts.length} განცხადება</p>
    `;
}

function displayPosts() {
    const container = document.getElementById('postsContainer');
    
    const filteredPosts = currentFilter === 'all' 
        ? posts 
        : posts.filter(p => p.category === currentFilter);
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>განცხადებები არ მოიძებნა</h3>
                <p>ამ კატეგორიაში ჯერ არ არის დამატებული განცხადებები</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredPosts.map(post => {
        const hasImages = post.images && post.images.length > 0;
        
        const imageSlider = hasImages ? `
            <div class="post-image-slider" id="slider-${post.id}">
                ${post.images.map((img, idx) => `
                    <img src="${img}" alt="${post.title}" class="slider-image ${idx === 0 ? 'active' : ''}" onclick="openGallery(${post.id}, ${idx})">
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
                <div class="post-category-badge">${categoryNames[post.category]}</div>
            </div>
        ` : `<div class="post-image-slider">
                <div class="post-image-placeholder">🖼️ სურათი არ არის</div>
                <div class="post-category-badge">${categoryNames[post.category]}</div>
             </div>`;

        return `
            <div class="post-card">
                ${imageSlider}
                <div class="post-content">
                    ${post.price ? `<div class="post-price">${formatPrice(post.price)} ₾</div>` : ''}
                    <div class="post-title">${post.title}</div>
                    <div class="post-text">${post.text.substring(0, 100) + (post.text.length > 100 ? '...' : '')}</div>
                </div>
                ${isAdmin ? `
                    <div class="post-actions">
                        <button class="btn-edit" onclick="editPost(${post.id})">✏️ რედაქტირება</button>
                        <button class="btn-delete" onclick="deletePost(${post.id})">🗑️ წაშლა</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ---------------------- 
// ADMIN & MODAL FUNCTIONALITY
// ----------------------

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showLoginModal() {
    if (isAdmin) {
        alert('თქვენ უკვე შესული ხართ ადმინისტრატორის რეჟიმში.');
        return;
    }
    document.getElementById('loginModal').style.display = 'block';
    // პაროლის ველის გასუფთავება
    document.getElementById('passwordInput').value = ''; 
}

function login() {
    const password = document.getElementById('passwordInput').value;
    if (password === adminPassword) {
        isAdmin = true;
        
        document.getElementById('adminPanel').style.display = 'flex'; 
        
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        
        closeModal('loginModal');
        displayPosts();
        alert('✅ წარმატებით შეხვედით სისტემაში!');
    } else {
        alert('❌ არასწორი პაროლი'); 
        document.getElementById('passwordInput').value = ''; // პაროლის გასუფთავება
    }
}

function logout() {
    isAdmin = false;
    document.getElementById('adminPanel').style.display = 'none'; 
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    
    displayPosts();
    alert('✅ სისტემიდან გამოსვლა წარმატებით დასრულდა.');
}

function showAddPostModal() {
    if (!isAdmin) return alert('არ გაქვთ ადმინისტრატორის უფლებები.');
    
    editingPostId = null;
    document.getElementById('postFormTitle').textContent = 'ახალი განცხადების დამატება';
    document.getElementById('postForm').reset();
    selectedImages = [];
    updateSelectedImagesDisplay();
    document.getElementById('postModal').style.display = 'block';
}

function addPost(event) {
    event.preventDefault(); 
    
    const title = document.getElementById('postTitle').value;
    const text = document.getElementById('postText').value;
    const price = document.getElementById('postPrice').value;
    const category = document.getElementById('postCategory').value;
    
    if (!title || !text || !category) {
        return alert('გთხოვთ, შეავსოთ ყველა აუცილებელი ველი (სათაური, ტექსტი, კატეგორია).');
    }

    const newPost = {
        title,
        text,
        price: price ? parseFloat(price) : null,
        category,
        images: [...selectedImages]
    };
    
    if (editingPostId !== null) {
        const index = posts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...newPost };
            alert('✅ განცხადება წარმატებით განახლდა!');
        }
    } else {
        newPost.id = Date.now(); 
        posts.unshift(newPost); 
        alert('✅ განცხადება წარმატებით დაემატა!');
    }
    
    savePosts();
    displayPosts();
    closeModal('postModal');
}

function editPost(postId) {
    if (!isAdmin) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    editingPostId = postId;
    document.getElementById('postFormTitle').textContent = 'განცხადების რედაქტირება';
    
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postText').value = post.text;
    document.getElementById('postPrice').value = post.price || '';
    document.getElementById('postCategory').value = post.category;
    
    selectedImages = post.images || [];
    updateSelectedImagesDisplay();

    document.getElementById('postModal').style.display = 'block';
}

function deletePost(postId) {
    if (!isAdmin) return;
    
    if (confirm('ნამდვილად გსურთ ამ განცხადების წაშლა?')) {
        posts = posts.filter(p => p.id !== postId);
        savePosts();
        displayPosts();
        alert('🗑️ განცხადება წაშლილია.');
    }
}

// ---------------------- 
// IMAGE HANDLING (Base64) 
// ----------------------

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleImageSelect(event) {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
        if (selectedImages.length >= 10) return; 
        
        try {
            const base64Image = await getBase64(file); 
            selectedImages.push(base64Image);
        } catch (error) {
            console.error("Error reading file:", error);
        }
    }
    
    updateSelectedImagesDisplay();
    event.target.value = ''; 
}

function updateSelectedImagesDisplay() {
    const container = document.getElementById('selectedImagesContainer');
    document.getElementById('photoCounter').textContent = `${selectedImages.length}/10`;
    
    if (selectedImages.length === 0) {
        container.innerHTML = 'სურათები არ არის არჩეული.';
        return;
    }
    
    container.innerHTML = selectedImages.map((img, index) => `
        <div class="selected-image-item">
            <img src="${img}" alt="Selected Image">
            <button type="button" onclick="removeSelectedImage(${index})">❌</button>
        </div>
    `).join('');
}

function removeSelectedImage(index) {
    selectedImages.splice(index, 1);
    updateSelectedImagesDisplay();
}


// ---------------------- 
// UTILITY & GALLERY FUNCTIONS
// ----------------------

function changeSlide(postId, direction) {
    const slider = document.getElementById(`slider-${postId}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    currentIndex = (currentIndex + direction + images.length) % images.length;
    
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

function goToSlide(postId, index) {
    const slider = document.getElementById(`slider-${postId}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.slider-dot');
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (images[index] && dots[index]) {
        images[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

function openGallery(postId, imageIndex) {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.images || post.images.length === 0) return;
    
    currentGalleryImages = post.images;
    currentGalleryIndex = imageIndex;
    
    updateGalleryImage();
    document.getElementById('galleryModal').style.display = 'block';
}

function closeGallery() {
    document.getElementById('galleryModal').style.display = 'none';
}

function changeGalleryImage(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    updateGalleryImage();
}

function updateGalleryImage() {
    document.getElementById('galleryImage').src = currentGalleryImages[currentGalleryIndex];
    document.getElementById('galleryCounter').textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
}

function formatPrice(price) {
    if (price === null || price === undefined) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}