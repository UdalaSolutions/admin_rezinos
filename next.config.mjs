/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/api-proxy/:path*',
				destination: 'https://rezinos-be.onrender.com/api/:path*',
			},
		];
	},
};

export default nextConfig;
