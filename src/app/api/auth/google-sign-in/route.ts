import { NextResponse, type NextRequest } from 'next/server';

const { NEXT_PUBLIC_COGNITO_DOMAIN, NEXT_PUBLIC_APP_CLIENT_ID } = process.env;

export async function GET(request: NextRequest) {
    try {
        const origin = request.nextUrl.origin;
        const redirectUri = `${origin}/api/auth/callback`;
        const googleSignInUrl = `${NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${NEXT_PUBLIC_APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&identity_provider=Google&prompt=select_account`;

        // Redirect user to the Hosted UI with Google identity provider
        const response = NextResponse.redirect(googleSignInUrl);

        // Prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to initiate sign-in flow', details: error });
    }
}
