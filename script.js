/*===========================================
  PORTFOLIO WEBSITE JAVASCRIPT
  Author: Ravi Chaudhary
  Description: Interactive functionality for portfolio website
===========================================*/

/*-------------------------------------------
  ABOUT SECTION - Resume Functions
-------------------------------------------*/
// Password protected resume editing function
// function validateAndEdit() {
//   const password = prompt("Please enter the password to Edit resume:");
//   if (password === "9580156837") {
//     window.open("https://1drv.ms/w/c/75a4b93c1d7f31cf/Ec8xfx08uaQggHVpHgAAAAABSMC7xsM_ZJXLJ_i3AYiZNw?e=rhYco9", "_blank");
//   } else {
//     alert("Invalid password. Access denied.");
//   }
// }
async function validateValue() {
  const url = "https://script.google.com/macros/s/AKfycbzsLpYBd1JNvlpK8Zvlo1Ow1pVCHvjkxhMwpVatZkcsTDj2aIQKQ0nSJkIDagIgXbgd/exec";

  try {
    // Fetch value from Google Sheets
    let response = await fetch(url);
    let sheetValue = await response.text();

    // Ask user for input
    let userInput = prompt("Enter value to validate:");

    if (userInput === null) return; // user pressed cancel

    if (userInput === sheetValue) {
      alert("✅ Password Matches!");
      window.open("https://1drv.ms/w/c/75a4b93c1d7f31cf/Ec8xfx08uaQggHVpHgAAAAABSMC7xsM_ZJXLJ_i3AYiZNw?e=rhYco9", "_blank");
    } else {
      alert("❌ Incorrect Password. Try again.");
    }

  } catch (error) {
    console.error(error);
    alert("Error fetching value from Google Sheet.");
  }
}

/*-------------------------------------------
  PROJECTS SECTION - Toggle Functions
-------------------------------------------*/
// Toggle visibility of major/minor project lists
function toggleList(id) {
  const list = document.getElementById(id);
  if (list.classList.contains('hidden')) {
    list.classList.remove('hidden');
  } else {
    list.classList.add('hidden');
  }
}

/*-------------------------------------------
  PROJECT MODAL - Slideshow Functions
-------------------------------------------*/
// Add specific slide tracking for each modal
let slideIndices = {
  'bharatDarshanModal': 1, // Updated modal ID
  'greenHumanity': 1,
  'myHealth': 1
};

// Modified changeSlide function to handle multiple modals 
function changeSlide(n, modalId) {
  showSlides(slideIndices[modalId] += n, modalId);
}

// Modified showSlides function to handle multiple modals
function showSlides(n, modalId) {
  let i;
  let modal = document.getElementById(modalId);
  let slides = modal.getElementsByClassName("slides");

  if (n > slides.length) {
    slideIndices[modalId] = 1;
  }
  if (n < 1) {
    slideIndices[modalId] = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndices[modalId] - 1].style.display = "block";
}

// Initialize slides for each modal when opened
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  slideIndices[modalId] = 1;
  showSlides(1, modalId);
}

// Close modal function
function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// Initialize slide indices when page loads
document.addEventListener('DOMContentLoaded', () => {
  slideIndices = {
    'bharatDarshanModal': 1, // Updated modal ID
    'greenHumanity': 1,
    'myHealth': 1
  };
});


/*-------------------------------------------
  INITIALIZATION & EVENT LISTENERS
-------------------------------------------*/
// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

  /*-------------------------------------------
    MODAL EVENT LISTENERS
  -------------------------------------------*/
  // Close modal when clicking outside content area
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  /*-------------------------------------------
    SKILLS SECTION - Animation Setup
  -------------------------------------------*/
  // Configuration for intersection observer
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  // Observer for skill bar animations (if skill bars exist)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBars = entry.target.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }
    });
  }, observerOptions);

  // Animate skill items with staggered entrance effect
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }, index * 100); // Stagger animation by 100ms per item
      }
    });
  });

  // Setup initial state and observe skill items
  skillItems.forEach(item => {
    item.style.transform = 'translateY(20px)';
    item.style.opacity = '0';
    item.style.transition = 'all 0.6s ease';
    skillObserver.observe(item);
  });
});

/*-------------------------------------------
  CONTACT SECTION - Form Submission
-------------------------------------------*/
// Google Apps Script URL for form submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbx7tNovpeEmgN0uGkhFTgZE9BJvSv0q04Z9UmVi72WsqXh1RALSGEuahaHmsa9N4Ai7/exec'

// Handle contact form submission
function submitForm(e) {
  e.preventDefault()
  let formData = new FormData()
  formData.append('Name', document.getElementById('name').value)
  formData.append('Email', document.getElementById('email').value)
  formData.append('Message', document.getElementById('message').value)

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      alert('Success! Message sent successfully')
      document.getElementById('contactForm').reset()
    })
    .catch(error => console.error('Error!', error.message))
}

