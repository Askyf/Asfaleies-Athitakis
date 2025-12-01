// Main JavaScript for Insurance Website

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionalities
    initMobileMenu();
    initProducts();
    initFAQ();
    initContactForm();
    initCategoryFilters();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').classList.add('fa-bars');
                navToggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }
}

// Load and Display Products
function initProducts() {
    const productsContainer = document.getElementById('productsContainer');
    
    if (!productsContainer) return;
    
    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            setupFiltering(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = `
                <div class="error-message">
                    <p>Δεν ήταν δυνατή η φόρτωση των προϊόντων. Παρακαλώ δοκιμάστε ξανά αργότερα.</p>
                </div>
            `;
        });
}

// Display Products in Grid
function displayProducts(products, filter = 'all') {
    const productsContainer = document.getElementById('productsContainer');
    
    // Filter products if needed
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    // Check if there are products
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Δεν βρέθηκαν προϊόντα</h3>
                <p>Δοκιμάστε διαφορετική κατηγορία.</p>
            </div>
        `;
        return;
    }
    
    // Create product cards
    const productsHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <i class="${product.icon}"></i>
                <h3>${product.name}</h3>
            </div>
            <div class="product-body">
                <div class="price">${product.price}</div>
                <p class="description">${product.description}</p>
                <ul class="features">
                    ${product.features.map(feature => `
                        <li><i class="fas fa-check"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <button class="btn-primary request-quote" data-product="${product.name}">
                    <i class="fas fa-file-alt"></i> Ζήτησε Προσφορά
                </button>
            </div>
        </div>
    `).join('');
    
    productsContainer.innerHTML = productsHTML;
    
    // Add event listeners to quote buttons
    document.querySelectorAll('.request-quote').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            showQuoteModal(productName);
        });
    });
}

// Setup Filtering Functionality
function setupFiltering(products) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            displayProducts(products, filter);
            
            // Animate category cards
            animateCategoryCards(filter);
        });
    });
}

// Category Cards Animation
function initCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update filter buttons
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            const activeButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
                
                // Trigger click event
                activeButton.click();
                
                // Scroll to products section
                document.getElementById('products').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function animateCategoryCards(filter) {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filter === 'all' || cardCategory === filter) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        }
    });
}

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            productInterest: document.getElementById('productInterest').value,
            message: document.getElementById('message').value.trim(),
            consent: document.getElementById('consent').checked
        };
        
        // Validate form
        if (validateForm(formData)) {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Αποστολή...';
            submitBtn.disabled = true;
            
            // Simulate API call (in real app, this would be fetch to server)
            setTimeout(() => {
                // Show success message
                showFormMessage('Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

// Form Validation
function validateForm(formData) {
    const messageDiv = document.getElementById('formMessage');
    
    // Reset previous messages
    messageDiv.className = 'form-message';
    messageDiv.textContent = '';
    
    // Check required fields
    if (!formData.name || !formData.email) {
        showFormMessage('Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία (*)', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Παρακαλώ εισάγετε ένα έγκυρο email', 'error');
        return false;
    }
    
    // Check consent
    if (!formData.consent) {
        showFormMessage('Πρέπει να συναινέσετε στην επεξεργασία των δεδομένων σας', 'error');
        return false;
    }
    
    return true;
}

// Show Form Message
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Quote Modal (simplified)
function showQuoteModal(productName) {
    // In a real implementation, this would show a modal
    // For now, we'll scroll to contact form and pre-fill product interest
    const productSelect = document.getElementById('productInterest');
    
    // Map product names to values
    const productMap = {
        'Ολοκληρωμένη Ασφάλεια Υγείας': 'health',
        'Αστική Ευθύνη Οχήματος': 'car',
        'Ασφάλεια Κατοικίας': 'home',
        'Ασφάλεια Ζωής': 'life'
    };
    
    if (productMap[productName]) {
        productSelect.value = productMap[productName];
    }
    
    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Focus on name field
    document.getElementById('name').focus();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
});