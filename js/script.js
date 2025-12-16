// =================================================================
// გლობალური ცვლადები (ინიციალიზებულია index.html-ში)
// const db = firebase.firestore();
// const storage = firebase.storage(); 
// =================================================================

let postsData = []; 
let currentFilter = 'all';
let currentLang = localStorage.getItem('siteLang') || 'ka';
let currentCurrency = localStorage.getItem('siteCurrency') || 'GEL'; 
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Post Form Variables
let selectedImageFiles = []; 
let currentPostIdToEdit = null; 

// Detail/Gallery View Variables
let detailImages = []; 
let currentDetailIndex = 0; 
let currentDetailPost = null;

// !!! შეცვალეთ ეს თქვენი პაროლით !!!
const ADMIN_PASSWORD = 'glgroupadmin'; // იყენებს პირდაპირ ტექსტს შემოწმებისთვის

// --- TRANSLATION DATA ---
const translations = {
    'ka': {
        allAds: "🌟 ყველა განცხადება",
        cars: "🚗 ავტომობილები",
        houses: "🏡 სახლები",
        land: "🌾 მიწის ნაკვეთები",
        office: "🏢 საოფისე",
        searchPlaceholder: "მოძებნეთ სათაურით ან აღწერით...",
        search: "🔍 ძიება",
        authorization: "ავტორიზაცია",
        password: "პაროლი:",
        login: "შესვლა",
        cancel: "გაუქმება",
        admin: "ადმინი",
        newAd: "➕ ახალი განცხადება",
        logout: "გასვლა",
        addNewAd: "ახალი განცხადების დამატება",
        category: "კატეგორია:",
        title: "სათაური:",
        price: "ფასი:",
        description: "დეტალური აღწერა:",
        photos: "ფოტოები",
        maxPhotos: "(მაქსიმუმ 10 ფოტო)",
        save: "შენახვა",
        heroTitle: "იპოვე შენი სამომავლო ქონება",
        heroSubtitle: "ავტომობილები, სახლები, მიწის ნაკვეთები და საოფისე ფართები",
        contact: "კონტაქტი",
        address: "მისამართი:",
        phone: "ტელეფონი:",
        email: "ელ.ფოსტა:",
        social: "სოციალური მედია",
        footerMission: "უძრავი ქონების და ავტომობილების საუკეთესო განცხადებები ერთ სივრცეში."
    },
    // !!! დაამატეთ "en" და "ru" თარგმანები აქ !!!
};

// =================================================================
// FIREBASE DATA MANIPULATION (CRUD Operations)
// =================================================================

/**
 * [CREATE] ატვირთავს ფაილს Firebase Storage-ში და აბრუნებს მის URL-ს.
 */
async function uploadImageToFirebase(file) {
    if (!file) return null;

    try {
        const uniqueName = Date.now() + '-' + file.name;
        const storageRef = storage.ref('post_images/' + uniqueName);
        
        const uploadTask = storageRef.put(file);
        await uploadTask; 
        
        const downloadURL = await storageRef.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("შეცდომა: სურათი ვერ აიტვირთა სერვერზე. იხილეთ კონსოლი.");
        return null;
    }
}

/**
 * [DELETE] წაშლის პოსტს Firestore-დან და მასთან დაკავშირებულ სურათებს Storage-დან.
 */
async function deletePost(postId, imageUrls) {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ამ განცხადების წაშლა?")) return;

    try {
        // 1. სურათების წაშლა Storage-დან
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            for (const url of imageUrls) {
                if (url && url.includes("firebasestorage")) {
                    const imageRef = storage.refFromURL(url);
                    await imageRef.delete().catch(error => {
                        console.warn(`Image delete failed for ${url}:`, error);
                    });
                }
            }
        }
        
        // 2. დოკუმენტის წაშლა Firestore-დან
        await db.collection("listings").doc(postId).delete();
        
        alert("განცხადება წარმატებით წაიშალა!");
        closeModal('detailModal');
        loadPosts(); 
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("შეცდომა: წაშლა ვერ განხორციელდა.");
    }
}

/**
 * [READ] პოსტების ჩატვირთვა Firestore-დან.
 */
async function loadPosts() {
    try {
        // შეცდომის შემთხვევაში, Firestore Rules-ის შემოწმებაა საჭირო
        const snapshot = await db.collection("listings").orderBy('timestamp', 'desc').get();
        postsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`Posts loaded from Firestore: ${postsData.length} documents.`);
        displayPosts(postsData.filter(p => currentFilter === 'all' || p.category === currentFilter));
    } catch (error) {
        console.error("Error loading posts from Firestore:", error);
        document.getElementById('postsContainer').innerHTML = `<div class="empty-state"><h3>შეცდომა მონაცემების ჩატვირთვისას</h3><p>კავშირი დაფიქსირებულია, ახლა სავარაუდოდ, Firestore-ის წესებში (Rules) გჭირდებათ ცვლილების შეტანა, რათა დაუშვათ მონაცემთა წაკითხვა.</p></div>`;
    }
}

