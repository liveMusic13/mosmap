'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { API_URL } from '@/app.constants';

// Создаём кэш только на клиенте
let clientCache: Map<
	string,
	{ data: string | null; timestamp: number }
> | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export function useMapId(): string | null {
	console.log('test 2');
	const [mapId, setMapId] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Создаём кэш только при наличии window (на клиенте)
	if (typeof window !== 'undefined' && clientCache === null) {
		clientCache = new Map();
	}

	let searchParams: any;
	let pathname: any;

	try {
		searchParams = useSearchParams();
		pathname = usePathname();
	} catch (error) {
		console.warn('useSearchParams or usePathname not available:', error);
		return null;
	}

	useEffect(() => {
		if (!searchParams || !pathname) return;

		// Отмена предыдущего запроса
		if (abortControllerRef.current) abortControllerRef.current.abort();
		abortControllerRef.current = new AbortController();

		async function getMapId() {
			try {
				const mapFromQuery = searchParams.get('map');
				if (mapFromQuery) {
					setMapId(mapFromQuery);
					return;
				}

				const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
				if (seoUrlMatch) {
					const seoSlug = seoUrlMatch[1];
					const cacheKey = `map-url-${seoSlug}`;
					const now = Date.now();

					// Проверяем клиентский кэш
					const cached = clientCache?.get(cacheKey);
					if (cached && now - cached.timestamp < CACHE_DURATION) {
						console.log('Client cache HIT for:', seoSlug);
						setMapId(cached.data);
						return;
					}

					console.log('Client cache MISS for:', seoSlug, '- fetching from API');

					const response = await fetch(
						`${API_URL}/api/get_objects.php?url=${seoSlug}`,
						{
							signal: abortControllerRef.current?.signal,
						},
					);
					console.log('response test 23', response);

					if (response.ok) {
						const data = await response.json();
						console.log('data', data);
						if (data.map) {
							console.log('Map ID from API:', data.map);
							clientCache?.set(cacheKey, { data: data.map, timestamp: now });
							setMapId(data.map);
							return;
						}
					}
				}

				// Проверяем cookie
				const cookies = document.cookie.split(';');
				const mapCookie = cookies.find(cookie =>
					cookie.trim().startsWith('map='),
				);
				if (mapCookie) {
					const cookieMapId = mapCookie.split('=')[1];
					setMapId(cookieMapId);
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

	console.log('check return mapId', mapId);

	return mapId;
}

// 'use client';

// import Cookies from 'js-cookie';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect, useRef, useState } from 'react';

// import { API_URL, TOKEN } from '@/app.constants';

// // Создаём кэш только на клиенте
// let clientCache: Map<
// 	string,
// 	{ data: string | null; timestamp: number }
// > | null = null;

// const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// export function useMapId(): string | null {
// 	console.log('test 2');
// 	const [mapId, setMapId] = useState<string | null>(null);
// 	const abortControllerRef = useRef<AbortController | null>(null);

// 	// Создаём кэш только при наличии window (на клиенте)
// 	if (typeof window !== 'undefined' && clientCache === null) {
// 		clientCache = new Map();
// 	}

// 	let searchParams: any;
// 	let pathname: any;

// 	try {
// 		searchParams = useSearchParams();
// 		pathname = usePathname();
// 	} catch (error) {
// 		console.warn('useSearchParams or usePathname not available:', error);
// 		return null;
// 	}

// 	useEffect(() => {
// 		if (!searchParams || !pathname) return;

// 		// Отмена предыдущего запроса
// 		if (abortControllerRef.current) abortControllerRef.current.abort();
// 		abortControllerRef.current = new AbortController();

// 		async function getMapId() {
// 			try {
// 				const mapFromQuery = searchParams.get('map');
// 				if (mapFromQuery) {
// 					setMapId(mapFromQuery);
// 					return;
// 				}

// 				const seoUrlMatch = pathname.match(/^\/map\/(.+)$/);
// 				if (seoUrlMatch) {
// 					const seoSlug = seoUrlMatch[1];
// 					const cacheKey = `map-url-${seoSlug}`;
// 					const now = Date.now();

// 					// Проверяем клиентский кэш
// 					const cached = clientCache?.get(cacheKey);
// 					if (cached && now - cached.timestamp < CACHE_DURATION) {
// 						console.log('Client cache HIT for:', seoSlug);
// 						setMapId(cached.data);
// 						return;
// 					}

// 					console.log('Client cache MISS for:', seoSlug, '- fetching from API');

// 					const response = await fetch(
// 						`${API_URL}/api/get_objects.php?url=${seoSlug}`,
// 						{
// 							// headers:{
// 							// 	'Access-Token': Cookies.get(TOKEN)
// 							// },
// 							headers: {
// 								Authorization: `Bearer ${Cookies.get(TOKEN)}`,
// 							},
// 							signal: abortControllerRef.current?.signal,
// 						},
// 					);
// 					console.log('response test 23', response);

// 					if (response.ok) {
// 						const data = await response.json();
// 						console.log('data', data);
// 						if (data.map) {
// 							console.log('Map ID from API:', data.map);
// 							clientCache?.set(cacheKey, { data: data.map, timestamp: now });
// 							setMapId(data.map);
// 							return;
// 						}
// 					}
// 				}

// 				// Проверяем cookie
// 				const cookies = document.cookie.split(';');
// 				const mapCookie = cookies.find(cookie =>
// 					cookie.trim().startsWith('map='),
// 				);
// 				if (mapCookie) {
// 					const cookieMapId = mapCookie.split('=')[1];
// 					setMapId(cookieMapId);
// 					return;
// 				}

// 				setMapId(null);
// 			} catch (error: any) {
// 				if (error.name !== 'AbortError') {
// 					console.error('Error in getMapId:', error);
// 					setMapId(null);
// 				}
// 			}
// 		}

// 		getMapId();

// 		return () => {
// 			if (abortControllerRef.current) {
// 				abortControllerRef.current.abort();
// 			}
// 		};
// 	}, [searchParams, pathname]);

// 	console.log('check return mapId', mapId);

// 	return mapId;
// }
