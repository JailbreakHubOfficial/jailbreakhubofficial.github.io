document.addEventListener('DOMContentLoaded', function () {
    // --- State Variables ---
    let currentNewsDataString = '';
    let fullNewsData = [];
    let currentPage = 1;
    const articlesPerPage = 3;

    // --- Jailbreak Data for Checker ---
    const jailbreakData = {
        'iphone 14': { '16': 'Dopamine', '15': 'Dopamine / XinaA15' },
        'iphone 13': { '16': 'Dopamine', '15': 'Dopamine / XinaA15' },
        'iphone 12': { '16': 'Dopamine', '15': 'Dopamine / XinaA15' },
        'iphone 11': { '15': 'Dopamine / XinaA15', '14': 'Unc0ver / Taurine' },
        'iphone xs': { '15': 'Dopamine / XinaA15', '14': 'Unc0ver / Taurine' },
        'iphone xr': { '15': 'Dopamine / XinaA15', '14': 'Unc0ver / Taurine' },
        'iphone x': { '17': 'Palera1n', '16': 'Palera1n', '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver', '11': 'Unc0ver / Electra' },
        'iphone 8': { '17': 'Palera1n', '16': 'Palera1n', '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver', '11': 'Unc0ver / Electra' },
        'iphone 8 plus': { '17': 'Palera1n', '16': 'Palera1n', '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver', '11': 'Unc0ver / Electra' },
        'iphone 7': { '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver' },
        'iphone 7 plus': { '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver' },
        'iphone 6s': { '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver', '11': 'Unc0ver / Electra' },
        'iphone 6s plus': { '15': 'Palera1n', '14': 'checkra1n', '13': 'checkra1n / Unc0ver', '12': 'checkra1n / Unc0ver', '11': 'Unc0ver / Electra' }
    };

    // --- Page Elements ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const latestNewsContainer = document.getElementById('latest-news-container');
    const newsArchiveContainer = document.getElementById('news-archive-container');
    const paginationContainer = document.getElementById('pagination-container');
    const checkerDeviceInput = document.getElementById('checker-device-input');
    const checkerIosInput = document.getElementById('checker-ios-input');
    const checkerButton = document.getElementById('checker-button');
    const checkerResultText = document.getElementById('checker-result-text');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- News and Pagination Rendering ---
    function renderNews(newsData) {
        // --- Render Homepage News (always first 3) ---
        latestNewsContainer.innerHTML = '';
        const latestArticles = newsData.slice(0, 3);
        latestArticles.forEach(article => {
            const articleHtml = `
                <div class="news-card rounded-lg overflow-hidden">
                    <div class="p-6">
                        <p class="text-sm text-gray-400 mb-2">${article.date}</p>
                        <h3 class="text-xl font-bold mb-3">${article.title}</h3>
                        <p class="text-gray-300 mb-4">${article.summary}</p>
                        <a href="#news" class="font-semibold accent-color page-link">Read More &rarr;</a>
                    </div>
                </div>
            `;
            latestNewsContainer.innerHTML += articleHtml;
        });

        // --- Render News Archive (Paginated) ---
        newsArchiveContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const paginatedArticles = newsData.slice(startIndex, endIndex);
        
        paginatedArticles.forEach(article => {
            const articleHtml = `
                <article>
                    <p class="text-sm text-gray-400 mb-2">${article.date}</p>
                    <h2 class="text-3xl font-bold mb-3 accent-color">${article.title}</h2>
                    <p class="text-gray-300 leading-relaxed">${article.content}</p>
                </article>
            `;
            newsArchiveContainer.innerHTML += articleHtml;
        });
    }

    function renderPagination(totalArticles) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalArticles / articlesPerPage);

        if (totalPages <= 1) return;

        const prevDisabled = currentPage === 1;
        paginationContainer.innerHTML += `<button class="pagination-btn" data-page="prev" ${prevDisabled ? 'disabled' : ''}>&larr; Previous</button>`;

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationContainer.innerHTML += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        const nextDisabled = currentPage === totalPages;
        paginationContainer.innerHTML += `<button class="pagination-btn" data-page="next" ${nextDisabled ? 'disabled' : ''}>Next &rarr;</button>`;
    }

    // --- Page Navigation Logic ---
    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
        }
        navLinks.forEach(link => {
            const isPageLink = link.classList.contains('page-link');
            if (isPageLink && link.getAttribute('href') === `#${pageId}`) {
                 link.classList.add('active');
            } else if (isPageLink) {
                 link.classList.remove('active');
            }
        });
        mobileMenu.classList.add('hidden');
    };

    // --- Mobile Menu Toggle ---
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Close Mobile Menu on Outside Click ---
    document.addEventListener('click', function(event) {
      // Check if the mobile menu is currently open
      const isMenuOpen = !mobileMenu.classList.contains('hidden');
      
      // Check if the click occurred inside the menu area
      const isClickInsideMenu = mobileMenu.contains(event.target);

      // Check if the click was on the menu button itself (or the icon inside it)
      const isClickOnMenuButton = mobileMenuButton.contains(event.target);

      // If the menu is open AND the click was not inside the menu AND it was not on the button, then hide the menu.
      if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuButton) {
        mobileMenu.classList.add('hidden');
      }
    });

    // --- Data Loading and Polling ---
    async function checkForNewsUpdates() {
        try {
            const response = await fetch(`news.json?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const newsData = await response.json();
            const newNewsDataString = JSON.stringify(newsData);

            if (newNewsDataString !== currentNewsDataString) {
                console.log('News update found! Rendering new content.');
                currentNewsDataString = newNewsDataString;
                fullNewsData = newsData;
                renderNews(fullNewsData);
                renderPagination(fullNewsData.length);
            } else {
                 console.log('No new news. Checked at ' + new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error("Could not fetch or render news data:", error);
            latestNewsContainer.innerHTML = `<p class="text-red-500 text-center col-span-3">Failed to load news articles.</p>`;
            newsArchiveContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load news archive.</p>`;
        }
    }

    // --- Event Delegation for Navigation ---
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('a.page-link');
        if (link) {
            e.preventDefault();
            const targetPageId = link.getAttribute('href').substring(1);
            if (targetPageId) {
                if (targetPageId === 'news') {
                    currentPage = 1;
                    renderNews(fullNewsData);
                    renderPagination(fullNewsData.length);
                }
                showPage(targetPageId);
            }
        }
    });

    // --- Event Listener for Pagination ---
    paginationContainer.addEventListener('click', function(e) {
        const target = e.target.closest('.pagination-btn');
        if (!target || target.disabled) return;

        const pageAction = target.dataset.page;
        
        if (pageAction === 'prev') {
            if (currentPage > 1) currentPage--;
        } else if (pageAction === 'next') {
            if (currentPage < Math.ceil(fullNewsData.length / articlesPerPage)) currentPage++;
        } else {
            currentPage = parseInt(pageAction);
        }
        
        renderNews(fullNewsData);
        renderPagination(fullNewsData.length);
        window.scrollTo(0, 0);
    });
    
    // --- Jailbreak Checker Logic ---
    checkerButton.addEventListener('click', function() {
        const device = checkerDeviceInput.value.toLowerCase().trim();
        const iosVersion = checkerIosInput.value.trim();
        const majorIosVersion = iosVersion.split('.')[0];

        if (!device || !iosVersion) {
            checkerResultText.textContent = 'Please enter both a device and iOS version.';
            checkerResultText.className = 'text-gray-300';
            return;
        }

        const deviceData = jailbreakData[device];

        if (deviceData) {
            const jailbreakTool = deviceData[majorIosVersion];
            if (jailbreakTool) {
                checkerResultText.textContent = `Supported by ${jailbreakTool}.`;
                checkerResultText.className = 'status-supported';
            } else {
                checkerResultText.textContent = 'Not Supported for this iOS version.';
                checkerResultText.className = 'status-not-supported';
            }
        } else {
            checkerResultText.textContent = 'Compatibility data not found for this device.';
            checkerResultText.className = 'status-in-progress';
        }
    });

    // --- Contact Form Logic ---
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            formStatus.innerHTML = '';
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('http://localhost:3000/send-message', {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });

                if (response.ok) {
                    formStatus.innerHTML = `<p class="status-supported">Message sent successfully!</p>`;
                    contactForm.reset();
                } else {
                    formStatus.innerHTML = `<p class="status-not-supported">An error occurred. Please try again later.</p>`;
                }
            } catch (error) {
                console.error('Contact form submission error:', error);
                formStatus.innerHTML = `<p class="status-not-supported">Could not send message. Please check your connection.</p>`;
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }


    // --- Initial Load ---
    checkForNewsUpdates();
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);

    // --- Set up Polling ---
    setInterval(checkForNewsUpdates, 10000);
});
