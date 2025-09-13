/*===========================================
  PORTFOLIO WEBSITE JAVASCRIPT
  Author: Ravi Chaudhary
  Description: Interactive functionality for portfolio website
===========================================*/

/*-------------------------------------------
  ABOUT SECTION - Resume Functions
-------------------------------------------*/
// Password protected resume editing function
function validateAndEdit() {
  const password = prompt("Please enter the password to Edit resume:");
  if (password === "9580156837") {
    window.open("https://1drv.ms/w/c/75a4b93c1d7f31cf/Ec8xfx08uaQggHVpHgAAAAABSMC7xsM_ZJXLJ_i3AYiZNw?e=rhYco9", "_blank");
  } else {
    alert("Invalid password. Access denied.");
  }
}

// Camera verification for resume download
let cameraStream = null;

function startCameraVerification() {
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      cameraStream = stream;
      video.srcObject = stream;
    })
    .catch(err => {
      alert('Camera access denied. Please allow camera access to download resume.');
      closeCameraModal();
    });
}

function verifyAndDownload() {
  if (cameraStream) {
    captureAndSaveImage();
    alert('Verification successful! Downloading resume...');
    window.open('https://1drv.ms/w/c/75a4b93c1d7f31cf/Ec8xfx08uaQggHVpHgAAAAABSMC7xsM_ZJXLJ_i3AYiZNw?e=rhYco9', '_blank');
    closeCameraModal();
  } else {
    alert('Please allow camera access first.');
  }
}

function captureAndSaveImage() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob(blob => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `verification_${timestamp}.jpg`;
    
    // Upload to server
    const formData = new FormData();
    formData.append('image', blob, filename);
    formData.append('timestamp', timestamp);
    
    fetch('/upload-verification', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Image saved to drive:', data.url);
    })
    .catch(error => {
      console.error('Upload failed:', error);
      // Fallback to local download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });
  }, 'image/jpeg', 0.8);
}

function closeCameraModal() {
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');
  
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  video.srcObject = null;
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
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
// Global variables for slideshow
let currentSlide = 0;
let slides;

// Open project modal and initialize slideshow
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  slides = document.querySelectorAll('.slides');
  currentSlide = 0;
}

// Close project modal and restore scrolling
function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Navigate through project screenshots
function changeSlide(direction) {
  if (!slides || slides.length === 0) return;
  
  slides[currentSlide].classList.add('hidden');
  currentSlide += direction;

  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;

  slides[currentSlide].classList.remove('hidden');
}

/*-------------------------------------------
  INITIALIZATION & EVENT LISTENERS
-------------------------------------------*/
// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  
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