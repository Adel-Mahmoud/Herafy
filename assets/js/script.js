
    window.addEventListener("load", function () {
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");
    });
    
    // ---------- بيانات متطورة مع صور إضافية ومواقع خرائط ----------
    const providers = [
        { 
            id: 1, name: "محمود رمضان", job: "حلاق", 
            bio: "أقدم خدمات الحلاقة الرجالية والعناية بالمظهر بأعلى معايير النظافة والاحترافية. دقة في التنفيذ، مواعيد منضبطة، وضمان إطلالة تليق بك باستخدام أحدث الأدوات",
            phone: "01062717190", 
            avatar: "/Herafy/assets/imgs/mahmoud-ramadan.jpg",
            // cover: "2.jpeg",
            gallery: [
                "/Herafy/assets/imgs/1.jpeg",
                "/Herafy/assets/imgs/2.jpeg",
                "/Herafy/assets/imgs/3.jpeg",
            ],
            location: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3523.052733891317!2d30.839760075477642!3d27.99228297602038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDU5JzMyLjIiTiAzMMKwNTAnMzIuNCJF!5e0!3m2!1sen!2seg!4v1775304123946!5m2!1sen!2seg"
        },
    ];

    const categories = [
        { name: "كهربائي", icon: "fas fa-bolt" },
        { name: "سباك", icon: "fas fa-wrench" },
        { name: "نجار", icon: "fas fa-hammer" },
        { name: "حداد", icon: "fas fa-industry" },
        { name: "نقاش", icon: "fas fa-paint-roller" },
        { name: "حلاق", icon: "fas fa-scissors" }
    ];
