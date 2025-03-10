import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import {
	INewpassData,
	IRegistrationData,
	IRestoreData,
} from '@/types/requestData.types';

import { ACCESSIBLYMAP, API_URL, TOKEN } from '@/app.constants';

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
				console.log('push', data.user, router);
				router.push(`/?map=${data.user}`);
			}

			console.log('auth', data);

			return data;
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.log(error);
		}
	},
};
