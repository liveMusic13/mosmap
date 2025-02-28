import axios, { AxiosError, AxiosResponse } from 'axios';

import {
	IApiResponse,
	IDataFilters,
	IDataMap,
	IDeleteAndOtherResponses,
	IMarker,
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
				data: error,
			};
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
				data: error,
			};
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
				data: error,
			};
		}
	},
};
