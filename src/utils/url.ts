import Cookies from 'js-cookie';
import { ReadonlyURLSearchParams } from 'next/navigation';

import { DECODED_TOKEN } from '@/app.constants';

//HELP: Не использую хуки useRouter и useSearchParams из next, потому что если с их помощью добавлять/удалять query параметры в адресную строку, происходят серверные запросы. Т.к. next воспринимает изменение адресной строки как возможное изменение контента на странице и поэтому запрашивает новые данные. При использовании нативных new URLSearchParams(window.location.search) и window.history.replaceState(null, '', newUrl) запросов не происходит.
export const updateUrlParams = (newParams: Record<string, string | null>) => {
	const params = new URLSearchParams(window.location.search);

	//HELP: Обновляем существующие параметры
	Object.entries(newParams).forEach(([key, value]) => {
		if (value === null) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	});

	const newUrl = `?${params.toString()}`;

	//HELP: Меняем URL без триггера ререндеринга RSC
	window.history.replaceState(null, '', newUrl);
};

/**
 * Получает номер карты из URL или headers
 * Работает как с обычными URL (?map=7), так и с SEO URL (/map/renovation)
 */
export function getMapId(searchParams: ReadonlyURLSearchParams): string | null {
	// Сначала пробуем получить из query параметров
	const mapFromQuery = searchParams.get('map');
	console.log('searchParams', searchParams);
	if (mapFromQuery) {
		return mapFromQuery;
	}

	// Если нет в query, пробуем получить из cookies (установлено middleware)
	if (typeof document !== 'undefined') {
		const cookies = document.cookie.split(';');
		const mapCookie = cookies.find(cookie => cookie.trim().startsWith('map='));
		const decodedToken = JSON.parse(Cookies.get(DECODED_TOKEN) || '{}');
		console.log('заходит в проверку', cookies);

		if (mapCookie) {
			console.log('mapCookie.split', mapCookie.split('=')[1]);

			return mapCookie.split('=')[1];
		} else if (decodedToken.id) {
			console.log('второй кук вариант', decodedToken);
			return decodedToken.id;
		}
	}

	return null;
}

// // Серверная версия
// export function getMapIdServer(searchParams: ReadonlyURLSearchParams): string | null {
// 	const mapFromQuery = searchParams.get('map');
// 	if (mapFromQuery) {
// 		return mapFromQuery;
// 	}

// 	try {
// 		const cookieStore = cookies();
// 		const mapCookie = cookieStore.get('map');
// 		return mapCookie?.value || null;
// 	} catch (error) {
// 		console.error('Error reading server cookies:', error);
// 		return null;
// 	}
// }

// // Клиентская версия
// export function getMapIdClient(searchParams: ReadonlyURLSearchParams): string | null {
// 	const mapFromQuery = searchParams.get('map');
// 	if (mapFromQuery) {
// 		return mapFromQuery;
// 	}

// 	if (typeof document !== 'undefined') {
// 		const cookies = document.cookie.split(';');
// 		const mapCookie = cookies.find(cookie => cookie.trim().startsWith('map='));

// 		if (mapCookie) {
// 			return mapCookie.split('=')[1];
// 		}
// 	}

// 	return null;
// }
/**
 * Формирует query string с учетом SEO URL
 */
export function getQueryString(
	searchParams: ReadonlyURLSearchParams,
	mapId: string | null,
): string {
	// const mapId = getMapId(searchParams);

	if (!mapId) {
		return searchParams.toString();
	}

	// Создаем новый URLSearchParams с номером карты
	const params = new URLSearchParams(searchParams.toString());

	// Убеждаемся что параметр map есть
	if (!params.has('map')) {
		params.set('map', mapId);
	}

	return params.toString();
}
