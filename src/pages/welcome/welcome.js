// welcome.js - External script for the welcome page
document.addEventListener('DOMContentLoaded', function() {
  const manifest = chrome.runtime.getManifest();
  const appNameElements = document.querySelectorAll('#app-name');

  // Set the document title
  document.title = manifest.name;
  // Update all elements with id="app-name"
  appNameElements.forEach(element => {
    element.textContent = manifest.name;
  });

  // Handle connect account button click
  document.getElementById('connect-account').addEventListener('click', function(e) {
    e.preventDefault();
    // Open the extension popup programmatically
    chrome.runtime.sendMessage({action: 'OPEN_POPUP'});
  });
  
  // Handle how to pin button click - show pin extension modal
  document.getElementById('how-to-pin').addEventListener('click', function(e) {
    e.preventDefault();
    const modal = document.getElementById('pin-extension-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  });
  
  // Handle learn more about app passwords click - show app password modal
  document.getElementById('learn-app-passwords').addEventListener('click', function(e) {
    e.preventDefault();
    const modal = document.getElementById('app-password-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  });
  
  // Close modals when clicking the X buttons
  document.getElementById('app-password-modal-close').addEventListener('click', function() {
    closeModal('app-password-modal');
  });
  
  document.getElementById('pin-extension-modal-close').addEventListener('click', function() {
    closeModal('pin-extension-modal');
  });
  
  // Close modals when clicking the close buttons in the footer
  const closeButtons = document.getElementsByClassName('modal-close-btn');
  for (let button of closeButtons) {
    button.addEventListener('click', function() {
      const modalId = this.dataset.modal || 'app-password-modal';
      closeModal(modalId);
    });
  }
  
  // Close modals when clicking outside the modal content
  const modals = document.getElementsByClassName('modal-overlay');
  for (let modal of modals) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  }
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });
  
  // Function to close a modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
  
  // Browser tabs switching in the pin extension modal
  const browserTabs = document.querySelectorAll('.browser-tab');
  browserTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      browserTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all tab content
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show the content for the clicked tab
      const tabId = this.dataset.tab + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Auto-detect browser type and show appropriate tab
  function detectBrowserAndSelectTab() {
    let browserName = 'chrome'; // Default
    
    // Simple browser detection
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.indexOf('edg') > -1 || userAgent.indexOf('edge') > -1) {
      browserName = 'edge';
    } else if (userAgent.indexOf('firefox') > -1) {
      browserName = 'firefox';
    } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
      browserName = 'safari';
    }
    
    // Find the tab for this browser and click it
    const browserTab = document.querySelector(`.browser-tab[data-tab="${browserName}"]`);
    if (browserTab) {
      browserTab.click();
    }
  }
  
  // Automatically select the appropriate browser tab when the modal opens
  document.getElementById('how-to-pin').addEventListener('click', function() {
    // Short delay to ensure modal is rendered
    setTimeout(detectBrowserAndSelectTab, 100);
  });
});