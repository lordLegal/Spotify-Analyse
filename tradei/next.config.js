/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'i.scdn.co',
            port: '',
            pathname: '/image/**',
        }]
    },


}

module.exports = nextConfig
