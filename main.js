// Update copyright year
document.getElementById("year").innerHTML = new Date().getFullYear();

// ====== UTILITY FUNCTIONS ======
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ====== DARK MODE TOGGLE ======
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
  });
}

// ====== TOAST NOTIFICATION ======
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ====== SCROLL PROGRESS BAR ======
const updateScrollProgress = debounce(() => {
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercentage + '%';
}, 10);

window.addEventListener('scroll', updateScrollProgress);

// ====== PROGRESS DOTS ======
function initProgressDots() {
  const dots = document.querySelectorAll('.progress-dot');
  const sections = document.querySelectorAll('section[id]');
  
  // Click handler for dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Update active dot on scroll
  const updateActiveDot = debounce(() => {
    let current = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    dots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === current) {
        dot.classList.add('active');
      }
    });
  }, 50);
  
  window.addEventListener('scroll', updateActiveDot);
}

// ====== BACK TO TOP BUTTON ======
function handleBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  const toggleVisibility = debounce(() => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, 50);
  
  window.addEventListener('scroll', toggleVisibility);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ====== ACTIVE NAVIGATION LINK ======
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const highlightNav = debounce(() => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 50);
  
  window.addEventListener('scroll', highlightNav);
}

// ====== SCROLL REVEAL ANIMATION ======
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealOnScroll = debounce(() => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach((element, index) => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100;
      
      if (elementTop < windowHeight - revealPoint) {
        // Add staggered delay based on index
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * 100);
      }
    });
  }, 50);
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check on load
}

// ====== HAMBURGER MENU ======
function initializeHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  // Toggle menu on hamburger click
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = this.classList.contains('active');
    this.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on a nav link
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ====== CURSOR SPOTLIGHT EFFECT ======
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-spotlight');
  const heroSection = document.querySelector('.top-container');
  
  if (!spotlight || !heroSection) return;
  
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    spotlight.style.left = x + 'px';
    spotlight.style.top = y + 'px';
    spotlight.style.opacity = '1';
  });
  
  heroSection.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });
}

// ====== PROFILE IMAGE EASTER EGG ======
function initProfileImageEasterEgg() {
  const profileImg = document.getElementById('profile-img');
  let clickCount = 0;
  
  if (!profileImg) return;
  
  profileImg.addEventListener('click', () => {
    clickCount++;
    profileImg.style.transform = `scale(${1 + clickCount * 0.05}) rotate(${clickCount * 10}deg)`;
    
    if (clickCount === 5) {
      showToast('🎉 You found the easter egg! Keep exploring!');
      profileImg.style.transition = 'transform 1s ease';
      setTimeout(() => {
        profileImg.style.transform = 'scale(1) rotate(0deg)';
        clickCount = 0;
      }, 1000);
    }
    
    setTimeout(() => {
      if (clickCount < 5) {
        profileImg.style.transform = 'scale(1) rotate(0deg)';
      }
    }, 300);
  });
}

// ====== PROGRAMMING LANGUAGE ICONS ======
const languageIcons = {
  'JavaScript': '🟨',
  'Python': '🐍',
  'Java': '☕',
  'C': '©️',
  'C++': '⚙️',
  'C#': '#️⃣',
  'HTML': '🌐',
  'CSS': '🎨',
  'PHP': '🐘',
  'Ruby': '💎',
  'Go': '🐹',
  'Rust': '🦀',
  'Swift': '🍎',
  'Kotlin': '🅺',
  'TypeScript': '🔷',
  'R': '📊',
  'Dart': '🎯',
  'Shell': '🐚',
  'Jupyter Notebook': '📓',
  'default': '💻'
};

// ====== GOOGLE DRIVE CERTIFICATES ======
const certificates = [
  {
    id: '1W4Sg0y2ywq3OcN3nvpOTngudIcnwBzcr',
    name: 'Agentic AI Fundamentals: Architecture, Frameworks And Applications '
  },
  
  {
    id: '1vy3E8hd_01TPM-5EMyfWEwY13Wx3FsW9',
    name: 'Machine Learning Specialization By Andrew Ng '
  },
  
  {
    id: '1MJONXPyBZcidSomsGsPVZrM0Un9J6fhT',
    name: 'Unsupervised Machine Learning Algorithm By Andrew Ng'
  },
  
  {
    id: '1oILyQLkdYlAXzRgMnAxTedwiv-Eodfpm',
    name: 'Advanced Learning Algorithm By Andrew Ng'
  },
  {
    id: '1fK_uopU078aZ7yp8fo2ySVADXQm1U1sa',
    name: 'Supervised Machine Learning By Andrew Ng'
  },
  {
    id: '1sK2849ss701eUOXnIxz_fmjwlEvyLckx',
    name: 'Machine Learning A-Z'
  },
  {
    id: '1Hz4SJPa2pmicrZcu-Alp-2q-dddZilsr',
    name: 'What is Generative AI ?'
  }
  
];

