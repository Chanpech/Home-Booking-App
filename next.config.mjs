/** @type {import('next').NextConfig} */
const nextConfig = {

    images:{
        // domains: [
        //     "avatars.githubusercontent.com",
        //     "lh3.googleusercontent.com",
        // ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '**',
            }, 
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            }

        ],
    }
};

export default nextConfig;