/*
    const testimonials = [
        { text: "خدمة رائعة وتفاصيل الموقع ساعدتني أختار النجار المناسب.", name: "أبو خالد", img: "https://randomuser.me/api/portraits/men/20.jpg" },
        { text: "خريطة الموقع دقيقة جداً وسهلت علي الوصول للسباك.", name: "أم يوسف", img: "https://randomuser.me/api/portraits/women/12.jpg" }
    ];
*/
    // التحكم بين الصفحات
    const homePage = document.getElementById('homePage');
    const detailPage = document.getElementById('detailPage');
    const detailContainer = document.getElementById('detailContainer');
    
    function showHome() {
        homePage.classList.add('active-page');
        detailPage.classList.remove('active-page');
        window.scrollTo(0,0);
        renderProvidersList(currentProviders);
        closeSidebar();
    }
    
    function showDetail(providerId) {
        const provider = providers.find(p => p.id == providerId);
        if(!provider) return;
        homePage.classList.remove('active-page');
        detailPage.classList.add('active-page');
        renderDetailPage(provider);
        window.scrollTo(0,0);
        closeSidebar();
    }
    
    function renderDetailPage(provider) {
        detailContainer.innerHTML = `
            <div class="detail-container">
                <div class="detail-header">
                    <img src="${provider.cover ?? '/Herafy/bg.png'}" alt="cover">
                    <img src="${provider.avatar}" class="detail-avatar" alt="avatar">
                </div>
                <div class="detail-content">
                    <div class="detail-name">${provider.name}</div>
                    <div class="detail-job"><i class="${categories.find(c=>c.name===provider.job)?.icon || 'fas fa-tools'}"></i> ${provider.job}</div>
                    <div class="detail-bio">${provider.bio}</div>
                    
                    <h3><i class="fas fa-images"></i> معرض الأعمال</h3>
                    <div class="detail-gallery">
                        ${provider.gallery.map(img => `<img src="${img}" alt="عمل" onclick="window.open('${img}','_blank')">`).join('')}
                    </div>
                    
                    <h3><i class="fas fa-map-marker-alt"></i> موقع الخدمة</h3>
                    <iframe src="${provider.location}" style="width:100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <h3><i class="fas fa-phone-alt"></i> التواصل المباشر</h3>
                    <div class="detail-phone">📞 ${provider.phone}</div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" id="copyDetailPhone"><i class="fas fa-copy"></i> نسخ الرقم</button>
                        <button class="btn-secondary" id="backHomeFromDetail"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('copyDetailPhone').onclick = () => {
            navigator.clipboard.writeText(provider.phone);
            alert("تم نسخ رقم الهاتف: " + provider.phone);
        };
        document.getElementById('backHomeFromDetail').onclick = () => showHome();
    }
    
    let currentProviders = [...providers];
    function renderProvidersList(providersArray) {
        const container = document.getElementById('providersContainer');
        if(!container) return;
        if(providersArray.length === 0) {
            container.innerHTML = '<div class="no-results">لا يوجد حرفيون مطابقون</div>';
            return;
        }
        container.innerHTML = providersArray.map(prov => `
            <div class="provider-card" data-id="${prov.id}">
                <img class="card-img" src="${prov.avatar}" onerror="this.src='#'">
                <div class="card-content">
                    <div class="provider-name">${prov.name}</div>
                    <div class="provider-job">${prov.job}</div>
                    <p style="margin: 12px 0; color:#4b5563;">${prov.bio.substring(0, 70)}...</p>
                    <button class="btn-primary view-detail-btn" data-id="${prov.id}" style="width:100%;"><i class="fas fa-info-circle"></i> عرض التفاصيل الكاملة</button>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                showDetail(id);
            });
        });
    }
    
    function filterProviders() {
        const term = document.getElementById('searchInput').value.trim().toLowerCase();
        if(term === "") currentProviders = [...providers];
        else currentProviders = providers.filter(p => p.name.toLowerCase().includes(term) || p.job.toLowerCase().includes(term));
        renderProvidersList(currentProviders);
    }
    
    function renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        if(grid) {
            grid.innerHTML = categories.map(cat => `
                <div class="cat-card" data-cat="${cat.name}">
                    <div class="cat-icon"><i class="${cat.icon}"></i></div>
                    <h3>${cat.name}</h3>
                </div>
            `).join('');
            document.querySelectorAll('.cat-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.getElementById('searchInput').value = card.getAttribute('data-cat');
                    filterProviders();
                    document.getElementById('providersSection').scrollIntoView({ behavior: 'smooth' });
                    closeSidebar();
                });
            });
        }
    }
    /*
    function renderTestimonials() {
        const tGrid = document.getElementById('testimonialsGrid');
        if(tGrid) {
            tGrid.innerHTML = testimonials.map(t => `
                <div class="testimonial-card" style="background:white; padding:24px; border-radius:28px;">
                    <p>${t.text}</p>
                    <div style="display:flex; align-items:center; gap:12px; margin-top:16px;">
                        <img src="${t.img}" width="40" style="border-radius:50%"><strong>${t.name}</strong>
                    </div>
                </div>
            `).join('');
        }
    }
    */
    // Sidebar Functions
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarHomeBtn = document.getElementById('sidebarHomeBtn');
    
    function openSidebar() {
        sidebarMenu.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    mobileMenuToggle?.addEventListener('click', openSidebar);
    closeSidebarBtn?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);
    sidebarHomeBtn?.addEventListener('click', () => { showHome(); closeSidebar(); });
    document.querySelectorAll('[data-sidebar-page="home"]').forEach(link => {
        link.addEventListener('click', (e) => { /* e.preventDefault(); */ showHome(); closeSidebar(); });
    });
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Event listeners
    document.getElementById('searchBtn')?.addEventListener('click', filterProviders);
    document.getElementById('searchInput')?.addEventListener('keyup', (e) => { if(e.key === 'Enter') filterProviders(); });
    document.getElementById('exploreBtn')?.addEventListener('click', () => document.getElementById('providersSection').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('backToHomeBtn')?.addEventListener('click', showHome);
    document.getElementById('homeLogo')?.addEventListener('click', showHome);
    document.querySelectorAll('[data-page="home"]').forEach(el => el.addEventListener('click', (e) => { /* e.preventDefault(); */ showHome(); }));
    
    // بدء التشغيل
    renderCategories();
    renderProvidersList(providers);
    // renderTestimonials();
    currentProviders = [...providers];
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            /* e.preventDefault(); */
            showHome();
        });
    });