// =================================================================
// POST FORM LOGIC (ADD/EDIT)
// =================================================================

function showAddPostModal() {
    currentPostIdToEdit = null;
    document.getElementById('postFormTitle').textContent = translations[currentLang].addNewAd;
    document.getElementById('postForm').reset();
    selectedImageFiles = [];
    document.getElementById('imageInput').value = ''; 
    updateSelectedImagesDisplay();
    updateFormFields(); 
    showModal('postModal');
}

function showEditPostModal(postId) {
    alert("რედაქტირების ფუნქცია ამჟამად არ არის იმპლემენტირებული.");
    // თუ დაამატებთ რედაქტირების ლოგიკას, ეს ფუნქცია გამოიყენება
    // currentPostIdToEdit = postId;
    // ...
}

function getFormData() {
    const category = document.getElementById('postCategory').value;
    const commonData = {
        title: document.getElementById('postTitle').value,
        description: document.getElementById('postText').value,
        price: parseFloat(document.getElementById('postPrice').value),
        currency: document.getElementById('postCurrency').value,
        category: category,
        images: [], 
        imageUrl: '', 
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // კატეგორიის სპეციფიკური ველების შევსება
    commonData.specs = {};
    if (category === 'cars') {
        commonData.specs = {
            brand: document.getElementById('carBrand').value,
            model: document.getElementById('carModel').value,
            year: document.getElementById('carYear').value,
            mileage: document.getElementById('carMileage').value + ' კმ',
            engine: document.getElementById('carEngine').value,
            color: document.getElementById('carColor').value,
            transmission: document.getElementById('carTransmission').value,
            drive: document.getElementById('carDrive').value,
        };
    } else if (category === 'houses') {
        commonData.specs = {
            rooms: document.getElementById('houseRooms').value,
            area: document.getElementById('houseArea').value + ' მ²',
            address: document.getElementById('houseAddress').value,
            bedrooms: document.getElementById('houseBedrooms').value,
            floor: document.getElementById('houseFloor').value,
            // ... სხვა ველები
        };
    }
    // ... დაამატეთ სხვა კატეგორიები
    
    return commonData;
}

/**
 * [CREATE] ამუშავებს ფორმის გაგზავნას.
 */
async function addPost(event) {
    event.preventDefault();
    const isEditing = !!currentPostIdToEdit;
    
    const postData = getFormData();
    
    if (selectedImageFiles.length === 0) {
        alert("გთხოვთ, ატვირთოთ მინიმუმ ერთი სურათი!");
        return;
    }

    // 2. სურათების ატვირთვა Storage-ში
    let imageUrls = [];
    for (const file of selectedImageFiles) {
        const url = await uploadImageToFirebase(file);
        if (url) imageUrls.push(url);
    }
    
    if (imageUrls.length === 0) {
        alert("სურათების ატვირთვა ვერ მოხერხდა. პოსტი არ შენახულა.");
        return;
    }

    postData.images = imageUrls;
    postData.imageUrl = imageUrls[0]; 

    try {
        if (isEditing) {
            // რედაქტირება
            // await db.collection("listings").doc(currentPostIdToEdit).update(postData);
            alert("რედაქტირება არ არის იმპლემენტირებული.");
        } else {
            // ახალი პოსტის დამატება
            await db.collection("listings").add(postData);
            alert("განცხადება წარმატებით დაემატა!");
        }
        
        closeModal('postModal');
        loadPosts(); 
    } catch (error) {
        console.error("Firestore Save Error:", error);
        alert("მონაცემთა შენახვა ვერ მოხერხდა. იხილეთ კონსოლი.");
    }
}

// =================================================================
// UI LOGIC (Modal, Filtering, Display)
// =================================================================

function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = `<div class="empty-state"><h3>არ მოიძებნა განცხადებები</h3><p>სცადეთ სხვა კატეგორიის არჩევა ან მოძებნეთ სხვა საკვანძო სიტყვით.</p></div>`;
        document.getElementById('filterCount').textContent = 0;
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        
        const imageUrl = post.imageUrl || 'https://via.placeholder.com/300x200.png?text=No+Image';

        postElement.innerHTML = `
            <div class="post-image-slider" onclick="showDetailModal('${post.id}')">
                <img src="${imageUrl}" alt="${post.title}" class="slider-image active">
                <div class="post-category-badge">${translations[currentLang][post.category] || post.category}</div>
            </div>
            <div class="post-content" onclick="showDetailModal('${post.id}')">
                <div class="post-price">${formatPrice(post.price, post.currency)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-text">${post.description ? post.description.substring(0, 70) + '...' : ''}</p>
            </div>
            <div class="post-actions" style="display: ${isLoggedIn ? 'flex' : 'none'};">
                <button class="btn-edit" onclick="event.stopPropagation(); showEditPostModal('${post.id}')">✏️</button>
                <button class="btn-delete" onclick="event.stopPropagation(); deletePost('${post.id}', ${JSON.stringify(post.images)})">🗑️</button>
            </div>
        `;
        container.appendChild(postElement);
    });

    document.getElementById('filterCount').textContent = posts.length;
}

