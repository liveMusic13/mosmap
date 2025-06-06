import { AxiosError } from 'axios';

import {
	IApiResponse,
	IExportResponse,
	IImportDoneResponse,
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
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	import_done: async (
		map: number | string,
		option: { uploadfile: string; separator: string; encoding: string },
		requestBody: { [key: string]: string },
	): Promise<
		IApiResponse<IImportDoneResponse | AxiosError<{ message?: string }> | Error>
	> => {
		const { encoding, separator, uploadfile } = option;
		try {
			const data = {
				uploadfile: uploadfile,
				separator: separator,
				encoding: encoding,
				...requestBody,
			};

			const response = await $axios.post(
				`/api/import_done.php?map=${map}`,
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
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
};
