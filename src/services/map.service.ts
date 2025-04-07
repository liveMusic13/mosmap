import axios, { AxiosError, AxiosResponse } from 'axios';

import {
	IApiResponse,
	IColorIntervalResponse,
	IColorMapResponse,
	IDataFilters,
	IDataMap,
	IDeleteAndOtherResponses,
	IDotInfoData,
	IHelpSearchAddress,
	IIntervalObject,
	IMarker,
	ISaveSettingsMapResponse,
} from '@/types/requestData.types';

import { $axios } from '@/api';

export const mapService = {
	getObjectISR: async (
		mapParam: string | null,
	): Promise<IApiResponse<IDataMap>> => {
		if (!mapParam || mapParam === 'null') {
			return {
				status: 0,
				data: {
					title: 'Придумать заголовок интерфейса',
					tiles_url: 'https://www.moscowmap.ru/leaflet/tiles/{z}/{x}/{y}.png',
					description: 'Придумать описание интерфейса',
					'all-points': 0,
					bounds: '[[null, null], [null, null]]',
					clastering: 0,
					canvas_map: 0,
					icons_ref: '',
					color_ref: '',
					icons: {
						null: 'null',
					},
					colors: {
						color: '',
					},
					icon_sizes: { arr: [0] },
					points: [],
					zoom_max: 13,
					zoom_min: 0,
				},
			};
		}

		try {
			const response: AxiosResponse<IDataMap> = await $axios.get(
				`/api/get_objects.php?map=${mapParam}`,
			);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (err) {
			//HELP: Типизируем ошибку как AxiosError или Error
			const error = err as AxiosError<{ message?: string }> | Error;
			let statusCode = 500;
			let errorMessage = 'Произошла ошибка при получении данных.';

			//HELP: Проверяем тип ошибки
			if (axios.isAxiosError(error)) {
				statusCode = error.response?.status || 500;
				errorMessage = error.response?.data?.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			return {
				status: statusCode,
				data: {
					title: 'Ошибка получения данных',
					tiles_url: '',
					description: errorMessage,
					'all-points': 0,
					bounds: '[[null, null], [null, null]]',
					clastering: 0,
					canvas_map: 0,
					icons_ref: '',
					color_ref: '',
					icons: { null: 'null' },
					colors: { color: '' },
					icon_sizes: { arr: [0] },
					points: [],
					zoom_max: 13,
					zoom_min: 0,
				},
			};
		}
	},
	getObjectWithFilters: async (
		queryParams: string | null,
	): Promise<IApiResponse<IDataMap>> => {
		if (!queryParams || queryParams === 'null') {
			return {
				status: 0,
				data: {
					title: 'Придумать заголовок интерфейса',
					tiles_url: 'https://www.moscowmap.ru/leaflet/tiles/{z}/{x}/{y}.png',
					description: 'Придумать описание интерфейса',
					'all-points': 0,
					bounds: '[[null, null], [null, null]]',
					clastering: 0,
					canvas_map: 0,
					icons_ref: '',
					color_ref: '',
					icons: {
						null: 'null',
					},
					colors: {
						color: '',
					},
					icon_sizes: { arr: [0] },
					points: [],
					zoom_max: 13,
					zoom_min: 0,
				},
			};
		}

		try {
			const response: AxiosResponse<IDataMap> = await $axios.get(
				`/api/get_objects.php?${queryParams}`,
			);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (err) {
			//HELP: Типизируем ошибку как AxiosError или Error
			const error = err as AxiosError<{ message?: string }> | Error;
			let statusCode = 500;
			let errorMessage = 'Произошла ошибка при получении данных.';

			//HELP: Проверяем тип ошибки
			if (axios.isAxiosError(error)) {
				statusCode = error.response?.status || 500;
				errorMessage = error.response?.data?.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			return {
				status: statusCode,
				data: {
					title: 'Ошибка получения данных',
					tiles_url: '',
					description: errorMessage,
					'all-points': 0,
					bounds: '[[null, null], [null, null]]',
					clastering: 0,
					canvas_map: 0,
					icons_ref: '',
					color_ref: '',
					icons: { null: 'null' },
					colors: { color: '' },
					icon_sizes: { arr: [0] },
					points: [],
					zoom_max: 13,
					zoom_min: 0,
				},
			};
		}
	},
	getFiltersISR: async (
		mapParam: string | null,
	): Promise<IApiResponse<IDataFilters[]>> => {
		if (!mapParam || mapParam === 'null') {
			return {
				status: 0,
				data: [],
			};
		}

		try {
			const response: AxiosResponse<IDataFilters[]> = await $axios.get(
				`/api/filters.php?map=${mapParam}`,
			);
			return {
				status: response.status,
				data: response.data,
			};
		} catch (err) {
			const error = err as AxiosError<{ message?: string }> | Error;
			let statusCode = 500;
			let errorMessage = 'Произошла ошибка при получении данных.';

			//HELP: Проверяем тип ошибки
			if (axios.isAxiosError(error)) {
				statusCode = error.response?.status || 500;
				errorMessage = error.response?.data?.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			return {
				status: statusCode,
				data: [],
			};
		}
	},
	getObjectInfo: async (
		id: number,
	): Promise<
		IApiResponse<IMarker | AxiosError<{ message?: string }> | Error>
	> => {
		try {
			const response: AxiosResponse<IMarker> = await $axios.get(
				`/api/object_info.php?id=${id}`,
			);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	save_object: async (
		map: string,
		marker: IMarker,
	): Promise<
		IApiResponse<IMarker | AxiosError<{ message?: string }> | Error>
	> => {
		try {
			const response: AxiosResponse<IMarker> = await $axios.post(
				`/api/save_object.php?map=${map}`,
				marker,
			);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	save_settings_map: async (): Promise<
		IApiResponse<
			ISaveSettingsMapResponse | AxiosError<{ message?: string }> | Error
		>
	> => {
		try {
			const response: AxiosResponse<ISaveSettingsMapResponse> =
				await $axios.get(`/api/save_settings.php`);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	delete_object: async (
		id: number | null,
	): Promise<
		IApiResponse<
			IDeleteAndOtherResponses | AxiosError<{ message?: string }> | Error
		>
	> => {
		if (!id) throw new Error('Объект не найден');

		try {
			const response: AxiosResponse<IDeleteAndOtherResponses> =
				await $axios.get(`/api/delete_object.php?id=${id}`);
			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	getHelpSearchAddress: async (
		query: string,
	): Promise<
		IApiResponse<
			{ list: IHelpSearchAddress[] } | AxiosError<{ message?: string }> | Error
		>
	> => {
		try {
			const response = await axios.get(
				`https://mosmap.ru/api/adres_response.php?term=${query}`, //TODO: Узнать про тестовый домен и чуть что поменять на константу апи юрл
			);

			return {
				data: response.data,
				status: response.status,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	dotInfo: async (coords: {
		lat: number;
		lng: number;
	}): Promise<
		IApiResponse<IDotInfoData[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (coords.lat === 0 && coords.lng === 0)
			return {
				status: 500,
				data: { message: 'Нет координат' } as AxiosError | Error,
			};

		try {
			const response = await $axios.get(
				`/api/dot_info.php?lat=${coords.lat}&lng=${coords.lng}`,
			);

			return { data: response.data, status: response.status };
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	color_interval: async (
		map: string | number | null,
	): Promise<
		IApiResponse<
			IColorIntervalResponse | AxiosError<{ message?: string }> | Error
		>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(`/api/color_interval.php?map=${map}`);
			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	color_interval_save: async (
		map: string | number | null,
		data: IIntervalObject,
	): Promise<
		IApiResponse<
			IColorIntervalResponse | AxiosError<{ message?: string }> | Error
		>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.post(
				`/api/color_interval.php?map=${map}`,
				data,
			);
			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	color_map: async (
		map: string | number | null,
		sloi: string,
		mode: string,
		field_id: string,
	): Promise<
		IApiResponse<IColorMapResponse[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(
				`/api/color_map.php?map=${map}&sloi=${sloi}&mode=${mode}&field_id=${field_id}`,
			);
			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
};
