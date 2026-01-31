# OAuth Flow Implementation

## Overview

The application now has a complete OAuth 2.0 implementation for Google and Microsoft 365 login. Here's how it works:

## Frontend OAuth Flow

### 1. User Initiates OAuth Login
- User clicks "Continuar con Google" or "Continuar con Microsoft 365" button on landing/login page
- Frontend navigates to `/auth/google` or `/auth/microsoft`

### 2. OAuth Initiation Pages
**Pages:**
- `src/shared/pages/auth/GoogleOAuthPage.tsx`
- `src/shared/pages/auth/MicrosoftOAuthPage.tsx`

**What they do:**
1. Generate a random `state` parameter (32-byte random value) for CSRF protection
2. Store the state in `sessionStorage` (`oauth_state`)
3. Build the OAuth authorization URL with:
   - Client ID from environment variables
   - Redirect URI: `{window.location.origin}/auth/callback?provider={provider}`
   - Requested scopes: `openid profile email`
   - State parameter

**Authorization URLs:**
- Google: `https://accounts.google.com/o/oauth2/v2/auth?...`
- Microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...`

### 3. User Login at OAuth Provider
- User is redirected to Google or Microsoft login page
- User enters credentials and authorizes the app
- OAuth provider generates an authorization code

### 4. OAuth Provider Redirects Back
- OAuth provider redirects to: `/auth/callback?code={code}&state={state}&provider={provider}`
- Browser navigates to the frontend callback page

### 5. OAuth Callback Handler
**Page:** `src/shared/pages/OAuthCallbackPage.tsx`

**What it does:**
1. Extracts `code`, `state`, and `provider` from URL parameters
2. Validates the state parameter matches what was stored in sessionStorage
3. If valid, calls backend endpoint: `POST /auth/{provider}/callback`
4. Passes authorization code to backend
5. Backend exchanges code for tokens and returns JWT
6. Frontend stores JWT in auth context
7. Redirects user to `/dashboard`

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
```

### Getting OAuth Client IDs

See `OAUTH_SETUP.md` for detailed instructions on:
1. Creating Google OAuth credentials
2. Creating Microsoft OAuth credentials
3. Configuring redirect URIs

## Backend Requirements

Your backend must implement:

### 1. OAuth Callback Endpoint
```
POST /auth/{provider}/callback
Content-Type: application/json

Request:
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

### 2. What the Backend Should Do
1. Receive the authorization code
2. Exchange the code for tokens from the OAuth provider:
   - **Google**: `https://oauth2.googleapis.com/token`
   - **Microsoft**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
3. Decode the ID token to extract user information
4. Find or create the user in your database
5. Generate a JWT token for the frontend
6. Return the token and user info

### 3. Example Backend Implementation

See `OAUTH_SETUP.md` for Node.js/Express examples.

## CSRF Protection

The implementation includes CSRF protection via the state parameter:

1. Frontend generates a cryptographically random 32-byte state
2. State is stored in sessionStorage (browser-only, not transmitted)
3. OAuth provider includes state in the redirect URL
4. Frontend validates that returned state matches stored state
5. If mismatch occurs, authentication is rejected

## Security Considerations

1. ✅ State parameter validation prevents CSRF attacks
2. ✅ Authorization code is exchanged on backend (not frontend)
3. ✅ JWT tokens are stored in memory (can add refresh tokens)
4. ✅ Sensitive redirect URIs are validated at OAuth providers
5. ⚠️ HTTPS required in production
6. ⚠️ Keep backend client secrets secure (not in frontend)

## Testing the Flow

1. Add OAuth Client IDs to `.env.local`
2. Ensure backend is running and implements callback endpoints
3. Navigate to landing page
4. Click OAuth button
5. You should be redirected to Google/Microsoft login
6. After login, you'll be redirected back to the callback page
7. Backend exchanges code for tokens
8. You'll be redirected to dashboard

## Files Modified

**New Files:**
- `src/shared/pages/auth/GoogleOAuthPage.tsx` - Google OAuth initiation
- `src/shared/pages/auth/MicrosoftOAuthPage.tsx` - Microsoft OAuth initiation
- `src/shared/pages/OAuthCallbackPage.tsx` - OAuth callback handler
- `.env.local` - Environment variable template

**Modified Files:**
- `src/shared/pages/LandingPage.tsx` - Updated to use frontend OAuth routes
- `src/router/index.tsx` - Added OAuth routes
- `src/api/auth.ts` - Added OAuth callback API method

## Next Steps

1. Set up OAuth credentials (Google Cloud Console, Azure AD)
2. Add Client IDs to `.env.local`
3. Implement backend OAuth callback endpoints
4. Test the complete OAuth flow
5. Deploy to production with HTTPS

## Troubleshooting

**"Not Found" on /auth/google or /auth/microsoft:**
- Ensure routes are added to router (already done)
- Check browser console for errors

**Redirect to OAuth provider doesn't happen:**
- Check that `VITE_GOOGLE_CLIENT_ID` or `VITE_MICROSOFT_CLIENT_ID` is set
- Check browser console for error messages
- Verify OAuth credentials are correct

**"State parameter mismatch" error:**
- Browser might have cleared sessionStorage
- Could indicate a CSRF attack attempt
- Try again in a new browser tab

**Backend callback returns error:**
- Ensure backend is running
- Check redirect URI matches OAuth provider config
- Verify backend can reach OAuth provider endpoints
- Check network tab in browser devtools

## References

- `OAUTH_SETUP.md` - Detailed OAuth provider setup
- `API_CHECKLIST.md` - API endpoint specifications
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
