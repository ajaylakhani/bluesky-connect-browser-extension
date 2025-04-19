document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const elements = {
    appNameElements: document.querySelectorAll('#app-name'),
    loginForm: document.getElementById('login-form'),
    userInfo: document.getElementById('user-info'),
    registerInfo: document.getElementById('register-info'),
    backInfo: document.getElementById('back-info'),
    loginButton: document.getElementById('login-button'),
    logoutButton: document.getElementById('logout-button'),
    identifierInput: document.getElementById('identifier'),
    passwordInput: document.getElementById('password'),
    errorMessage: document.getElementById('error-message'),
    userHandle: document.getElementById('user-handle'),
    userDid: document.getElementById('user-did'),
    homepageAnchor: document.getElementById('homepage-anchor')
  };
  
  // State
  let currentSession = null;
  const manifest = chrome.runtime.getManifest();

  // Initialize UI
  function initUI() {
    document.title = manifest.name;
    
    elements.appNameElements.forEach(element => {
      element.textContent = manifest.name;
    });

    if (elements.homepageAnchor && manifest.homepage_url) {
      elements.homepageAnchor.href = manifest.homepage_url;
    }
    
    elements.passwordInput.addEventListener('keyup', event => {
      if (event.key === 'Enter') elements.loginButton.click();
    });
    
    elements.loginButton.addEventListener('click', handleLogin);
    elements.logoutButton.addEventListener('click', handleLogout);
  }
  
  // Button state helper
  function setButtonState(button, isLoading, text) {
    const defaultText = button === elements.loginButton ? 'Connect to Bluesky' : 'Disconnect';
    const icon = button === elements.loginButton ? 'sign-in-alt' : 'sign-out-alt';
    
    if (isLoading) {
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (text || 'Processing...');
      button.disabled = true;
    } else {
      button.innerHTML = `<i class="fas fa-${icon}"></i> ${text || defaultText}`;
      button.disabled = false;
    }
  }
  
  // Session management
  function checkLoginStatus() {
    chrome.storage.local.get(['atpSession', 'developerMode'], result => {
      const developerMode = result.developerMode === true;
      
      if (result.atpSession) {
        try {
          currentSession = JSON.parse(result.atpSession);
          showLoggedInState(currentSession, developerMode);
        } catch (e) {
          chrome.storage.local.remove(['atpSession']);
          showLoginState();
        }
      } else {
        showLoginState();
      }
    });
  }
  
  // Login handler
  function handleLogin() {
    const identifier = elements.identifierInput.value.trim();
    const password = elements.passwordInput.value.trim();
    
    if (!identifier || !password) {
      elements.errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter both handle and password';
      return;
    }
    
    elements.errorMessage.textContent = '';
    setButtonState(elements.loginButton, true, 'Connecting...');
    
    const normalizedIdentifier = identifier.startsWith('@') ? identifier.substring(1) : identifier;
    
    fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: normalizedIdentifier, password })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Authentication failed');
        });
      }
      return response.json();
    })
    .then(data => {
      const session = {
        did: data.did,
        handle: data.handle,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt
      };
      
      currentSession = session;
      
      chrome.storage.local.set({
        atpSession: JSON.stringify(session),
        atpLoginTimestamp: Date.now()
      }, () => {
        chrome.storage.local.get(['developerMode'], result => {
          const developerMode = result.developerMode === true;
          notifyAllTabs({ action: 'ATP_LOGIN', session: JSON.stringify(session) });
          showLoggedInState(session, developerMode);
        });
      });
    })
    .catch(error => {
      elements.errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Login failed'}`;
      setButtonState(elements.loginButton, false);
    });
  }
  
  // Logout handler
  function handleLogout() {
    setButtonState(elements.logoutButton, true, 'Logging out...');
    
    notifyAllTabs({ action: 'ATP_LOGOUT', timestamp: Date.now() });
    currentSession = null;
    
    chrome.storage.local.remove(['atpSession', 'atpLoginTimestamp'], () => {
      window.close();
    });
  }
  
  // UI state handlers
  function showLoginState() {
    elements.userInfo.style.display = 'none';
    
    const simpleUI = document.getElementById('simple-connected-ui');
    if (simpleUI) simpleUI.style.display = 'none';
    
    elements.loginForm.style.display = 'block';
    elements.registerInfo.style.display = 'block';
    elements.backInfo.style.display = 'none';
    elements.identifierInput.focus();
  }
  
  function showLoggedInState(session, developerMode) {
    elements.loginForm.style.display = 'none';
    elements.registerInfo.style.display = 'none';
    elements.backInfo.style.display = 'block';
    
    if (developerMode) {
      showDeveloperUI(session);
    } else {
      showSimpleUI(session);
    }
  }
  
  function showDeveloperUI(session) {
    elements.userInfo.style.display = 'block';
    elements.userHandle.textContent = session.handle;
    elements.userDid.textContent = session.did;
    
    elements.userInfo.querySelectorAll('.user-detail').forEach(element => {
      element.style.display = 'block';
    });
    
    const simpleUI = document.getElementById('simple-connected-ui');
    if (simpleUI) simpleUI.style.display = 'none';
  }
  
  function showSimpleUI(session) {
    elements.userInfo.style.display = 'none';
    
    let simpleUI = document.getElementById('simple-connected-ui');
    
    if (!simpleUI) {
      simpleUI = createSimpleConnectedUI(session);
    } else {
      document.getElementById('simple-handle').textContent = session.handle;
      simpleUI.style.display = 'block';
    }
  }
  
  function createSimpleConnectedUI(session) {
    const simpleUI = document.createElement('div');
    simpleUI.id = 'simple-connected-ui';
    simpleUI.style.textAlign = 'center';
    simpleUI.style.padding = '20px';
    
    const connectedStatus = document.createElement('div');
    connectedStatus.style.marginBottom = '20px';
    
    const iconContainer = document.createElement('div');
    iconContainer.innerHTML = '<i class="fas fa-check-circle" style="color: #38A169; font-size: 32px; margin-bottom: 12px;"></i>';
    
    const connectedText = document.createElement('div');
    connectedText.textContent = 'Connected to Bluesky';
    connectedText.style.fontWeight = '500';
    connectedText.style.marginBottom = '8px';
    
    const handleText = document.createElement('div');
    handleText.id = 'simple-handle';
    handleText.textContent = session.handle;
    handleText.style.color = '#5F6C80';
    handleText.style.fontSize = '14px';
    handleText.style.marginBottom = '20px';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect';
    logoutBtn.addEventListener('click', () => elements.logoutButton.click());
    
    connectedStatus.appendChild(iconContainer);
    connectedStatus.appendChild(connectedText);
    connectedStatus.appendChild(handleText);
    simpleUI.appendChild(connectedStatus);
    simpleUI.appendChild(logoutBtn);
    
    document.querySelector('.container').appendChild(simpleUI);
    return simpleUI;
  }
  
  // Chrome messaging
  function notifyAllTabs(message) {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Ignore errors for tabs that can't receive messages
        });
      });
    });
    
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignore if background script isn't ready
    });
  }
  
  // Listen for storage changes
  function setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== 'local') return;
      
      if (changes.developerMode && currentSession) {
        const newDeveloperMode = changes.developerMode.newValue === true;
        showLoggedInState(currentSession, newDeveloperMode);
      }
      
      if (changes.atpSession) {
        if (changes.atpSession.newValue) {
          try {
            currentSession = JSON.parse(changes.atpSession.newValue);
            chrome.storage.local.get(['developerMode'], result => {
              showLoggedInState(currentSession, result.developerMode === true);
            });
          } catch (e) {
            console.error('Failed to parse session data:', e);
          }
        } else {
          currentSession = null;
          showLoginState();
        }
      }
    });
  }
  
  // Initialize
  initUI();
  checkLoginStatus();
  setupStorageListener();
});