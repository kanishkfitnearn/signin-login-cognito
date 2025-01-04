import { NextResponse, type NextRequest } from 'next/server'

const {
    NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_APP_CLIENT_ID,
    NEXT_PUBLIC_APP_CLIENT_SECRET
} = process.env

export async function GET(request: NextRequest) {
    try {
        const origin = request.nextUrl.origin
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get('code') as string

        if (!code) {
            const error = searchParams.get('error')
            return NextResponse.json({ error: error || 'Unknown error' })
        }

        const authorizationHeader = `Basic ${Buffer.from(`${NEXT_PUBLIC_APP_CLIENT_ID}:${NEXT_PUBLIC_APP_CLIENT_SECRET}`).toString('base64')}`

        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: NEXT_PUBLIC_APP_CLIENT_ID as string,
            code: code,
            redirect_uri: `${origin}/api/auth/callback`
        })

        // Get tokens
        const res = await fetch(`${NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authorizationHeader
            },
            body: requestBody
        })
        const data = await res.json()
        console.log(data);

        if (!res.ok) {
            return NextResponse.json({
                error: data.error,
                error_description: data.error_description
            })
        }

        // Set cookies in the response headers
        const response = NextResponse.redirect(new URL('/', request.nextUrl))
        response.cookies.set('id_token', data.id_token, { httpOnly: true, secure: true })
        response.cookies.set('access_token', data.access_token, { httpOnly: true, secure: true })
        response.cookies.set('refresh_token', data.refresh_token, { httpOnly: true, secure: true })

        return response
    } catch (error) {
        return NextResponse.json({ error: error })
    }
}
