# OAuth Setup Guide

This guide explains how to set up OAuth authentication (Google and Microsoft) for the LegalTech platform.

## Overview

The application supports OAuth 2.0 login with:
- **Google** - For users with Google accounts
- **Microsoft 365** - For users with Microsoft/Office 365 accounts

## Architecture

The OAuth flow works as follows:

```
1. User clicks OAuth button (Google/Microsoft)
2. Frontend redirects to: {VITE_OAUTH_BASE_URL}/auth/{provider}
3. Backend handles OAuth flow:
   - Generates authorization code request
   - User logs in at provider
   - Provider redirects back with authorization code
4. Backend exchanges code for tokens
5. Backend creates/updates user in database
6. Frontend callback page receives tokens
7. Tokens stored in auth context
8. User redirected to dashboard
```

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and create a new project
3. Name it "LegalTech Platform" (or your preferred name)
4. Wait for the project to be created

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name:** LegalTech Google OAuth
   - **Authorized JavaScript origins:** 
     - `http://localhost:5173` (development)
     - `http://localhost:3000` (dev server proxy)
     - Your production domain
   - **Authorized redirect URIs:**
     - `http://localhost:3001/auth/google/callback` (backend handles this)
     - Your production OAuth callback URL

5. Copy the **Client ID** - you'll need this for `VITE_GOOGLE_CLIENT_ID`
6. Copy the **Client Secret** - store securely on backend only

### 4. Add to Environment

Frontend (.env):
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Backend (.env):
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Microsoft OAuth Setup

### 1. Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "App registrations" and open it
3. Click "New registration"
4. Configure:
   - **Name:** LegalTech Platform
   - **Supported account types:** "Accounts in any organizational directory (Any Azure AD directory - Multitenant)"
   - **Redirect URI:** Web - `http://localhost:3001/auth/microsoft/callback`

### 2. Get Application Credentials

1. In App registrations, find your app and open it
2. Go to "Certificates & secrets"
3. Click "New client secret"
4. Set expiration (choose appropriate duration)
5. Copy the **Value** - this is your Client Secret
6. Go back to "Overview" tab
7. Copy the **Application (client) ID** - this is your Client ID

### 3. Configure API Permissions

1. Go to "API permissions" in your app
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Delegated permissions"
5. Search for and add:
   - `User.Read` (to read user profile)
   - `email` (to read email)
   - `openid` (for OpenID Connect)
   - `profile` (for profile info)

### 4. Add to Environment

Frontend (.env):
```
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
```

Backend (.env):
```
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

## Backend Implementation

Your backend needs to implement OAuth endpoints. Here's the expected structure:

### Required Backend Endpoints

#### 1. Authorization Initiation
```
GET /auth/{provider}
```
- Generates authorization URL
- Redirects user to OAuth provider
- Stores state parameter in session for CSRF protection

#### 2. OAuth Callback Handler
```
POST /auth/{provider}/callback
Content-Type: application/json

{
  "code": "authorization_code_from_provider",
  "state": "state_from_provider"
}

Response:
{
  "accessToken": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Name",
    "roles": ["landlord"],
    "defaultRole": "landlord"
  }
}
```

### Backend Implementation Example (Node.js/Express)

```typescript
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Google OAuth Handler
app.get('/auth/google', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.oauthState = state;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.CALLBACK_BASE_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });
  
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.post('/auth/google/callback', async (req, res) => {
  const { code, state } = req.body;
  
  // Verify state
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state' });
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.CALLBACK_BASE_URL}/auth/google/callback`,
      grant_type: 'authorization_code',
    });
    
    const { id_token } = tokenResponse.data;
    const decoded = jwt.decode(id_token);
    
    // Find or create user
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        email: decoded.email,
        fullName: decoded.name,
        roles: ['landlord'],
        defaultRole: 'landlord',
      });
    }
    
    // Create JWT token for frontend
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
        defaultRole: user.defaultRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        defaultRole: user.defaultRole,
      },
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Microsoft OAuth Handler
app.get('/auth/microsoft', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.oauthState = state;
  
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID,
    redirect_uri: `${process.env.CALLBACK_BASE_URL}/auth/microsoft/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    response_mode: 'query',
    state,
  });
  
  res.redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`);
});

app.post('/auth/microsoft/callback', async (req, res) => {
  const { code, state } = req.body;
  
  // Similar to Google - exchange code for tokens
  // Request tokens from Microsoft token endpoint
  // Decode and extract user info
  // Create or update user in database
  // Return JWT token to frontend
});
```

## Frontend Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your OAuth Client IDs:
```
VITE_OAUTH_BASE_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

3. Update the redirect URIs in your OAuth provider configs to match your deployment URL

## Testing OAuth Locally

1. Start your backend server on port 3001
2. Start your frontend dev server (normally on port 5173)
3. Frontend is served through proxy on port 3000
4. Click OAuth buttons on landing page
5. You'll be redirected to the provider's login
6. After login, you'll be redirected back to `/auth/callback`
7. If successful, you'll be redirected to `/dashboard`

## Common Issues

### "Redirect URI mismatch"
- Check that your redirect URIs in OAuth provider settings match exactly
- Include `http://localhost:3001/auth/{provider}/callback` for local development

### "Invalid state parameter"
- Ensure your backend validates state parameter against session
- State should be random, unique, and stored server-side for CSRF protection

### "User not found"
- Make sure your backend creates new users when they don't exist
- Check that the JWT token is properly formed with required fields

### "OAuth callback not working"
- Verify `VITE_OAUTH_BASE_URL` points to your backend
- Check browser console for errors
- Verify backend is receiving the authorization code correctly

## Production Deployment

For production:

1. Update OAuth provider settings:
   - Add your production domain to authorized origins
   - Update redirect URI to production URL

2. Update environment variables:
   ```
   VITE_OAUTH_BASE_URL=https://api.yourdomain.com
   VITE_GOOGLE_CLIENT_ID=prod_google_client_id
   VITE_MICROSOFT_CLIENT_ID=prod_microsoft_client_id
   ```

3. Ensure backend uses secure HTTPS endpoints

4. Keep client secrets only on backend

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1)
