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
// //HELP: с новым роутом для кастомного url
// import { NextRequest, NextResponse } from 'next/server';
// export async function middleware(req: NextRequest) {
// 	const { searchParams } = req.nextUrl;
// 	const mapParam = searchParams.get('map');
// 	console.log('🔍 Middleware triggered for:', req.nextUrl.href);
// 	console.log('📍 Map param:', mapParam);
// 	// Сначала проверяем ЧПУ редирект
// 	if (mapParam) {
// 		try {
// 			console.log('🌐 Making API request...');
// 			// Принудительно используем внешний API
// 			const apiUrl = `https://mosmap.ru/api/get_objects.php?map=${mapParam}`;
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
// 				console.log('💾 Found URL:', mapUrl);
// 				// Если есть ЧПУ URL, делаем редирект
// 				if (mapUrl) {
// 					const newUrl = new URL(`/custom-url/${mapUrl}`, req.url);
// 					// Сохраняем остальные параметры запроса (кроме map)
// 					searchParams.delete('map');
// 					searchParams.forEach((value, key) => {
// 						newUrl.searchParams.set(key, value);
// 					});
// 					console.log('🔄 Redirecting to:', newUrl.toString());
// 					return NextResponse.redirect(newUrl, 301);
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
// 	const res = NextResponse.next();
// 	if (mapParamForCookie) {
// 		res.cookies.set('map', mapParamForCookie);
// 	} else {
// 		res.cookies.delete('map');
// 	}
// 	return res;
// }
// export const config = {
// 	matcher: [
// 		'/',
// 		'/((?!api/|_next/|images/|fonts/|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|otf|ttf|woff|woff2)$).*)',
// 	],
// };
//HELP: вариант с query параметром
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	// Добавляем логирование для ВСЕХ запросов
	console.log('🚀 MIDDLEWARE START:', req.nextUrl.href);

	const { searchParams } = req.nextUrl;
	const mapParam = searchParams.get('map');

	console.log(
		'🔍 All search params:',
		Object.fromEntries(searchParams.entries()),
	);
	console.log('📍 Map param extracted:', mapParam);

	// Сначала проверяем ЧПУ редирект
	if (mapParam && mapParam !== 'null') {
		console.log('✅ Map param found, starting API check...');

		// ВАЖНО: Проверяем, не является ли mapParam уже ЧПУ-ссылкой
		// Если параметр содержит тире или подчеркивание, скорее всего это уже ЧПУ
		const isAlreadySlug = /[a-zA-Z-_]/.test(mapParam) && mapParam.length > 3;

		if (isAlreadySlug) {
			console.log(
				'🔄 Map param looks like a slug already:',
				mapParam,
				'- skipping redirect',
			);
		} else {
			try {
				console.log('🌐 Making API request...');

				// Принудительно используем внешний API
				const apiUrl = `https://mosmap.ru/api/get_objects.php?map=${mapParam}`;

				console.log('📡 API URL:', apiUrl);

				const response = await fetch(apiUrl, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				console.log('📊 API Response status:', response.status);

				if (response.ok) {
					const data = await response.json();
					console.log('📄 API Response data:', data);

					const mapUrl = data.url && data.url.trim() !== '' ? data.url : null;
					console.log('💾 Found URL:', mapUrl);

					// Если есть ЧПУ URL, делаем редирект
					if (mapUrl && mapUrl !== mapParam) {
						// Дополнительная проверка
						// Создаем URL корректно
						const newUrl = new URL(req.url);
						newUrl.pathname = '/';

						// Удаляем старый параметр map
						newUrl.searchParams.delete('map');
						// Устанавливаем новый map с ЧПУ значением
						newUrl.searchParams.set('map', mapUrl);

						console.log('🔄 NEW URL CREATED:', newUrl.toString());
						console.log('🔄 Redirecting with status 301...');

						const redirectResponse = NextResponse.redirect(newUrl, 301);
						console.log('🔄 REDIRECT RESPONSE CREATED');
						return redirectResponse;
					} else {
						console.log(
							'❌ No URL found in API response or URL same as current',
						);
					}
				} else {
					console.log('❌ API request failed with status:', response.status);
				}
			} catch (error) {
				console.error('💥 Error in API request:', error);
			}
		}
	} else {
		console.log('❌ No valid map param found');
	}

	// Ваша существующая логика с куками
	console.log('🍪 Setting cookie logic...');
	const mapParamForCookie = searchParams.get('map') || null;
	const res = NextResponse.next();

	if (mapParamForCookie && mapParamForCookie !== 'null') {
		console.log('🍪 Setting cookie:', mapParamForCookie);
		res.cookies.set('map', mapParamForCookie);
	} else {
		console.log('🍪 Deleting cookie');
		res.cookies.delete('map');
	}

	console.log('✅ MIDDLEWARE END - returning NextResponse.next()');
	return res;
}

export const config = {
	matcher: [
		'/',
		'/((?!api/|_next/|images/|fonts/|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|otf|ttf|woff|woff2)$).*)',
	],
};
