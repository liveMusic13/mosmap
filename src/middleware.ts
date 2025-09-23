// import { NextRequest, NextResponse } from 'next/server';
// //HELP: мидлвар для обновления номера карты в куках
// export function middleware(req: NextRequest) {
// 	const url = req.nextUrl;
// 	const mapParam = url.searchParams.get('map') || null;
// 	const res = NextResponse.next();
// 	// res.cookies.set('map', mapParam || 'null');
// 	//HELP: Устанавливаем куку только если параметр есть
// 	if (mapParam) {
// 		res.cookies.set('map', mapParam);
// 	} else {
// 		//HELP: Удаляем куку если параметра нет
// 		res.cookies.delete('map');
// 	}
// 	return res;
// }
// export const config = {
// 	matcher: '/', // HELP: маршруты, для которых будет применяться middleware
// };
import { NextRequest, NextResponse } from 'next/server';

import { TOKEN } from './app.constants';

export async function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const pathname = url.pathname;
	const mapParam = url.searchParams.get('map');

	console.log('Middleware - pathname:', pathname);
	console.log('Middleware - mapParam:', mapParam);

	// Случай 1: SEO URL - просто пропускаем, обработка будет в клиенте
	const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
	if (seoUrlMatch) {
		// Просто пропускаем запрос без изменений
		return NextResponse.next();
	}

	// Случай 2: Обычная логика для параметра map
	const res = NextResponse.next();

	if (mapParam) {
		res.cookies.set('map', mapParam, {
			path: '/',
			httpOnly: false,
			secure: process.env.MODE === 'production',
			sameSite: 'lax',
		});
		console.log('Middleware - SET cookie map:', mapParam);
	}

	if (mapParam && pathname === '/') {
		// Получаем данные для этой карты чтобы проверить наличие URL
		const mapData = await getMapData(mapParam, req);

		if (mapData?.url) {
			// ЗДЕСЬ НАСТОЯЩИЙ 301 редирект на SEO URL
			const seoUrl = new URL(`/map/${mapData.url}`, req.url);
			return NextResponse.redirect(seoUrl, 301);
		}
	}

	return res;
}

export const config = {
	matcher: ['/', '/map/:path*'],
};

//HELP: Новый вариант
// import { NextRequest, NextResponse } from 'next/server';

// import { TOKEN } from './app.constants';

// // Типы для работы с API
// interface GetObjectsResponse {
// 	url?: string;
// 	map?: string;
// 	points: any;
// 	// другие поля ответа
// }

// export async function middleware(req: NextRequest) {
// 	const url = req.nextUrl;
// 	const pathname = url.pathname;
// 	const mapParam = url.searchParams.get('map');

// 	// Добавьте логирование
// 	console.log('Middleware - pathname:', pathname);
// 	console.log('Middleware - mapParam:', mapParam);
// 	console.log(
// 		'Middleware - existing map cookie:',
// 		req.cookies.get('map')?.value,
// 	);
// 	console.log('Middleware - host:', req.headers.get('host'));

// 	// Случай 1: Пользователь зашел по SEO URL (например /map/renovation)
// 	const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);

// 	if (seoUrlMatch) {
// 		// Пользователь зашел по ЧПУ URL - просто обрабатываем как обычно
// 		const seoSlug = seoUrlMatch[1];

// 		// Делаем запрос к API чтобы получить номер карты по URL
// 		const mapId = await getMapIdByUrl(seoSlug, req);
// 		// console.log('test mapid', mapId);

// 		// if (mapId) {
// 		// 	// Внутренне перенаправляем на обычный URL для работы логики
// 		// 	const newUrl = new URL('/', req.url);
// 		// 	newUrl.searchParams.set('map', mapId);

// 		// 	const response = NextResponse.rewrite(newUrl);
// 		// 	response.headers.set('x-seo-url', seoSlug);
// 		// 	// response.cookies.set('map', mapId);
// 		// 	// Исправьте установку куки
// 		// 	response.cookies.set('map', mapId, {
// 		// 		path: '/',
// 		// 		httpOnly: false, // Важно! Чтобы JavaScript мог читать
// 		// 		secure: process.env.MODE === 'production', // HTTPS только в продакшене
// 		// 		sameSite: 'lax',
// 		// 	});

