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
  slideIndices[modalId] = 1;
  showSlides(1, modalId);
}

// Close modal function
function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
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