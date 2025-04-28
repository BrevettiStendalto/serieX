// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize carousel
    initCarousel();
    
    // Initialize form submission handler
    initContactForm();
    
    // Function to handle the appointment checkbox
    const parmaCheckbox = document.getElementById('parma-appointment');
    const parmaOptions = document.getElementById('parma-options');
    
    if (parmaCheckbox && parmaOptions) {
        parmaCheckbox.addEventListener('change', function() {
            if (this.checked) {
                parmaOptions.style.display = 'block';
            } else {
                parmaOptions.style.display = 'none';
                // Deseleziona tutti i radio button quando si deseleziona il checkbox
                const radioButtons = parmaOptions.querySelectorAll('input[type="radio"]');
                radioButtons.forEach(radio => {
                    radio.checked = false;
                });
            }
        });
    }
    
    // Inizializza il selettore di prefisso telefonico
    initPhonePrefixSelector();
});

// Function to handle scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    // Observe all fade-in elements
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Function to handle carousel
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to move to a specific slide
    function goToSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        const offset = -currentSlide * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }
    
    // Event listeners for buttons
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
}

// Function to handle form submission
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const result = document.createElement('div');
    result.id = 'result';
    result.style.marginTop = '10px';
    result.style.padding = '10px';
    result.style.display = 'none';
    
    if (contactForm) {
        // Aggiungi l'elemento result dopo il form
        contactForm.after(result);
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            result.innerHTML = "Attendere prego...";
            result.style.display = "block";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = json.message;
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Si è verificato un errore!";
            })
            .then(function() {
                contactForm.reset();
                
                // Reset appointment options
                const parmaOptions = document.getElementById('parma-options');
                if (parmaOptions) {
                    parmaOptions.style.display = 'none';
                }
                
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const body = document.body;
    
    // Add loaded class to body
    body.classList.add('loaded');
    
    // Hide loader after a short delay
    setTimeout(() => {
        loader.classList.add('hidden');
        // Remove loader from DOM after animation
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1000);
});

// Funzione per gestire il selettore di prefisso telefonico
function initPhonePrefixSelector() {
    const prefixSelectors = document.querySelectorAll('.phone-prefix-selector');
    
    prefixSelectors.forEach(selector => {
        const selectedPrefix = selector.querySelector('.selected-prefix');
        const dropdown = selector.querySelector('.prefix-dropdown');
        const prefixItems = selector.querySelectorAll('.prefix-item');
        const selectedImg = selectedPrefix.querySelector('img');
        const selectedSpan = selectedPrefix.querySelector('span');
        const hiddenInput = selector.parentElement.querySelector('input[name="phone_prefix"]');
        const searchInput = selector.querySelector('.prefix-search input');
        
        // Toggle dropdown when clicking on the selected prefix
        selectedPrefix.addEventListener('click', () => {
            selector.classList.toggle('active');
            if (selector.classList.contains('active')) {
                searchInput.focus();
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('active');
            }
        });
        
        // Handle prefix selection
        prefixItems.forEach(item => {
            item.addEventListener('click', () => {
                const prefix = item.getAttribute('data-prefix');
                const country = item.getAttribute('data-country');
                const flagSrc = item.querySelector('img').src;
                
                selectedImg.src = flagSrc;
                selectedSpan.textContent = prefix;
                hiddenInput.value = prefix;
                
                selector.classList.remove('active');
            });
        });
        
        // Handle search functionality
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchValue = searchInput.value.toLowerCase();
                
                prefixItems.forEach(item => {
                    const countryName = item.querySelector('.prefix-country').textContent.toLowerCase();
                    const prefixCode = item.querySelector('.prefix-code').textContent.toLowerCase();
                    
                    if (countryName.includes(searchValue) || prefixCode.includes(searchValue)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    });
} 