// 		// 	console.log('Middleware - SET cookie map:', mapId);
// 		// 	return response;
// 		// }

// 		if (mapId) {
// 			const newUrl = new URL('/', req.url);
// 			// НЕ добавляем map в query, оставляем SEO URL

// 			const response = NextResponse.rewrite(newUrl);
// 			response.headers.set('x-seo-url', seoSlug);
// 			response.headers.set('x-map-id', mapId); // Передаем через header

// 			// Установка куки для последующих запросов
// 			response.cookies.set('map', mapId, {
// 				path: '/',
// 				httpOnly: false,
// 				secure: process.env.NODE_ENV === 'production',
// 				sameSite: 'lax',
// 			});

// 			console.log('Middleware - SET cookie and header map:', mapId);
// 			return response;
// 		} else {
// 			return new NextResponse('Not Found', { status: 404 });
// 		}
// 	}

// 	// Случай 2: Пользователь зашел с ?map= - нужно проверить, есть ли SEO URL
// 	if (mapParam && pathname === '/') {
// 		// Получаем данные для этой карты чтобы проверить наличие URL
// 		const mapData = await getMapData(mapParam, req);

// 		if (mapData?.url) {
// 			// ЗДЕСЬ НАСТОЯЩИЙ 301 редирект на SEO URL
// 			const seoUrl = new URL(`/map/${mapData.url}`, req.url);
// 			return NextResponse.redirect(seoUrl, 301);
// 		}
// 	}

// 	// Обычная логика для параметра map
// 	const res = NextResponse.next();

// 	if (mapParam) {
// 		// res.cookies.set('map', mapParam);
// 		res.cookies.set('map', mapParam, {
// 			path: '/',
// 			httpOnly: false,
// 			secure: process.env.MODE === 'production',
// 			sameSite: 'lax',
// 		});
// 	} else {
// 		res.cookies.delete('map');
// 	}

// 	return res;
// }

// Функция для получения данных карты (включая URL)
async function getMapData(
	mapId: string,
	req: NextRequest,
): Promise<{ url?: string; map?: string } | null> {
	try {
		const authToken = req.cookies.get(TOKEN)?.value;
		// if (!authToken) {
		// 	// console.error('No auth token found in cookies');
		// 	return null;
		// }

		// Используем переменную окружения для API URL
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/get_objects.php?map=${mapId}`;

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'Access-Token': `${authToken}`,
		};

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			console.error(
				`API request failed: ${response.status} ${response.statusText}`,
			);
			return null;
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching map data:', error);
		return null;
	}
}

// // Функция для получения ID карты по SEO URL
// async function getMapIdByUrl(
// 	seoSlug: string,
// 	req: NextRequest,
// ): Promise<string | null> {
// 	try {
// 		const authToken = req.cookies.get(TOKEN)?.value;
// 		// if (!authToken) {
// 		// 	console.error('No auth token found in cookies');
// 		// 	return null;
// 		// }
// 		// Используем переменную окружения для API URL
// 		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/get_objects.php?url=${seoSlug}`;

// 		console.log('midlvar', process.env.NEXT_PUBLIC_API_URL);

// 		const headers: HeadersInit = {
// 			'Content-Type': 'application/json',
// 			'Access-Token': `${authToken}`,
// 		};

// 		const response = await fetch(apiUrl, {
// 			method: 'GET',
// 			headers,
// 		});

// 		if (!response.ok) {
// 			console.error(
// 				`API request failed: ${response.status} ${response.statusText}`,
// 			);
// 			return null;
// 		}

// 		const data: GetObjectsResponse = await response.json();

// 		return data.map || null;
// 	} catch (error) {
// 		console.error('Error fetching map ID by URL:', error);
// 		return null;
// 	}
// }

// export const config = {
// 	matcher: ['/', '/map/:path*'], // Добавляем обработку SEO URLs
// };
