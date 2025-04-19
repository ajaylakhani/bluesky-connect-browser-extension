# bluesky-connect-browser-extension
A developer-focused browser extension for seamless authentication with the AT Protocol, enabling applications to securely connect with Bluesky accounts.

## Overview

Bluesky Connect enables web applications to securely authenticate with Bluesky accounts using the AT Protocol without handling user credentials directly. This extension serves as a bridge between websites and the Bluesky social network, standardizing authentication for developers building Bluesky-integrated applications.

## User Features
- Connect to Bluesky with your existing account
- Option to use app passwords for enhanced security
- Developer mode for technical users
- Clear session management
- Simple, intuitive interface
  
## For Developers

### Benefits

- **Save Development Time**: Focus on building your application features instead of implementing complex authentication
- **Standardized Authentication**: Provide a consistent, secure login experience across the AT Protocol ecosystem
- **Zero Authentication Code**: No need to write authentication flows, token refresh mechanisms, or secure storage
- **Built-in Testing Tools**: Verify integration with the included test page

Bluesky Connect enables web applications to securely authenticate with Bluesky accounts using the AT Protocol without handling user credentials directly. This extension serves as a bridge between websites and the Bluesky social network, standardizing authentication for developers building Bluesky-integrated applications.

### Integration Example

```javascript
// Check if the user is already authenticated
if (window.atpSession) {
  console.log("User is authenticated:", window.atpSession.handle);
  initializeWithSession(window.atpSession);
} else {
  console.log("User not authenticated yet");
  
  // Listen for authentication events
  document.addEventListener('atp-authenticated', function(event) {
    console.log("User authenticated:", event.detail.handle);
    initializeWithSession(event.detail);
  });
  
  // Listen for logout events
  document.addEventListener('atp-logged-out', function() {
    console.log("User logged out");
    updateUIForLoggedOutState();
  });
}

function initializeWithSession(session) {
  // Initialize your app with the authenticated session
  const { did, handle, accessJwt } = session;
  
  // Use these credentials to make authenticated API calls
  // Example:
  // atproto.createSession({
  //   did: session.did,
  //   accessJwt: session.accessJwt
  // });
}
```

## Available Events
- **atp-authenticated:** Fired when a user successfully authenticates
- **atp-logged-out:** Fired when a user disconnects their account
- **atp-session-ready:** Fired when session data is initially available to the page
- **atp-session-removed:** Fired when session data is removed from the page

## Session Object
The extension provides the following data in the session object:

```javascript
javascript{
  did: "did:plc:user-identifier",
  handle: "username.bsky.social",
  accessJwt: "jwt-token-for-authentication",
  refreshJwt: "jwt-token-for-refreshing"
}
```

## Installation
[![Install Bluesky Connect](https://img.shields.io/badge/Install-Bluesky%20Connect-1185FE?style=for-the-badge&logo=github)](https://ajaylakhani.co.uk/bluesky-connect-chrome-extension/)

We offer multiple installation methods:

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Clone this repository
 ```
   git clone https://github.com/ajaylakhani/bluesky-connect-browser-extension.git
   ```
2. Load the extension in Chrome:
   - Open Chrome/Edge and navigate to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"  and select the repository directory

## Projext Structure
 ```
bluesky-connect-browser-extension/
├── assets/
│   └── icons/
│       ├── icon128.png
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       ├── bskyconnect.png
│       └── logo.png
├── src/
│   ├── background/
│   │   └── background.js
│   ├── content/
│   │   └── content.js
│   ├── pages/
│   │   ├── license/
│   │   │   ├── license.css
│   │   │   └── license.html
│   │   ├── main/
│   │   │   ├── main.html
│   │   │   └── main.js
│   │   ├── options/
│   │   │   ├── options.css
│   │   │   ├── options.html
│   │   │   └── options.js
│   │   └── welcome/
│   │       ├── welcome.css
│   │       ├── welcome.html
│   │       └── welcome.js
│   └── utils/
│       ├── logger.js
│       └── session-bridge.js
├── .gitignore
├── manifest.json
├── test.css
└── test.html
 ```

## Customization
Developers can easily create their own branded version of this extension by modifying:

manifest.json:

name: Change to your application name
homepage_url: Set to your application's homepage
icons: Replace with your own icons

## Theme and styling:

Modify CSS files to match your brand colors
Update text content in HTML files

## Developer Tools
The extension includes a test page (test.html) that provides:
- Real-time authentication status monitoring
- Display of active session data (DID, handle, tokens)
- Event logging for authentication events
- Manual authentication state checking

This test page is invaluable for debugging integration issues and verifying that the extension works correctly with your application.

## Security
This extension:
- Never exposes user passwords to web applications
- Uses Bluesky's official XRPC endpoints for authentication
- Stores tokens securely in browser extension storage
- Implements proper session management
- Allows users to revoke access at any time

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Acknowledgments

- Built on the [AT Protocol](https://atproto.com/)
- Icons by [Font Awesome](https://fontawesome.com/)

