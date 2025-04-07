import { AxiosError } from 'axios';

import {
	IApiResponse,
	IFieldsResponse,
	IListsResponse,
	IMapResponse,
	ISaveSettingsMapResponse,
} from '@/types/requestData.types';

import { $axios } from '@/api';

export const settingsService = {
	saveEditingDataSettingsMap: async (
		map: number | string | null,
		data: ISaveSettingsMapResponse,
	): Promise<
		IApiResponse<
			ISaveSettingsMapResponse | AxiosError<{ message?: string }> | Error
		>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		const updatedData = { ...data, map_id: map };

		try {
			const response = await $axios.post(`/api/save_settings.php`, updatedData);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	maps: async (
		map: number | string | null,
	): Promise<
		IApiResponse<IMapResponse[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(`/api/maps.php?map=${map}`);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	lists: async (
		map: number | string | null,
	): Promise<
		IApiResponse<IListsResponse[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(`/api/lists.php?map=${map}`);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	fields: async (
		map: number | string | null,
	): Promise<
		IApiResponse<IFieldsResponse[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(`/api/fields.php?map=${map}`);

			return {
				status: response.status,
				data: response.data,
			};
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	getIcons: async (
		map: number | string | null,
	): Promise<
		IApiResponse<string[] | AxiosError<{ message?: string }> | Error>
	> => {
		if (!map) throw new Error('Номер карты не найден');

		try {
			const response = await $axios.get(`/api/get_icons.php?map=${map}`);

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
