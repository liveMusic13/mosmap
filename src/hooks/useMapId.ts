// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export function useMapId(): string | null {
// 	const [mapId, setMapId] = useState<string | null>(null);
// 	const searchParams = useSearchParams();
// 	const pathname = usePathname();

// 	useEffect(() => {
// 		async function getMapId() {
// 			// Сначала пробуем получить из query параметров
// 			const mapFromQuery = searchParams.get('map');
// 			console.log('searchParams', searchParams.toString());

// 			if (mapFromQuery) {
// 				setMapId(mapFromQuery);
// 				return;
// 			}

// 			// Проверяем SEO URL
// 			const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
// 			if (seoUrlMatch) {
// 				const seoSlug = seoUrlMatch[1];
// 				console.log('SEO slug detected:', seoSlug);

// 				try {
// 					const response = await fetch(
// 						// `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${seoSlug}`,
// 						`/api/map-by-url?url=${seoSlug}`,
// 					);
// 					const data = await response.json();

// 					if (data.mapId) {
// 						console.log('Map ID from API:', data.mapId);
// 						setMapId(data.mapId);
// 						return;
// 					}
// 				} catch (error) {
// 					console.error('Error fetching map ID from API:', error);
// 				}
// 			}

// 			// Если нет в query и API, пробуем получить из cookies
// 			const cookies = document.cookie.split(';');
// 			const mapCookie = cookies.find(cookie =>
// 				cookie.trim().startsWith('map='),
// 			);

// 			console.log('All cookies:', document.cookie);
// 			console.log('заходит в проверку', cookies);

// 			if (mapCookie) {
// 				const cookieMapId = mapCookie.split('=')[1];
// 				console.log('mapCookie.split', cookieMapId);
// 				setMapId(cookieMapId);
// 				return;
// 			}

// 			// // Последний fallback - decoded token
// 			// const decodedToken = JSON.parse(Cookies.get(DECODED_TOKEN) || '{}');
// 			// if (decodedToken.id) {
// 			//     console.log('второй кук вариант', decodedToken);
// 			//     setMapId(decodedToken.id);
// 			//     return;
// 			// }

// 			setMapId(null);
// 		}

// 		getMapId();
// 	}, [searchParams, pathname]);

// 	return mapId;
// }

'use client';

import Cookies from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { DECODED_TOKEN } from '@/app.constants';

// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export function useMapId(): string | null {
// 	const [mapId, setMapId] = useState<string | null>(null);
// 	const searchParams = useSearchParams();
// 	const pathname = usePathname();

// 	useEffect(() => {
// 		async function getMapId() {
// 			// Сначала пробуем получить из query параметров
// 			const mapFromQuery = searchParams.get('map');
// 			console.log('searchParams', searchParams.toString());

// 			if (mapFromQuery) {
// 				setMapId(mapFromQuery);
// 				return;
// 			}

// 			// Проверяем SEO URL
// 			const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
// 			if (seoUrlMatch) {
// 				const seoSlug = seoUrlMatch[1];
// 				console.log('SEO slug detected:', seoSlug);

// 				try {
// 					const response = await fetch(
// 						// `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${seoSlug}`,
// 						`/api/map-by-url?url=${seoSlug}`,
// 					);
// 					const data = await response.json();

// 					if (data.mapId) {
// 						console.log('Map ID from API:', data.mapId);
// 						setMapId(data.mapId);
// 						return;
// 					}
// 				} catch (error) {
// 					console.error('Error fetching map ID from API:', error);
// 				}
// 			}

// 			// Если нет в query и API, пробуем получить из cookies
// 			const cookies = document.cookie.split(';');
// 			const mapCookie = cookies.find(cookie =>
// 				cookie.trim().startsWith('map='),
// 			);

// 			console.log('All cookies:', document.cookie);
// 			console.log('заходит в проверку', cookies);

// 			if (mapCookie) {
// 				const cookieMapId = mapCookie.split('=')[1];
// 				console.log('mapCookie.split', cookieMapId);
// 				setMapId(cookieMapId);
// 				return;
// 			}

// 			// // Последний fallback - decoded token
// 			// const decodedToken = JSON.parse(Cookies.get(DECODED_TOKEN) || '{}');
// 			// if (decodedToken.id) {
// 			//     console.log('второй кук вариант', decodedToken);
// 			//     setMapId(decodedToken.id);
// 			//     return;
// 			// }

// 			setMapId(null);
// 		}

// 		getMapId();
// 	}, [searchParams, pathname]);

// 	return mapId;
// }

// Глобальный кэш для всего приложения
const globalCache = new Map<
	string,
	{ data: string | null; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export function useMapId(): string | null {
	const [mapId, setMapId] = useState<string | null>(null);

	// Безопасное получение параметров
	let searchParams: any;
	let pathname: any;

	try {
		searchParams = useSearchParams();
		pathname = usePathname();
	} catch (error) {
		// Если хуки недоступны (например, на 404), возвращаем null
		console.warn('useSearchParams or usePathname not available:', error);
		return null;
	}

	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!searchParams || !pathname) return;

		// Отменяем предыдущий запрос если он есть
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		abortControllerRef.current = new AbortController();

		async function getMapId() {
			try {
				// Остальной код такой же...
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

					// Проверяем глобальный кэш
					const cacheKey = `map-url-${seoSlug}`;
					const cached = globalCache.get(cacheKey);
					const now = Date.now();

					if (cached && now - cached.timestamp < CACHE_DURATION) {
						console.log('Client cache HIT for:', seoSlug);
						setMapId(cached.data);
						return;
					}

					try {
						console.log(
							'Client cache MISS for:',
							seoSlug,
							'- fetching from API',
						);
						const response = await fetch(`/api/map-by-url?url=${seoSlug}`, {
							signal: abortControllerRef.current?.signal,
						});

						if (response.ok) {
							const data = await response.json();

							if (data.mapId) {
								console.log('Map ID from API:', data.mapId);

								// Сохраняем в глобальный кэш
								globalCache.set(cacheKey, { data: data.mapId, timestamp: now });

								setMapId(data.mapId);
								return;
							}
						}
					} catch (error: any) {
						if (error.name !== 'AbortError') {
							console.error('Error fetching map ID from API:', error);
						}
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

				// Последний fallback - decoded token
				const decodedToken = JSON.parse(Cookies.get(DECODED_TOKEN) || '{}');
				if (decodedToken.id) {
					console.log('второй кук вариант', decodedToken);
					setMapId(decodedToken.id);
					return;
				}

				setMapId(null);
			} catch (error: any) {
				if (error.name !== 'AbortError') {
					console.error('Error in getMapId:', error);
					setMapId(null);
				}
			}
		}

		getMapId();

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [searchParams, pathname]);

	return mapId;
}
