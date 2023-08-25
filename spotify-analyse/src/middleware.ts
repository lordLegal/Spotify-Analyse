export { default } from "next-auth/middleware"

export const config = {
    matcher: ['/statics', '/trade', '/trade/:path*', '/api/:path*'],
}