// ====== FETCH GITHUB PROJECTS ======
async function fetchGitHubProjects() {
  const username = 'prakharpd';
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
  
  const projectsContainer = document.getElementById('projects-container');
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    
    // Clear skeleton loading
    projectsContainer.innerHTML = '';
    
    // Check if user has any repositories
    if (repos.length === 0) {
      projectsContainer.innerHTML = '<p class="error-text">No repositories found.</p>';
      return;
    }
    
    // Create project tiles with stagger animation
    repos.forEach((repo, index) => {
      const projectTile = createProjectTile(repo);
      projectTile.style.opacity = '0';
      projectTile.style.transform = 'translateY(30px)';
      projectsContainer.appendChild(projectTile);
      
      // Stagger animation
      setTimeout(() => {
        projectTile.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        projectTile.style.opacity = '1';
        projectTile.style.transform = 'translateY(0)';
      }, index * 150);
    });
    
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    projectsContainer.innerHTML = '<p class="error-text">Unable to load projects. Please try again later.</p>';
  }
}

// ====== CREATE PROJECT TILE ======
function createProjectTile(repo) {
  const tile = document.createElement('a');
  tile.href = repo.html_url;
  tile.target = '_blank';
  tile.rel = 'noopener noreferrer';
  tile.className = 'project-tile';
  
  // Get language icon
  const language = repo.language || 'default';
  const icon = languageIcons[language] || languageIcons['default'];
  
  // Create description preview
  const description = repo.description || 'No description available';
  const truncatedDesc = description.length > 80 ? description.substring(0, 80) + '...' : description;
  
  // Stars and forks
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  
  tile.innerHTML = `
    <div class="project-logo">${icon}</div>
    <div class="project-content">
      <div class="project-name">${repo.name}</div>
      <div class="project-description">${truncatedDesc}</div>
      <div class="project-stats">
        <span class="stat">⭐ ${stars}</span>
        <span class="stat">🔀 ${forks}</span>
      </div>
    </div>
  `;
  
  return tile;
}

// ====== LOAD CERTIFICATES ======
function loadCertificates() {
  const certificatesContainer = document.getElementById('certificates-container');
  
  certificates.forEach((cert, index) => {
    const tile = createCertificateTile(cert);
    tile.style.opacity = '0';
    tile.style.transform = 'translateY(30px)';
    certificatesContainer.appendChild(tile);
    
    // Stagger animation
    setTimeout(() => {
      tile.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      tile.style.opacity = '1';
      tile.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

// ====== CREATE CERTIFICATE TILE ======
function createCertificateTile(cert) {
  const tile = document.createElement('div');
  tile.className = 'certificate-tile';
  tile.title = cert.name;
  tile.setAttribute('role', 'button');
  tile.setAttribute('tabindex', '0');
  
  // Use Google Drive thumbnail API
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${cert.id}&sz=w400`;
  
  tile.innerHTML = `
    <img src="${thumbnailUrl}" alt="${cert.name}" loading="lazy" />
    <div class="certificate-overlay">
      <span class="view-icon">👁️</span>
      <p>${cert.name}</p>
    </div>
  `;
  
  // Click handler to open modal
  const openModal = () => {
    openCertificateModal(cert);
  };
  
  tile.addEventListener('click', openModal);
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });
  
  return tile;
}

// ====== CERTIFICATE MODAL ======
function openCertificateModal(cert) {
  const modal = document.getElementById('certificate-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  
  // High quality image URL
  const imageUrl = `https://drive.google.com/thumbnail?id=${cert.id}&sz=w1000`;
  
  modalImage.src = imageUrl;
  modalImage.alt = cert.name;
  modalTitle.textContent = cert.name;
  
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus trap
  modal.querySelector('.modal-close').focus();
}

function closeCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  closeBtn.addEventListener('click', closeCertificateModal);
  overlay.addEventListener('click', closeCertificateModal);
  
  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeCertificateModal();
    }
  });
}

// ====== INTERACTIVE TILES (MOBILE) ======
// REPLACE the entire initializeInteractiveTiles() function with this code:
// (Find it around line 140 in main.js and replace everything until the closing brace)

// Add click/tap functionality for experience and skill tiles
function initializeInteractiveTiles() {
  const tiles = document.querySelectorAll('.experience-tile, .skill-tile');
  
  // Create modal overlay if it doesn't exist
  let modalOverlay = document.querySelector('.modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }
  
  tiles.forEach(tile => {
    tile.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Check if mobile (≤900px)
      if (window.innerWidth <= 900) {
        // Open modal on mobile
        openModal(tile);
      } else {
        // Desktop: use flip animation with active class
        tiles.forEach(otherTile => {
          if (otherTile !== tile) {
            otherTile.classList.remove('active');
          }
        });
        this.classList.toggle('active');
      }
    });
    
    // Keyboard support
    tile.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        
        if (window.innerWidth <= 900) {
          openModal(tile);
        } else {
          tiles.forEach(otherTile => {
            if (otherTile !== tile) {
              otherTile.classList.remove('active');
            }
          });
          this.classList.toggle('active');
        }
      }
    });
  });
  
  // Close tiles when clicking outside (desktop only)
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.experience-tile') && 
        !e.target.closest('.skill-tile') && 
        window.innerWidth > 900) {
      tiles.forEach(tile => {
        tile.classList.remove('active');
      });
    }
  });
}

