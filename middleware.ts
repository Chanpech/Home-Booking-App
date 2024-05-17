export { default }  from 'next-auth/middleware';

export const config = {
    matcher: [
        "/trips",
        "/reservaitons",
        "/favorites",
        "/properties",
    ]
}