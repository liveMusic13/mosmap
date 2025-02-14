import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { IRegistrationData } from '@/types/requestData.types';

import { ACCESSIBLYMAP, API_URL, TOKEN } from '@/app.constants';

export const authService = {
	login: async (
		login: string,
		password: string,
		router: ReturnType<typeof useRouter>,
		// setIsAuth: (value: boolean) => void,
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
			}

			console.log('auth', data);
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
};
