// options.js - Handles the options page functionality
document.addEventListener('DOMContentLoaded', function() {
  const manifest = chrome.runtime.getManifest();
  const appNameElements = document.querySelectorAll('#app-name');
  
  // Set the document title
  document.title = manifest.name;
  // Update all elements with id="app-name"
  appNameElements.forEach(element => {
    element.textContent = manifest.name;
  });

  // Get references to form elements
  const developerModeToggle = document.getElementById('developer-mode');
  const statusMessage = document.getElementById('status-message');
  
  // Load saved settings
  function loadOptions() {
    chrome.storage.local.get(['developerMode'], function(result) {
      developerModeToggle.checked = result.developerMode === true;
    });
  }
  
  // Save individual setting when changed
  function saveSetting(key, value) {
    let data = {};
    data[key] = value;
    
    chrome.storage.local.set(data, function() {
      showStatusMessage('Settings saved', 'success');
    });
  }
  
  // Display status message
  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message status-' + type;
    statusMessage.style.display = 'block';
    
    // Hide message after 2 seconds
    setTimeout(function() {
      statusMessage.style.display = 'none';
    }, 2000);
  }
  
  // Event listeners for settings changes
  developerModeToggle.addEventListener('change', function() {
    saveSetting('developerMode', this.checked);
  });
  
  // Load options when page loads
  loadOptions();
});