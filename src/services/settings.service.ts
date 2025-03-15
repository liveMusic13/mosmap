import axios, { AxiosError } from 'axios';

import {
	IApiResponse,
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
		if (!map) throw new Error('Объект не найден');

		const updatedData = { ...data, map_id: map };

		try {
			const response = await $axios.post(`/api/save_settings.php`, updatedData);

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
