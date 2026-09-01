/**
 * BLOCKCHAIN ASSET MANAGEMENT PLATFORM - INTERACTIVE JS CONTROLLER
 * Vanilla ES6 JavaScript implementing animations, charts, drawers, and form logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZE ALL COMPONENTS ---
    initStickyNavbar();
    initMobileNav();
    initFAQAccordion();
    initCounters();
    initSvgCharts();
    initFormValidation();
    initDashboardDrawer();
    initListFilters();
    initUserCredentials();
});

/* ==========================================================================
   1. NAVIGATION & STICKY HEADER
   ========================================================================== */
function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at load
}

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks) return;

    const toggleMenu = () => {
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        const overlay = document.querySelector('.drawer-overlay');
        if (overlay) {
            if (isActive) {
                overlay.style.display = 'block';
                setTimeout(() => overlay.classList.add('active'), 10);
            } else {
                overlay.classList.remove('active');
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        }
        
        if (isActive) {
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        }
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        
        const overlay = document.querySelector('.drawer-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.style.display = 'none', 300);
        }
        
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
    };

    hamburger.addEventListener('click', toggleMenu);
    
    // Support close button inside the sliding drawer
    const drawerClose = document.querySelector('.drawer-close');
    if (drawerClose) {
        drawerClose.addEventListener('click', closeMenu);
    }

    // Dismiss menu by clicking backdrop overlay
    const overlayElement = document.querySelector('.drawer-overlay');
    if (overlayElement) {
        overlayElement.addEventListener('click', closeMenu);
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* ==========================================================================
   2. FAQ ACCORDION INTERACTIVITY
   ========================================================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-body').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                body.style.maxHeight = null;
            } else {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   3. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    const startCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.getAttribute('data-decimal') === 'true';
        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = 2000; // 2 seconds
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = progress * target;

            if (isDecimal) {
                counter.innerText = prefix + current.toFixed(2) + suffix;
            } else {
                counter.innerText = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (isDecimal) {
                    counter.innerText = prefix + target.toFixed(2) + suffix;
                } else {
                    counter.innerText = prefix + target.toLocaleString() + suffix;
                }
            }
        };

        requestAnimationFrame(animate);
    };

    // Intersection Observer to start counters only when they enter the screen viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                startCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. DYNAMIC PORTFOLIO SVG CHARTS (Donut & Area Charts)
   ========================================================================== */
function initSvgCharts() {
    // 4.1 Donut Allocation Chart
    const segments = document.querySelectorAll('.donut-segment');
    if (segments.length > 0) {
        let cumulativePercent = 0;
        segments.forEach(segment => {
            const percent = parseFloat(segment.getAttribute('data-percent'));
            const dashArray = `${percent} ${100 - percent}`;
            const dashOffset = -cumulativePercent;
            
            segment.style.strokeDasharray = dashArray;
            segment.style.strokeDashoffset = dashOffset;
            cumulativePercent += percent;
        });
    }

    // 4.2 Area History Chart (Line drawing helper)
    const lineChart = document.querySelector('.svg-line-path');
    const areaChart = document.querySelector('.svg-area-path');
    const pointsContainer = document.querySelector('.chart-points-container');

    if (lineChart && areaChart) {
        // Sample timeline data: coordinates mapping (x, y) relative to svg width 1000 and height 300
        const chartDataSets = {
            '1W': [
                { x: 50, y: 220, val: '$104,200', date: 'Mon' },
                { x: 200, y: 190, val: '$109,500', date: 'Tue' },
                { x: 350, y: 230, val: '$101,300', date: 'Wed' },
                { x: 500, y: 140, val: '$118,000', date: 'Thu' },
                { x: 650, y: 150, val: '$116,200', date: 'Fri' },
                { x: 800, y: 90, val: '$129,000', date: 'Sat' },
                { x: 950, y: 80, val: '$131,450', date: 'Sun' }
            ],
            '1M': [
                { x: 50, y: 250, val: '$92,000', date: 'Week 1' },
                { x: 275, y: 180, val: '$105,400', date: 'Week 2' },
                { x: 500, y: 210, val: '$99,100', date: 'Week 3' },
                { x: 725, y: 110, val: '$123,000', date: 'Week 4' },
                { x: 950, y: 80, val: '$131,450', date: 'Month End' }
            ],
            'ALL': [
                { x: 50, y: 260, val: '$81,000', date: '2024' },
                { x: 350, y: 210, val: '$98,500', date: 'Q1' },
                { x: 650, y: 130, val: '$115,000', date: 'Q2' },
                { x: 950, y: 80, val: '$131,450', date: 'Present' }
            ]
        };

        const tooltip = document.getElementById('chart-tooltip');

        const drawChart = (period) => {
            const data = chartDataSets[period];
            if (!data) return;

            // Generate Path String for line
            let dLine = `M ${data[0].x} ${data[0].y}`;
            for (let i = 1; i < data.length; i++) {
                dLine += ` L ${data[i].x} ${data[i].y}`;
            }

            // Generate Path String for closed area
            let dArea = `${dLine} L ${data[data.length - 1].x} 300 L ${data[0].x} 300 Z`;

            // Animate properties
            lineChart.setAttribute('d', dLine);
            areaChart.setAttribute('d', dArea);

            // Redraw points & tooltips
            if (pointsContainer) {
                pointsContainer.innerHTML = '';
                data.forEach(pt => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', pt.x);
                    circle.setAttribute('cy', pt.y);
                    circle.setAttribute('r', '6');
                    circle.setAttribute('fill', '#00f0ff');
                    circle.setAttribute('stroke', '#060b19');
                    circle.setAttribute('stroke-width', '3');
                    circle.setAttribute('style', 'cursor: pointer; transition: r 0.2s;');

                    circle.addEventListener('mouseenter', (e) => {
                        circle.setAttribute('r', '9');
                        if (tooltip) {
                            tooltip.style.opacity = '1';
                            tooltip.style.left = `${(pt.x / 1000) * 100}%`;
                            tooltip.style.top = `${(pt.y / 300) * 100 - 15}%`;
                            tooltip.innerHTML = `<strong>${pt.val}</strong><br><span style="font-size:0.75rem; color:#94a3b8">${pt.date}</span>`;
                        }
                    });

                    circle.addEventListener('mouseleave', () => {
                        circle.setAttribute('r', '6');
                        if (tooltip) tooltip.style.opacity = '0';
                    });

                    pointsContainer.appendChild(circle);
                });
            }
        };

        // Bind tabs
        const tabBtns = document.querySelectorAll('.chart-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                drawChart(btn.getAttribute('data-period'));
            });
        });

        // Initialize with default 1W
        drawChart('1W');
    }
}

