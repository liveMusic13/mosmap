import axios, { AxiosError } from 'axios';

import {
	IApiResponse,
	IExportResponse,
	IImportResponse,
} from '@/types/requestData.types';

import { $axios } from '@/api';

export const dataService = {
	import: async (
		map: number | string,
		file: File,
		separator: string,
		encoding: string,
	): Promise<
		IApiResponse<IImportResponse | AxiosError<{ message?: string }> | Error>
	> => {
		try {
			const formData = new FormData();
			formData.append('file', file); //HELP: Добавляем файл в FormData
			formData.append('separator', separator); //HELP: Добавляем разделитель в FormData
			formData.append('encoding', encoding); //HELP: Добавляем кодировку в FormData

			const response = await $axios.post(
				`/api/import_load.php?map=${map}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data', //HELP: Указываем тип контента
					},
				},
			);

			return {
				data: response.data,
				status: response.status,
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
	export: async (
		map: number | string,
		dataRequest: {
			separator: string;
			encoding: string;
			uploadfile: string;
			house_id: boolean;
			addCoordinate: boolean;
		},
	): Promise<
		IApiResponse<IExportResponse | AxiosError<{ message?: string }> | Error>
	> => {
		try {
			const data = {
				...dataRequest,
				house_id: String(dataRequest.house_id),
				addCoordinate: String(dataRequest.addCoordinate),
			};

			const params = new URLSearchParams(data);

			const response = await $axios.get(
				`/api/export_done.php?map=${map}&${params}`,
			);

			return {
				data: response.data,
				status: response.status,
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
