// This script runs in the page context and acts as a bridge between the content script and the page

(function() {
  console.log('Initializing ATP Session Bridge');
  
  // Load session data from sessionStorage and expose it to the page
  function loadSession() {
    try {
      const sessionData = sessionStorage.getItem('atpSessionData');
      if (sessionData) {
        window.atpSession = JSON.parse(sessionData);
        console.log('ATP session data loaded into window.atpSession');
        document.dispatchEvent(new CustomEvent('atp-session-ready', {
          detail: window.atpSession
        }));
      } else {
        console.log('No ATP session data found in sessionStorage');
      }
    } catch (e) {
      console.log('Error loading ATP session data:', e);
    }
  }
  
  // Clear session data from window object
  function clearSession() {
    window.atpSession = null;
    console.log('ATP session data removed from window.atpSession');
    document.dispatchEvent(new CustomEvent('atp-session-removed'));
  }
  
  // Listen for events from the content script
  document.addEventListener('atp-load-session', loadSession);
  document.addEventListener('atp-clear-session', clearSession);
  
  // Initial load attempt
  loadSession();
})();