// Open modal with tile content
function openModal(tile) {
  const modalOverlay = document.querySelector('.modal-overlay');
  const backContent = tile.querySelector('.experience-back, .skill-back');
  
  if (!backContent) return;
  
  // Create modal content
  const modalHTML = createModalContent(backContent, tile);
  
  modalOverlay.innerHTML = `
    <div class="modal-container">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      ${modalHTML}
    </div>
  `;
  
  // Show modal
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
  
  // Close button handler
  const closeBtn = modalOverlay.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeModal);
  
  // Close on overlay click
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  
  // Close on Escape key
  const escapeHandler = function(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Close modal
function closeModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  modalOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
  
  // Clear modal content after animation
  setTimeout(() => {
    modalOverlay.innerHTML = '';
  }, 300);
}

// Create modal content from tile back content
function createModalContent(backContent, tile) {
  const isSkillTile = tile.classList.contains('skill-tile');
  const iconElement = tile.querySelector('.company-icon img, .skill-icon img');
  const iconSrc = iconElement ? iconElement.src : '';
  const iconAlt = iconElement ? iconElement.alt : '';
  const title = backContent.querySelector('h3')?.textContent || '';
  
  // Clone the back content
  const contentClone = backContent.cloneNode(true);
  
  // Remove the h3 and icon since we'll add them to header
  const h3 = contentClone.querySelector('h3');
  if (h3) h3.remove();
  
  const iconSmall = contentClone.querySelector('.company-icon-small, .skill-icon-small');
  if (iconSmall) iconSmall.remove();
  
  return `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-icon ${isSkillTile ? 'round' : ''}">
          <img src="${iconSrc}" alt="${iconAlt}" />
        </div>
        <h3 class="modal-title">${title}</h3>
      </div>
      <div class="modal-body">
        ${contentClone.innerHTML}
      </div>
    </div>
  `;
}

  
  

// ====== SMOOTH SCROLL FOR NAV LINKS ======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Only prevent default for internal links
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 90; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ====== PARALLAX EFFECT FOR CLOUDS ======
function initParallaxEffect() {
  const topCloud = document.querySelector('.top-cloud');
  const bottomCloud = document.querySelector('.bottom-cloud');
  
  if (topCloud && bottomCloud) {
    const parallax = debounce(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      topCloud.style.transform = `translateY(${rate}px)`;
      bottomCloud.style.transform = `translateY(${rate * 0.8}px)`;
    }, 10);
    
    window.addEventListener('scroll', parallax);
  }
}

// ====== TYPING ANIMATION ======
function initTypingAnimation() {
  const texts = ['pro' ];
  const typingElement = document.querySelector('h2');
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  if (!typingElement) return;
  
  function type() {
    const currentText = texts[textIndex];
    const proSpan = typingElement.querySelector('.pro');
    const cursor = typingElement.querySelector('.typing-cursor');
    
    if (isDeleting) {
      proSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      proSpan.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  // Start typing animation after page loads
  setTimeout(() => {
    type();
  }, 2000);
}

// ====== BUTTON RIPPLE EFFECT ======
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// ====== LAZY LOAD IMAGES ======
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger load
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// ====== INITIALIZE ALL ON DOM LOAD ======
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  fetchGitHubProjects();
  loadCertificates();
  initializeInteractiveTiles();
  initializeHamburgerMenu();
  handleBackToTop();
  updateActiveNavLink();
  initScrollReveal();
  initSmoothScroll();
  initParallaxEffect();
  initProgressDots();
  initCertificateModal();
  
  // Enhanced features
  initThemeToggle();
  initCursorSpotlight();
  initProfileImageEasterEgg();
  initTypingAnimation();
  initButtonRipple();
  initLazyLoading();
  
  // Trigger initial scroll progress update
  updateScrollProgress();
  
  // Show welcome toast
  setTimeout(() => {
    showToast('👋 Welcome to my portfolio!');
  }, 1000);
});

// Mobile & keyboard flip support
const flipCards = document.querySelectorAll(
  ".experience-tile, .skill-tile"
);

flipCards.forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});