/* ==========================================================================
   5. FORM VALIDATIONS & INPUT CONSTRAINTS
   ========================================================================== */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    if (!forms.length) return;

    // Apply Real-time constraints/filters
    const nameInputs = document.querySelectorAll('.validate-name');
    nameInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Keep letters and spaces only
            input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });

    const numInputs = document.querySelectorAll('.validate-number');
    numInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Keep digits only
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    });

    const amountInputs = document.querySelectorAll('.validate-amount');
    amountInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Keep numbers and single dot
            input.value = input.value.replace(/[^0-9.]/g, '');
            // Prevent multiple decimals
            const dots = input.value.match(/\./g);
            if (dots && dots.length > 1) {
                input.value = input.value.substring(0, input.value.lastIndexOf('.'));
            }
        });
    });

    // Eye icon toggle password viewability
    const eyeIcons = document.querySelectorAll('.password-eye');
    eyeIcons.forEach(eye => {
        eye.addEventListener('click', () => {
            const wrapper = eye.closest('.password-wrapper');
            if (!wrapper) return;
            const input = wrapper.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                eye.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
            } else {
                input.type = 'password';
                eye.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zM12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`;
            }
        });
    });

    // Form Submit Event Handlers
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;

            // 1. Check required fields
            const required = form.querySelectorAll('[required]');
            required.forEach(input => {
                if (!input.value.trim()) {
                    showInputError(input, 'This field is required');
                    isValid = false;
                } else {
                    clearInputError(input);
                }
            });

            // 2. Validate Emails
            const emails = form.querySelectorAll('.validate-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emails.forEach(input => {
                if (input.value.trim() && !emailRegex.test(input.value)) {
                    showInputError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            });

            // 3. Validate amounts
            const amounts = form.querySelectorAll('.validate-amount');
            amounts.forEach(input => {
                if (input.value.trim()) {
                    const parsed = parseFloat(input.value);
                    if (isNaN(parsed) || parsed < 0) {
                        showInputError(input, 'Amount must be positive');
                        isValid = false;
                    }
                }
            });

            // 4. Validate registration password match
            const password = form.querySelector('#reg-pass');
            const confirmPass = form.querySelector('#reg-confirm-pass');
            if (password && confirmPass) {
                if (password.value !== confirmPass.value) {
                    showInputError(confirmPass, 'Passwords do not match');
                    isValid = false;
                }
            }

            if (!isValid) {
                e.preventDefault(); // Stop submission
            } else {
                // Mock success alert on contact/login forms
                if (form.classList.contains('mock-submission')) {
                    e.preventDefault();
                    showGlobalToast('Action processed successfully (Demo Prototype Mode)');
                    form.reset();
                }
            }
        });
    });
}

function showInputError(input, message) {
    input.classList.add('invalid');
    let errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('form-error')) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'form-error';
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    errorSpan.innerText = message;
    errorSpan.style.display = 'block';
}

function clearInputError(input) {
    input.classList.remove('invalid');
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('form-error')) {
        errorSpan.style.display = 'none';
    }
}

function showGlobalToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.setAttribute('style', `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #10b981;
            color: #ffffff;
            padding: 16px 28px;
            border-radius: 8px;
            font-size: 0.92rem;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 0;
            transform: translateY(20px);
        `);
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3500);
}

/* ==========================================================================
   6. DASHBOARD MOBILE DRAWER
   ========================================================================== */
function initDashboardDrawer() {
    const dbHamburger = document.querySelector('.db-hamburger');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const links = document.querySelectorAll('.sidebar-item');
    let overlay = document.querySelector('.sidebar-overlay');

    if (!dbHamburger || !sidebar) return;

    // Create overlay if not present
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.querySelector('.dashboard-container').appendChild(overlay);
    }

    const openDrawer = () => {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = '1', 50);
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
    };

    const closeDrawer = () => {
        sidebar.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
    };

    dbHamburger.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close when a link inside is clicked
    links.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close using Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });
}

/* ==========================================================================
   7. LIST FILTERS (Assets list, Transaction lists)
   ========================================================================== */
function initListFilters() {
    // 7.1 Filter Assets (assets.html)
    const assetRows = document.querySelectorAll('.asset-list-row');
    const assetSearch = document.getElementById('asset-search-input');
    const categoryFilter = document.getElementById('category-filter-select');
    const networkFilter = document.getElementById('network-filter-select');

    if (assetRows.length > 0) {
        const filterAssets = () => {
            const query = assetSearch ? assetSearch.value.toLowerCase().trim() : '';
            const category = categoryFilter ? categoryFilter.value : 'all';
            const network = networkFilter ? networkFilter.value : 'all';

            assetRows.forEach(row => {
                const name = row.getAttribute('data-name').toLowerCase();
                const symbol = row.getAttribute('data-symbol').toLowerCase();
                const cat = row.getAttribute('data-category');
                const net = row.getAttribute('data-network');

                const matchesQuery = name.includes(query) || symbol.includes(query);
                const matchesCategory = category === 'all' || cat === category;
                const matchesNetwork = network === 'all' || net === network;

                if (matchesQuery && matchesCategory && matchesNetwork) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        if (assetSearch) assetSearch.addEventListener('input', filterAssets);
        if (categoryFilter) categoryFilter.addEventListener('change', filterAssets);
        if (networkFilter) networkFilter.addEventListener('change', filterAssets);
    }

    // 7.2 Filter Transactions (transactions.html / dashboards)
    const txRows = document.querySelectorAll('.tx-list-row');
    const txSearch = document.getElementById('tx-search-input');
    const txTypeFilter = document.getElementById('tx-type-filter-select');
    const txStatusFilter = document.getElementById('tx-status-filter-select');

    if (txRows.length > 0) {
        const filterTx = () => {
            const query = txSearch ? txSearch.value.toLowerCase().trim() : '';
            const type = txTypeFilter ? txTypeFilter.value : 'all';
            const status = txStatusFilter ? txStatusFilter.value : 'all';

            txRows.forEach(row => {
                const asset = row.getAttribute('data-asset').toLowerCase();
                const txId = row.getAttribute('data-txid').toLowerCase();
                const rType = row.getAttribute('data-type');
                const rStatus = row.getAttribute('data-status');

                const matchesQuery = asset.includes(query) || txId.includes(query);
                const matchesType = type === 'all' || rType === type;
                const matchesStatus = status === 'all' || rStatus === status;

                if (matchesQuery && matchesType && matchesStatus) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        if (txSearch) txSearch.addEventListener('input', filterTx);
        if (txTypeFilter) txTypeFilter.addEventListener('change', filterTx);
        if (txStatusFilter) txStatusFilter.addEventListener('change', filterTx);
    }
}

/* ==========================================================================
   8. USER CREDENTIALS & SESSION SYNC
   ========================================================================== */
function initUserCredentials() {
    const savedName = localStorage.getItem('user_full_name');
    const savedEmail = localStorage.getItem('user_login_email');
    const savedRole = localStorage.getItem('user_selected_role');

    if (savedName) {
        document.querySelectorAll('.user-display-name').forEach(el => el.innerText = savedName);
    }
    if (savedEmail) {
        document.querySelectorAll('.user-display-email').forEach(el => el.innerText = savedEmail);
    }
    if (savedRole) {
        document.querySelectorAll('.user-display-role').forEach(el => el.innerText = savedRole);
    }
}
