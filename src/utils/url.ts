import { ReadonlyURLSearchParams } from 'next/navigation';

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

		if (mapCookie) {
			return mapCookie.split('=')[1];
		}
	}

	return null;
}

/**
 * Формирует query string с учетом SEO URL
 */
export function getQueryString(searchParams: ReadonlyURLSearchParams): string {
	const mapId = getMapId(searchParams);

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
