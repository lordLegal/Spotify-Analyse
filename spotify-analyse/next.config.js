/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'i.scdn.co',
            port: '',
            pathname: '/image/**',
        }]
    },
    async rewrites() {
        return [
            {
                source: '/api/trade/:path*',
                destination: 'http://127.0.0.1:3000/:path*',
            },
        ]
    }
}

module.exports = nextConfig
