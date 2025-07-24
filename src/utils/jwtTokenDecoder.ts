import Cookies from 'js-cookie';

import { TOKEN } from '@/app.constants';

// Интерфейс для расшифрованных данных JWT
export interface DecodedJWTPayload {
	id: string; // Base64 encoded ID
	access: string; // Base64 encoded access level
	remote: string; // Remote identifier
	exp: number; // Expiration timestamp
}

// Интерфейс для полностью расшифрованных данных
export interface DecodedTokenData {
	id: number; // Расшифрованный ID карты
	access: number; // Расшифрованный уровень доступа
	remote: string; // Remote identifier
	exp: number; // Expiration timestamp
	isExpired: boolean; // Проверка на истечение токена
}

interface MapAccessResult {
	hasValidToken: boolean;
	hasMapAccess: boolean;
}

/**
 * Декодирует Base64 строку
 */
const decodeBase64 = (str: string): string => {
	try {
		return atob(str);
	} catch (error) {
		console.error('Error decoding base64:', error);
		return '';
	}
};

/**
 * Извлекает payload (средняя часть) из JWT токена
 */
const extractJWTPayload = (token: string): string | null => {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('Invalid JWT format');
		}
		return parts[1]; // Средняя часть между точками
	} catch (error) {
		console.error('Error extracting JWT payload:', error);
		return null;
	}
};

/**
 * Парсит JSON из Base64 строки
 */
const parseBase64JSON = (base64String: string): DecodedJWTPayload | null => {
	try {
		const decodedString = decodeBase64(base64String);
		return JSON.parse(decodedString);
	} catch (error) {
		console.error('Error parsing base64 JSON:', error);
		return null;
	}
};

/**
 * Расшифровывает JWT токен и возвращает данные
 */
export const decodeJWTToken = (token: string): DecodedTokenData | null => {
	if (!token) return null;

	try {
		// Извлекаем payload (средняя часть)
		const payload = extractJWTPayload(token);
		if (!payload) {
			throw new Error('Failed to extract JWT payload');
		}

		// Расшифровываем payload из base64
		const decodedPayload = parseBase64JSON(payload);
		if (!decodedPayload) {
			throw new Error('Failed to decode JWT payload');
		}

		// Расшифровываем id и access из base64
		const decodedId = decodeBase64(decodedPayload.id);
		const decodedAccess = decodeBase64(decodedPayload.access);

		// Конвертируем в числа
		const id = parseInt(decodedId, 10);
		const access = parseInt(decodedAccess, 10);

		// Проверяем истечение токена
		const currentTime = Math.floor(Date.now() / 1000);
		const isExpired = decodedPayload.exp < currentTime;

		return {
			id,
			access,
			remote: decodedPayload.remote,
			exp: decodedPayload.exp,
			isExpired,
		};
	} catch (error) {
		console.error('Error decoding JWT token:', error);
		return null;
	}
};

/**
 * Получает токен из куков
 */
export const getTokenFromCookies = (
	cookieName: string = TOKEN,
): string | null => {
	try {
		const token = Cookies.get(cookieName);
		return token || null;
	} catch (error) {
		console.error('Error getting token from cookies:', error);
		return null;
	}
};

/**
 * Сохраняет токен в куки
 */
export const saveTokenToCookies = (
	token: string,
	cookieName: string = TOKEN,
	options?: Cookies.CookieAttributes,
): void => {
	try {
		const defaultOptions: Cookies.CookieAttributes = {
			expires: 7, // 7 дней
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			...options,
		};

		Cookies.set(cookieName, token, defaultOptions);
	} catch (error) {
		console.error('Error saving token to cookies:', error);
	}
};

/**
 * Удаляет токен из куков
 */
export const removeTokenFromCookies = (cookieName: string = TOKEN): void => {
	try {
		Cookies.remove(cookieName);
	} catch (error) {
		console.error('Error removing token from cookies:', error);
	}
};

/**
 * Основная функция для получения расшифрованных данных из куков
 */
export const getDecodedTokenData = (
	cookieName: string = TOKEN,
): DecodedTokenData | null => {
	const token = getTokenFromCookies(cookieName);
	if (!token) {
		console.warn('No token found in cookies');
		return null;
	}

	return decodeJWTToken(token);
};

/**
 * Проверяет, имеет ли пользователь доступ к карте
 */
// export const hasMapAccess = (
// 	mapId: number | null,
// 	cookieName: string = TOKEN,
// ): boolean => {
// 	if (!mapId) return false;

// 	const tokenData = getDecodedTokenData(cookieName);

// 	if (!tokenData) {
// 		return false;
// 	}

// 	// Проверяем, не истек ли токен
// 	if (tokenData.isExpired) {
// 		console.warn('Token has expired');
// 		return false;
// 	}

// 	// Проверяем доступ к конкретной карте
// 	return tokenData.id === mapId;
// };

export const checkMapAccess = (
	mapId: number | null,
	cookieName: string = TOKEN,
): MapAccessResult => {
	if (!mapId) {
		return {
			hasValidToken: false,
			hasMapAccess: false,
		};
	}

	const tokenData = getDecodedTokenData(cookieName);

	if (!tokenData) {
		return {
			hasValidToken: false,
			hasMapAccess: false,
		};
	}

	// Проверяем, не истек ли токен
	const hasValidToken = !tokenData.isExpired;

	if (!hasValidToken) {
		console.warn('Token has expired');
		return {
			hasValidToken: false,
			hasMapAccess: false,
		};
	}

	// Проверяем доступ к конкретной карте
	const hasMapAccess = tokenData.id === mapId;

	return {
		hasValidToken: true,
		hasMapAccess,
	};
};

/**
 * Получает ID карты из токена
 */
export const getMapIdFromToken = (
	cookieName: string = TOKEN,
): number | null => {
	const tokenData = getDecodedTokenData(cookieName);
	return tokenData && !tokenData.isExpired ? tokenData.id : null;
};

/**
 * Получает уровень доступа из токена
 */
export const getAccessLevelFromToken = (
	cookieName: string = TOKEN,
): number | null => {
	const tokenData = getDecodedTokenData(cookieName);
	return tokenData && !tokenData.isExpired ? tokenData.access : null;
};

// Пример использования:
/*
// Получение расшифрованных данных
const tokenData = getDecodedTokenData();
if (tokenData) {
  console.log('Map ID:', tokenData.id);
  console.log('Access Level:', tokenData.access);
  console.log('Remote:', tokenData.remote);
  console.log('Expires:', new Date(tokenData.exp * 1000));
  console.log('Is Expired:', tokenData.isExpired);
}

// Проверка доступа к карте
const hasAccess = hasMapAccess(2);
console.log('Has access to map 2:', hasAccess);

// Получение ID карты
const mapId = getMapIdFromToken();
console.log('Current map ID:', mapId);
*/
