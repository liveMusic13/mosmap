import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	webpack: config => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@st': path.resolve(__dirname, 'src/styles'),
		};
		return config;
	},
};

export default nextConfig;
