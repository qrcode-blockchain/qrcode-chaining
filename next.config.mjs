/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    experimental: {
        serverActions: true,
    },
};

export default nextConfig;