import type { Metadata } from 'next';

import { MapProvider } from '@/providers/MapProvider';

//@ts-ignore
import '@/styles/global.scss';

export const metadata: Metadata = {
	title: 'MOSMAP | Геоаналитика',
	description: 'MosMap-Marker. Программное обеспечение для геоаналитики',
	icons: {
		icon: '/images/icons/logo_mini.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru'>
			<MapProvider>
				<body>
					{/* <YandexMetrika />
					<MailRu /> */}

					{/* <script>window.yaContextCb=window.yaContextCb||[]</script>
					<script src='https://yandex.ru/ads/system/context.js' async></script> */}

					{/* <FullscreenDesktop />
					<FullscreenMobile /> */}
					{children}
				</body>
			</MapProvider>
		</html>
	);
}
