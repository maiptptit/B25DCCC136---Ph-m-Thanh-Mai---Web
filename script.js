document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Tự động khởi tạo 23 Dự án
    // ==========================================
    const categories = ['web', 'mobile', 'design'];
    const projectsData = Array.from({ length: 23 }, (_, index) => {
        const id = index + 1;
        const category = categories[index % categories.length];
        return {
            id: id,
            title: `Dự Án ${id}`,
            category: category,
            description: `Mô tả chi tiết cho sản phẩm dự án thứ ${id} xây dựng trên nền tảng ${category.toUpperCase()}.`
        };
    });

    const projectsGrid = document.getElementById('projects-grid');

    function renderProjects(data) {
        projectsGrid.innerHTML = '';
        if (data.length === 0) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy dự án phù hợp.</p>';
            return;
        }

        data.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-img">Project #${proj.id}</div>
                <div class="project-info">
                    <span class="project-tag">${proj.category}</span>
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    renderProjects(projectsData);

    // ==========================================
    // TÍNH NĂNG 1: Menu Hamburger (Mobile Nav)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Tự đóng menu khi click vào link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // TÍNH NĂNG 2: Dark / Light Mode Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Kiểm tra theme đã lưu trong LocalStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (currentTheme !== 'dark') {
            newTheme = 'dark';
            themeToggleBtn.textContent = '☀️';
        } else {
            themeToggleBtn.textContent = '🌙';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================
    // TÍNH NĂNG 3: Lọc & Tìm kiếm dự án
    // ==========================================
    const searchInput = document.getElementById('project-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterProjects() {
        const filtered = projectsData.filter(proj => {
            const matchesCategory = (currentCategory === 'all') || (proj.category === currentCategory);
            const matchesSearch = proj.title.toLowerCase().includes(currentSearchTerm) || 
                                  proj.description.toLowerCase().includes(currentSearchTerm) ||
                                  proj.category.toLowerCase().includes(currentSearchTerm);
            return matchesCategory && matchesSearch;
        });
        renderProjects(filtered);
    }

    // Lọc theo Từ khóa
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterProjects();
    });

    // Lọc theo Tag Button
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCategory = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    // ==========================================
    // TÍNH NĂNG 4: Đếm ký tự (Char Counter)
    // ==========================================
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('char-count');
    const maxChars = messageInput.getAttribute('maxlength') || 300;

    messageInput.addEventListener('input', () => {
        const count = messageInput.value.length;
        charCountDisplay.textContent = `${count} / ${maxChars}`;
    });

    // ==========================================
    // TÍNH NĂNG 5: Validate Form (Nhiều điều kiện)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        formStatus.textContent = '';

        // Validate Name
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Vui lòng nhập họ tên.';
            isValid = false;
        } else if (nameInput.value.trim().length < 3) {
            nameError.textContent = 'Họ tên phải chứa ít nhất 3 ký tự.';
            isValid = false;
        }

        // Validate Email
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Vui lòng nhập email.';
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            emailError.textContent = 'Địa chỉ email không đúng định dạng.';
            isValid = false;
        }

        // Validate Message
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Nội dung tin nhắn không được để trống.';
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Tin nhắn quá ngắn (tối thiểu 10 ký tự).';
            isValid = false;
        }

        // Nếu hợp lệ
        if (isValid) {
            formStatus.style.color = '#10b981';
            formStatus.textContent = 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.';
            contactForm.reset();
            charCountDisplay.textContent = `0 / ${maxChars}`;
        }
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Scroll Reveal bằng IntersectionObserver API
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});
