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
//HELP: Новый вариант
import { NextRequest, NextResponse } from 'next/server';

import { TOKEN } from './app.constants';

// Типы для работы с API
interface GetObjectsResponse {
	url?: string;
	map?: string;
	points: any;
	// другие поля ответа
}

export async function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const pathname = url.pathname;
	const mapParam = url.searchParams.get('map');

	// Случай 1: Пользователь зашел по SEO URL (например /map/renovation)
	const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);

	if (seoUrlMatch) {
		// Пользователь зашел по ЧПУ URL - просто обрабатываем как обычно
		const seoSlug = seoUrlMatch[1];

		// Делаем запрос к API чтобы получить номер карты по URL
		const mapId = await getMapIdByUrl(seoSlug, req);
		// console.log('test mapid', mapId);

		if (mapId) {
			// Внутренне перенаправляем на обычный URL для работы логики
			const newUrl = new URL('/', req.url);
			newUrl.searchParams.set('map', mapId);

			const response = NextResponse.rewrite(newUrl);
			response.headers.set('x-seo-url', seoSlug);
			response.cookies.set('map', mapId);

			return response;
		} else {
			return new NextResponse('Not Found', { status: 404 });
		}
	}

	// Случай 2: Пользователь зашел с ?map= - нужно проверить, есть ли SEO URL
	if (mapParam && pathname === '/') {
		// Получаем данные для этой карты чтобы проверить наличие URL
		const mapData = await getMapData(mapParam, req);

		if (mapData?.url) {
			// ЗДЕСЬ НАСТОЯЩИЙ 301 редирект на SEO URL
			const seoUrl = new URL(`/map/${mapData.url}`, req.url);
			return NextResponse.redirect(seoUrl, 301);
		}
	}

	// Обычная логика для параметра map
	const res = NextResponse.next();

	if (mapParam) {
		res.cookies.set('map', mapParam);
	} else {
		res.cookies.delete('map');
	}

	return res;
}

