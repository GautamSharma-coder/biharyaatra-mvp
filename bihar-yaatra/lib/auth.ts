import { cookies } from 'next/headers';

/**
 * Server-side utility to check if the user is authenticated.
 * It reads the `access_token` from the cookies.
 * 
 * Usage in Server Components:
 * const user = await getUser();
 * if (!user) redirect('/auth');
 */
export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    // We could verify the JWT here using jsonwebtoken if we had the secret,
    // or just assume they are authenticated if the token exists, since the backend
    // will reject invalid tokens on any API call anyway.
    
    // For Week 1: Just decode the payload without verification (safe for UI checks, 
    // never trust for DB access).
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as { user_id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}
