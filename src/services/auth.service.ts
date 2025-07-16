import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import {
	INewpassClientData,
	INewpassData,
	IRegistrationData,
	IRestoreData,
} from '@/types/requestData.types';

import { getDecodedTokenData } from '@/utils/jwtTokenDecoder';

import { $axios } from '@/api';
import {
	ACCESSIBLYMAP,
	API_URL,
	TOKEN,
	USER_LOGIN,
	USER_MAP,
} from '@/app.constants';

export const authService = {
	login: async (
		login: string,
		password: string,
		router: ReturnType<typeof useRouter>,
	) => {
		try {
			const { data } = await axios.post(`${API_URL}/api/get_token.php`, {
				login,
				password,
			});

			if (data.access_token) {
				Cookies.set(TOKEN, data.access_token);
				Cookies.set(ACCESSIBLYMAP, data.user);
				router.push(`/?map=${data.user}`);
				const decoderTokenData = getDecodedTokenData(TOKEN);

				if (decoderTokenData) {
					Cookies.set(USER_LOGIN, login);
					Cookies.set(USER_MAP, String(decoderTokenData.id));
				}

				console.log(getDecodedTokenData(TOKEN));
				//TODO: закончить с доступом. Нужно закинуть в куки что-то типа объекта с номером карты и юзером или просто номер карты и назвать мол доступы или что-то такое. А потом по этому сверять доступ к карте
			}

			console.log('auth', data);

			return data;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	registration: async (data: IRegistrationData) => {
		try {
			const { data: dataResponse } = await axios.post(
				`${API_URL}/api/registr.php`,
				data,
			);

			console.log('dataResponse', dataResponse);

			return dataResponse;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	confirm: async (data: { token: string }) => {
		try {
			const { data: dataResponse } = await axios.post(
				`${API_URL}/api/confirm.php`,
				data,
			);
			console.log('dataResponse', dataResponse);
			return dataResponse;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	restore: async (data: IRestoreData) => {
		try {
			const { data: dataResponse } = await axios.post(
				`${API_URL}/api/restore.php`,
				data,
			);
			console.log('dataResponse', dataResponse);
			return dataResponse;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	newpass: async (data: INewpassData) => {
		try {
			const { data: dataResponse } = await axios.post(
				`${API_URL}/api/newpass.php`,
				data,
			);
			console.log('dataResponse', dataResponse);
			return dataResponse;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
	newpass_client: async (data: INewpassClientData) => {
		try {
			const { data: dataResponse } = await $axios.post(
				`${API_URL}/api/newpass.php`,
				data,
			);
			console.log('dataResponse', dataResponse);
			return dataResponse;
		} catch (axiosError: any) {
			const error = axiosError;
			throw new Error(error.response?.data?.message || error.message);
		}
	},
};
