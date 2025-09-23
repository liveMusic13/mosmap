import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useMapId(): string | null {
	const [mapId, setMapId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const pathname = usePathname();

	useEffect(() => {
		async function getMapId() {
			// Сначала пробуем получить из query параметров
			const mapFromQuery = searchParams.get('map');
			console.log('searchParams', searchParams.toString());

			if (mapFromQuery) {
				setMapId(mapFromQuery);
				return;
			}

			// Проверяем SEO URL
			const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
			if (seoUrlMatch) {
				const seoSlug = seoUrlMatch[1];
				console.log('SEO slug detected:', seoSlug);

				try {
					const response = await fetch(
						// `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${seoSlug}`,
						`/api/map-by-url?url=${seoSlug}`,
					);
					const data = await response.json();

					if (data.mapId) {
						console.log('Map ID from API:', data.mapId);
						setMapId(data.mapId);
						return;
					}
				} catch (error) {
					console.error('Error fetching map ID from API:', error);
				}
			}

			// Если нет в query и API, пробуем получить из cookies
			const cookies = document.cookie.split(';');
			const mapCookie = cookies.find(cookie =>
				cookie.trim().startsWith('map='),
			);

			console.log('All cookies:', document.cookie);
			console.log('заходит в проверку', cookies);

			if (mapCookie) {
				const cookieMapId = mapCookie.split('=')[1];
				console.log('mapCookie.split', cookieMapId);
				setMapId(cookieMapId);
				return;
			}

			// // Последний fallback - decoded token
			// const decodedToken = JSON.parse(Cookies.get(DECODED_TOKEN) || '{}');
			// if (decodedToken.id) {
			//     console.log('второй кук вариант', decodedToken);
			//     setMapId(decodedToken.id);
			//     return;
			// }

			setMapId(null);
		}

		getMapId();
	}, [searchParams, pathname]);

	return mapId;
}