/*-------------------------------------------
  INTERACTIVE IMAGE REGIONS
-------------------------------------------*/
// Enhanced interactive functionality for image hover regions
document.addEventListener('DOMContentLoaded', function() {
  const hoverRegions = document.querySelectorAll('.hover-region');
  let hoverTimer = null;
  let brainAnimationPlayed = false;
  
  hoverRegions.forEach(region => {
    // Add ripple effect on click
    region.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
    
    // Track hover analytics (optional)
    region.addEventListener('mouseenter', function() {
      const regionName = this.dataset.region;
      console.log(`User hovering over: ${regionName}`);
      
      // Add active state
      this.classList.add('active-region');
      
      // Special handling for head region - trigger brain zoom after 3 seconds
      if (regionName === 'head' && !brainAnimationPlayed) {
        hoverTimer = setTimeout(() => {
          const brainContainer = this.querySelector('.brain-zoom-container');
          if (brainContainer) {
            brainContainer.classList.remove('hidden');
            brainContainer.classList.add('active');
            brainAnimationPlayed = true;
            
            // Hide the hover card when brain animation starts
            const hoverCard = this.querySelector('.hover-card');
            if (hoverCard) {
              hoverCard.style.opacity = '0';
              hoverCard.style.visibility = 'hidden';
            }
            
            // Reset after animation completes (2 seconds animation + 0.5s extra)
            setTimeout(() => {
              brainContainer.classList.remove('active');
              brainContainer.classList.add('hidden');
              if (hoverCard) {
                hoverCard.style.opacity = '';
                hoverCard.style.visibility = '';
              }
              brainAnimationPlayed = false;
            }, 8000);
          }
        }, 1500); // 3 seconds
      }
    });
    
    region.addEventListener('mouseleave', function() {
      // Remove active state
      this.classList.remove('active-region');
      
      // Clear hover timer if user leaves before 3 seconds
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    });
    
    // Accessibility: keyboard navigation support
    region.setAttribute('tabindex', '0');
    region.setAttribute('role', 'button');
    region.setAttribute('aria-label', `Interactive region: ${region.dataset.region}`);
    
    region.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = this.querySelector('.hover-card');
        if (card) {
          card.style.opacity = card.style.opacity === '1' ? '0' : '1';
          card.style.visibility = card.style.visibility === 'visible' ? 'hidden' : 'visible';
        }
      }
    });
  });
  
  // Add smooth scroll behavior when cards appear
  const interactiveContainer = document.querySelector('.interactive-image-container');
  if (interactiveContainer) {
    interactiveContainer.addEventListener('mouseenter', function() {
      document.body.style.scrollBehavior = 'smooth';
    });
  }
});

// Optional: Add card color variations based on region
function setRegionTheme(region, colors) {
  const regionElement = document.querySelector(`.region-${region} .hover-card`);
  if (regionElement && colors) {
    regionElement.style.background = `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
  }
}

// Apply custom themes (optional customization)
document.addEventListener('DOMContentLoaded', function() {
  setRegionTheme('head', { start: '#667eea', end: '#764ba2' });
  setRegionTheme('upper', { start: '#f093fb', end: '#f5576c' });
  setRegionTheme('lower', { start: '#4facfe', end: '#00f2fe' });
  setRegionTheme('left', { start: '#43e97b', end: '#38f9d7' });
  setRegionTheme('right', { start: '#fa709a', end: '#fee140' });
  setRegionTheme('center', { start: '#ff6b6b', end: '#feca57' });
});

/*-------------------------------------------
  ZOOM MAGNIFIER LENS
-------------------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  // Create zoom lens element
  const zoomLens = document.createElement('div');
  zoomLens.className = 'zoom-lens';
  const zoomContent = document.createElement('div');
  zoomContent.className = 'zoom-lens-content';
  zoomLens.appendChild(zoomContent);
  document.body.appendChild(zoomLens);
  
  const zoomableElements = document.querySelectorAll('.text-zoomable');
  const zoomFactor = 2.5; // Magnification level
  const lensSize = 250;
  
  zoomableElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      zoomLens.classList.add('active');
    });
    
    element.addEventListener('mousemove', function(e) {
      // Position lens at cursor
      const x = e.clientX - lensSize / 2;
      const y = e.clientY - lensSize / 2;
      
      zoomLens.style.left = x + 'px';
      zoomLens.style.top = y + 'px';
      
      // Calculate the position within the element
      const rect = element.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      // Clone the element if not already done
      if (!zoomContent.firstChild) {
        const clone = element.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '0';
        clone.style.top = '0';
        clone.style.width = element.offsetWidth + 'px';
        clone.style.height = element.offsetHeight + 'px';
        zoomContent.appendChild(clone);
      }
      
      // Calculate the position to show in the lens (centered on cursor)
      const moveX = -(offsetX * zoomFactor - lensSize / 2);
      const moveY = -(offsetY * zoomFactor - lensSize / 2);
      
      // Apply zoom transformation
      zoomContent.style.transform = `scale(${zoomFactor}) translate(${moveX / zoomFactor}px, ${moveY / zoomFactor}px)`;
      zoomContent.style.width = element.offsetWidth + 'px';
      zoomContent.style.height = element.offsetHeight + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
      zoomLens.classList.remove('active');
      // Clear the cloned content
      while (zoomContent.firstChild) {
        zoomContent.removeChild(zoomContent.firstChild);
      }
    });
  });
});

/*-------------------------------------------
  VISIT COUNTER
-------------------------------------------*/
// Function to increment and display visit count
function updateVisitCount() {
  // Get current count from localStorage
  let visits = localStorage.getItem('pageVisits');

  // If first visit, initialize to 1, otherwise increment
  visits = visits ? parseInt(visits) + 1 : 1;

  // Store updated count
  localStorage.setItem('pageVisits', visits);

  // Update display
  document.getElementById('visitCounter').textContent = visits;
}

// Call function when page loads
window.addEventListener('load', updateVisitCount);