// ... (დანარჩენი UI და დამხმარე ფუნქციები) ...

function filterCategory(category) {
    currentFilter = category;
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.dataset.category === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const titleKey = category === 'all' ? 'allAds' : category;
    document.querySelector('.filter-info h2').textContent = translations[currentLang][titleKey] || titleKey;

    displayPosts(postsData.filter(p => category === 'all' || p.category === category));
}

function liveSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = postsData.filter(post => 
        (post.title && post.title.toLowerCase().includes(searchTerm)) ||
        (post.description && post.description.toLowerCase().includes(searchTerm))
    );
    displayPosts(filtered);
}

function formatPrice(price, currency) {
    if (isNaN(price) || price === null) return 'N/A';
    
    let displayPrice = price;
    let symbol = currency === 'GEL' ? '₾' : '$';

    if (currentCurrency === 'USD') {
        if (currency === 'GEL') {
            displayPrice = price / 2.7; // იმიტირებული კურსი
            symbol = '$';
        } else {
            symbol = '$';
        }
    } else { // GEL
        if (currency === 'USD') {
            displayPrice = price * 2.7; // იმიტირებული კურსი
            symbol = '₾';
        } else {
            symbol = '₾';
        }
    }

    return `${symbol} ${Math.round(displayPrice).toLocaleString('en-US')}`;
}

function toggleCurrency() {
    currentCurrency = currentCurrency === 'GEL' ? 'USD' : 'GEL';
    localStorage.setItem('siteCurrency', currentCurrency);
    document.getElementById('currencyToggle').innerHTML = currentCurrency === 'GEL' ? 
        '<span class="currency-symbol">₾</span> / $' : 
        '₾ / <span class="currency-symbol">$</span>';
    loadPosts(); 
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.dataset.theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    body.dataset.theme = newTheme;
    localStorage.setItem('siteTheme', newTheme);
    document.getElementById('themeToggle').innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    document.body.dataset.theme = savedTheme;
    document.getElementById('themeToggle').innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    document.getElementById('currentLang').textContent = lang === 'ka' ? '🇬🇪 ქარ' : lang === 'en' ? '🇬🇧 Eng' : '🇷🇺 Рус';
    applyTranslations();
    toggleLanguageMenu(false); 
    loadPosts(); 
}

function toggleLanguageMenu(show) {
    const menu = document.getElementById('languageMenu');
    if (show === false) {
        menu.classList.remove('active');
        return;
    }
    menu.classList.toggle('active');
}

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showLoginModal() {
    document.getElementById('passwordInput').value = '';
    showModal('loginModal');
}

function login() {
    const password = document.getElementById('passwordInput').value;
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        checkLoginStatus();
        closeModal('loginModal');
        alert("ადმინის პანელზე შესვლა წარმატებით განხორციელდა!");
    } else {
        alert("არასწორი პაროლი!");
    }
}

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    checkLoginStatus();
    loadPosts();
}

function checkLoginStatus() {
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    
    if (isLoggedIn) {
        adminPanel.style.display = 'flex';
        loginBtn.style.display = 'none';
    } else {
        adminPanel.style.display = 'none';
        loginBtn.style.display = 'block';
    }
    displayPosts(postsData.filter(p => currentFilter === 'all' || p.category === currentFilter)); 
}

function updateFormFields() {
    const category = document.getElementById('postCategory').value;
    document.querySelectorAll('.category-fields').forEach(field => {
        field.style.display = 'none';
    });
    if (document.getElementById(`${category}Fields`)) {
        document.getElementById(`${category}Fields`).style.display = 'block';
    }
}

