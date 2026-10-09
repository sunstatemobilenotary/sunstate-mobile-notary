/**
 * Cloudflare Worker for Decap CMS GitHub OAuth
 *
 * Deploy this as a separate Cloudflare Worker (not a Pages Function)
 *
 * Setup Instructions:
 * 1. Go to https://github.com/settings/developers
 * 2. Click "New OAuth App"
 * 3. Set:
 *    - Application name: Sunstate Mobile Notary CMS
 *    - Homepage URL: https://sunstatemobilenotary.com
 *    - Authorization callback URL: https://oauth-proxy.YOURWORKER.workers.dev/callback
 * 4. Copy the Client ID and Client Secret
 * 5. In Cloudflare Workers, set environment variables:
 *    - OAUTH_CLIENT_ID
 *    - OAUTH_CLIENT_SECRET
 * 6. Deploy this worker
 * 7. Update public/admin/config.yml with your worker URL
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://sunstatemobilenotary.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GitHub OAuth authorization
    if (url.pathname === '/auth') {
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', 'repo,user');

      return Response.redirect(authUrl.toString(), 302);
    }

    // GitHub OAuth callback
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.OAUTH_CLIENT_ID,
            client_secret: env.OAUTH_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        // Return success page that posts message to opener window
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorizing...</title>
</head>
<body>
  <p>Authorization successful. This window will close automatically.</p>
  <script>
    (function() {
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify(tokenData)}',
          message.origin
        );
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');

      // Auto-close after 5 seconds as fallback
      setTimeout(() => window.close(), 5000);
    })();
  </script>
</body>
</html>
        `;

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(`OAuth error: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Default response
    return new Response('Decap CMS OAuth Proxy', {
      headers: { 'Content-Type': 'text/plain', ...corsHeaders },
    });
  },
};
