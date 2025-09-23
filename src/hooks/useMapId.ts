import { ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useMapId(searchParams: ReadonlyURLSearchParams): string | null {
	const [mapId, setMapId] = useState<string | null>(() => {
		// Инициализация только query параметрами (доступно на сервере)
		return searchParams.get('map');
	});

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Если уже есть mapId из query, не проверяем cookies
		const mapFromQuery = searchParams.get('map');
		if (mapFromQuery) {
			setMapId(mapFromQuery);
			return;
		}

		// Проверяем cookies только в браузере
		const cookies = document.cookie.split(';');
		const mapCookie = cookies.find(cookie => cookie.trim().startsWith('map='));

		if (mapCookie) {
			const cookieValue = mapCookie.split('=')[1];
			console.log('mapCookie.split', cookieValue);
			setMapId(cookieValue);
		} else {
			setMapId(null);
		}
	}, [searchParams]);

	// Возвращаем null до монтирования, если нет query параметра
	if (!mounted && !searchParams.get('map')) {
		return null;
	}

	return mapId;
}