// Функция для получения данных карты (включая URL)
async function getMapData(
	mapId: string,
	req: NextRequest,
): Promise<{ url?: string; map?: string } | null> {
	try {
		const authToken = req.cookies.get(TOKEN)?.value;
		if (!authToken) {
			console.error('No auth token found in cookies');
			return null;
		}

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

// Функция для получения ID карты по SEO URL
async function getMapIdByUrl(
	seoSlug: string,
	req: NextRequest,
): Promise<string | null> {
	try {
		const authToken = req.cookies.get(TOKEN)?.value;
		if (!authToken) {
			console.error('No auth token found in cookies');
			return null;
		}
		// Используем переменную окружения для API URL
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/get_objects.php?url=${seoSlug}`;

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

		const data: GetObjectsResponse = await response.json();

		return data.map || null;
	} catch (error) {
		console.error('Error fetching map ID by URL:', error);
		return null;
	}
}

export const config = {
	matcher: ['/', '/map/:path*'], // Добавляем обработку SEO URLs
};

// import { NextRequest, NextResponse } from 'next/server';

// import { ACTUAL_MAP } from './app.constants';

// export async function middleware(req: NextRequest) {
// 	const { searchParams } = req.nextUrl;
// 	const mapParam = searchParams.get('map');

// 	console.log('🔍 Middleware triggered for:', req.nextUrl.href);
// 	console.log('📍 Map param:', mapParam);

// 	// Если передан параметр ?map=...
// 	if (mapParam) {
// 		try {
// 			console.log('🌐 Making API request...');
// 			const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?map=${mapParam}`;
// 			console.log('📡 API URL:', apiUrl);

// 			const response = await fetch(apiUrl, {
// 				method: 'GET',
// 				headers: { 'Content-Type': 'application/json' },
// 			});

// 			console.log('📊 API Response status:', response.status);

// 			if (response.ok) {
// 				const data = await response.json();
// 				console.log('📄 API Response data:', data);

// 				const mapUrl = data.url && data.url.trim() !== '' ? data.url : null;

// 				// если есть ЧПУ url → делаем редирект
// 				if (mapUrl) {
// 					const newUrl = new URL(`/map/${mapUrl}`, req.url);

// 					// переносим все query параметры кроме map
// 					searchParams.delete('map');
// 					searchParams.forEach((value, key) => {
// 						newUrl.searchParams.set(key, value);
// 					});

// 					console.log('🔄 Redirecting to:', newUrl.toString());

// 					// создаём redirect response и туда же сетим куку
// 					const redirectRes = NextResponse.redirect(newUrl, 301);
// 					console.log('test data', data);
// 					// redirectRes.cookies.set(ACTUAL_MAP, String(data.map));
// 					redirectRes.cookies.set({
// 						name: ACTUAL_MAP,
// 						value: String(data.map),
// 						path: '/', // обязательно
// 						httpOnly: false, // если хочешь читать её на клиенте
// 						sameSite: 'lax', // или strict
// 						secure: process.env.NODE_ENV === 'production',
// 					});

// 					return redirectRes;
// 				}

// 				// если ЧПУ нет — остаёмся на текущем url, но ставим куку
// 				const nextRes = NextResponse.next();
// 				// nextRes.cookies.set(ACTUAL_MAP, String(data.map));
// 				nextRes.cookies.set({
// 					name: ACTUAL_MAP,
// 					value: String(data.map),
// 					path: '/',
// 					httpOnly: false,
// 					sameSite: 'lax',
// 					secure: process.env.NODE_ENV === 'production',
// 				});
// 				return nextRes;
// 			} else {
// 				console.log('❌ API request failed');
// 			}
// 		} catch (error) {
// 			console.error('💥 Error checking URL:', error);
// 		}
// 	}

// 	// // если параметра ?map= нет — работаем как раньше
// 	// const res = NextResponse.next();
// 	// if (mapParam) {
// 	// 	res.cookies.set(ACTUAL_MAP, mapParam);
// 	// } else {
// 	// 	res.cookies.delete(ACTUAL_MAP);
// 	// }
// 	// return res;
// }

// export const config = {
// 	matcher: [
// 		'/',
// 		'/((?!api/|_next/|images/|fonts/|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|otf|ttf|woff|woff2)$).*)',
// 	],
// };

// //HELP: с новым роутом для кастомного url
// import { NextRequest, NextResponse } from 'next/server';

// import { ACTUAL_MAP } from './app.constants';

// export async function middleware(req: NextRequest) {
// 	const { searchParams } = req.nextUrl;
// 	const mapParam = searchParams.get('map');
// 	const res = NextResponse.next();
// 	console.log('🔍 Middleware triggered for:', req.nextUrl.href);
// 	console.log('📍 Map param:', mapParam);
// 	// Сначала проверяем ЧПУ редирект
// 	if (mapParam) {
// 		try {
// 			console.log('🌐 Making API request...');
// 			// Принудительно используем внешний API
// 			const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?map=${mapParam}`;
// 			console.log('📡 API URL:', apiUrl);
// 			const response = await fetch(apiUrl, {
// 				method: 'GET',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 			});
// 			console.log('📊 API Response status:', response.status);
// 			if (response.ok) {
// 				const data = await response.json();
// 				console.log('📄 API Response data:', data);
// 				const mapUrl = data.url && data.url.trim() !== '' ? data.url : null;
// 				// res.cookies.set(ACTUAL_MAP, data.map);
// 				console.log('💾 Found URL:', mapUrl);
// 				// Если есть ЧПУ URL, делаем редирект
// 				if (mapUrl) {
// 					const newUrl = new URL(`/map/${mapUrl}`, req.url);
// 					// Сохраняем остальные параметры запроса (кроме map)
// 					searchParams.delete('map');
// 					searchParams.forEach((value, key) => {
// 						newUrl.searchParams.set(key, value);
// 					});
// 					console.log('🔄 Redirecting to:', newUrl.toString());
// 					const redirectRes = NextResponse.redirect(newUrl, 301);
// 					redirectRes.cookies.set(ACTUAL_MAP, String(data.map));

// 					return redirectRes;
// 					// return NextResponse.redirect(newUrl, 301);
// 				}
// 			} else {
// 				console.log('❌ API request failed');
// 			}
// 		} catch (error) {
// 			console.error('💥 Error checking URL:', error);
// 		}
// 	}
// 	// Ваша существующая логика с куками
// 	const mapParamForCookie = searchParams.get('map') || null;

// 	if (mapParamForCookie) {
// 		res.cookies.set(ACTUAL_MAP, mapParamForCookie);
// 	} else {
// 		res.cookies.delete(ACTUAL_MAP);
// 	}
// 	return res;
// }
// export const config = {
// 	matcher: [
// 		'/',
// 		'/((?!api/|_next/|images/|fonts/|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|otf|ttf|woff|woff2)$).*)',
// 	],
// };