function showDetailModal(postId) {
    const post = postsData.find(p => p.id === postId);
    if (!post) return;
    
    currentDetailPost = post;
    detailImages = Array.isArray(post.images) ? post.images : (post.imageUrl ? [post.imageUrl] : []); 
    currentDetailIndex = 0;

    document.getElementById('detailCategory').textContent = translations[currentLang][post.category] || post.category;
    document.getElementById('detailTitle').textContent = post.title;
    document.getElementById('detailPrice').textContent = formatPrice(post.price, post.currency);
    document.getElementById('detailDescription').textContent = post.description;

    document.getElementById('detailAdminActions').style.display = isLoggedIn ? 'flex' : 'none';

    updateDetailView();
    showModal('detailModal');
}

function updateDetailView() {
    if (detailImages.length === 0) {
        document.getElementById('detailMainImage').src = 'https://via.placeholder.com/600x400.png?text=No+Images';
        document.getElementById('detailImageCounter').textContent = '0 / 0';
        document.getElementById('detailThumbnails').innerHTML = '';
        return;
    }

    document.getElementById('detailMainImage').src = detailImages[currentDetailIndex];
    document.getElementById('detailImageCounter').textContent = `${currentDetailIndex + 1} / ${detailImages.length}`;

    const thumbnailsContainer = document.getElementById('detailThumbnails');
    thumbnailsContainer.innerHTML = '';

    detailImages.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Thumbnail ${index + 1}`;
        img.classList.toggle('active', index === currentDetailIndex);
        img.onclick = () => { currentDetailIndex = index; updateDetailView(); };
        thumbnailsContainer.appendChild(img);
    });
    
    const specsContainer = document.getElementById('detailSpecs');
    specsContainer.innerHTML = '<h3>🔧 მახასიათებლები</h3><div class="specs-grid"></div>';
    const specsGrid = specsContainer.querySelector('.specs-grid');

    if (currentDetailPost && currentDetailPost.specs) {
        for (const key in currentDetailPost.specs) {
            if (currentDetailPost.specs[key]) {
                 const item = document.createElement('div');
                 item.className = 'spec-item';
                 item.innerHTML = `<span class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span> <span class="spec-value">${currentDetailPost.specs[key]}</span>`;
                 specsGrid.appendChild(item);
            }
        }
    } else {
         specsGrid.innerHTML = '<p>სპეციფიკაციები არ არის.</p>';
    }
}


function changeDetailImage(step) {
    currentDetailIndex = (currentDetailIndex + step + detailImages.length) % detailImages.length;
    updateDetailView();
}

function closeDetailModalOutside(event) {
    if (event.target.id === 'detailModal' || event.target.id === 'galleryModal') {
        closeModal(event.target.id);
    }
}

function deletePostFromDetail() {
    if (currentDetailPost) {
        deletePost(currentDetailPost.id, currentDetailPost.images);
    }
}

function editPostFromDetail() {
     if (currentDetailPost) {
        showEditPostModal(currentDetailPost.id);
    }
}


// =================================================================
// IMAGE HANDLERS
// =================================================================

function handleImageSelect(event) {
    const files = Array.from(event.target.files);
    const maxFiles = 10;

    if (selectedImageFiles.length + files.length > maxFiles) {
        alert(`შეგიძლიათ ატვირთოთ მაქსიმუმ ${maxFiles} ფოტო.`);
        const remaining = maxFiles - selectedImageFiles.length;
        selectedImageFiles.push(...files.slice(0, remaining));
    } else {
        selectedImageFiles.push(...files);
    }

    updateSelectedImagesDisplay();
}

function removeImage(index) {
    selectedImageFiles.splice(index, 1);
    updateSelectedImagesDisplay();
}

function updateSelectedImagesDisplay() {
    const container = document.getElementById('selectedImagesContainer');
    container.innerHTML = '';
    
    selectedImageFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'selected-image-item';

        const reader = new FileReader();
        reader.onload = function(e) {
            item.innerHTML = `
                <img src="${e.target.result}" alt="Selected Image">
                <button type="button" onclick="removeImage(${index})">&times;</button>
            `;
            container.appendChild(item);
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('photoCounter').textContent = `${selectedImageFiles.length}/${10}`;
}


// =================================================================
// INITIALIZATION
// =================================================================

function init() {
    loadTheme(); 
    document.getElementById('currencyToggle').innerHTML = currentCurrency === 'GEL' ? 
        '<span class="currency-symbol">₾</span> / $' : 
        '₾ / <span class="currency-symbol">$</span>';
    
    applyTranslations();
    checkLoginStatus(); 
    updateFormFields();

    // მონაცემების ჩატვირთვა Firebase-დან
    loadPosts(); 
}

document.addEventListener('DOMContentLoaded', init);