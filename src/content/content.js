// Initialize authentication state when content script loads
function initializeAuthState() {
  logger.debug('Initializing authentication state');
  chrome.storage.local.get(['atpSession'], function(result) {
    if (result.atpSession) {
      try {
        const session = JSON.parse(result.atpSession);
        // Apply authentication state to this tab
        applyAuthenticationState(session);
      } catch (e) {
        logger.debug('Failed to parse ATP session data:', e);
      }
    }else{
      logger.debug('no atpSession found in local storage');
    }
  });
}

// Apply the authentication state to the current tab
function applyAuthenticationState(session) {
   // Store session data in sessionStorage for the injected script to access
  sessionStorage.setItem('atpSessionData', JSON.stringify(session));

  // Store session data for use by page interactions
  injectSessionToPage(session);
  logger.debug('ATP authentication applied', window.atpSession);
  
  // Dispatch an event that page scripts can listen for (if needed)
  document.dispatchEvent(new CustomEvent('atp-authenticated', {
    detail: { handle: session.handle, 
              did: session.did,
              accessJwt: session.accessJwt,
              refreshJwt: session.refreshJwt
            }
  }));
}

// Clear authentication state from the current tab
function clearAuthenticationState() {
  // Remove the session data
  sessionStorage.removeItem('atpSessionData');
  console.log('ATP authentication cleared');
  
  // Dispatch an event that page scripts can listen for (if needed)
  document.dispatchEvent(new CustomEvent('atp-logged-out'));
  document.dispatchEvent(new CustomEvent('atp-clear-session'));
}

function injectSessionToPage(session) {
  logger.debug('Injecting ATP session bridge script');
  
  const bridgeURL = chrome.runtime.getURL('src/utils/session-bridge.js');
  logger.debug('ATP session bridge URL:', bridgeURL);

  const script = document.createElement('script');
  script.src = bridgeURL;
  
  script.onload = function() {
    console.debug('ATP session bridge script loaded ');
    // Dispatch an event to trigger the bridge script to read the session data
    document.dispatchEvent(new CustomEvent('atp-load-session'));
  };

   script.onerror = function(error) {
    logger.error('Failed to load ATP session bridge script', error);
    this.remove();
  };

  (document.head || document.documentElement).appendChild(script);
 
}


// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'ATP_LOGIN') {
    try {
      const session = JSON.parse(message.session);
      applyAuthenticationState(session);
    } catch (e) {
      console.error('Failed to parse ATP login message:', e);
    }
  } else if (message.action === 'ATP_LOGOUT') {
    clearAuthenticationState();
  }
});

// Initialize when content script loads
initializeAuthState();