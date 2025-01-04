import { NextRequest, NextResponse } from "next/server";

const { 
  NEXT_PUBLIC_COGNITO_DOMAIN, 
  NEXT_PUBLIC_APP_CLIENT_ID, 
  NEXT_PUBLIC_APP_CLIENT_SECRET 
} = process.env;

export async function GET(request: NextRequest) {
   
    const refreshToken = request.cookies.get('refresh_token');

    if (!refreshToken) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    const authorizationHeader = `Basic ${Buffer.from(`${NEXT_PUBLIC_APP_CLIENT_ID}:${NEXT_PUBLIC_APP_CLIENT_SECRET}`).toString('base64')}`;

    const response = await fetch(`${NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/revoke`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorizationHeader,
        },
        body: new URLSearchParams({
            token: refreshToken.value
        }),
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({
            error: data.error,
            error_description: data.error_description,
        });
    }

    if (response.ok) {
        const response = NextResponse.redirect(`${NEXT_PUBLIC_COGNITO_DOMAIN}/logout?client_id=${NEXT_PUBLIC_APP_CLIENT_ID}&logout_uri=${encodeURIComponent(request.nextUrl.origin + '/login')}`);
    
    // Expire local cookies
    response.cookies.set('id_token', '', { maxAge: 0 });
    response.cookies.set('access_token', '', { maxAge: 0 });
    response.cookies.set('refresh_token', '', { maxAge: 0 });

    return response;
    }
}
