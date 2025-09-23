// import type { NextConfig } from 'next';
// import path from 'path';
// const nextConfig: NextConfig = {
// 	webpack: config => {
// 		config.resolve.alias = {
// 			...config.resolve.alias,
// 			'@st': path.resolve(__dirname, 'src/styles'),
// 		};
// 		return config;
// 	},
// 	experimental: {
// 		// Показывает более подробную информацию об ошибках гидратации
// 		serverComponentsExternalPackages: [],
// 	},
// 	// Включите подробное логирование в dev режиме
// 	logging: {
// 		fetches: {
// 			fullUrl: true,
// 		},
// 	},
// };
// export default nextConfig;
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	webpack: (config, { dev, isServer }) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@st': path.resolve(__dirname, 'src/styles'),
		};

		if (dev && isServer) {
			// Добавляем обработчик ошибок модулей для сервера
			const originalRequire = config.resolve;
			config.plugins = config.plugins || [];

			config.plugins.push({
				apply: (compiler: any) => {
					compiler.hooks.compilation.tap('DebugPlugin', (compilation: any) => {
						compilation.hooks.buildModule.tap('DebugPlugin', (module: any) => {
							if (module.resource && module.resource.includes('testing')) {
								console.log('Building module:', module.resource);
							}
						});
					});
				},
			});
		}

		return config;
	},

	serverExternalPackages: [],

	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
