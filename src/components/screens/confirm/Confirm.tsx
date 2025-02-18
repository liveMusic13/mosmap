'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import Popup from '@/components/ui/popup/Popup';

import { IPopupErrorInConfirmPage } from '@/types/localState.types';

import styles from './Confirm.module.scss';
import { ACCESSIBLYMAP, TOKEN } from '@/app.constants';
import { authService } from '@/services/auth.service';

const Confirm: FC = () => {
	const router = useRouter();
	const [token, setToken] = useState<string>('');
	const [popupError, setPopupError] = useState<IPopupErrorInConfirmPage>({
		isPopup: false,
		message: '',
	});

	useEffect(() => {
		//HELP: Получаем полную строку запроса из URL
		const queryString = window.location.search;

		//HELP: Удаляем символ "?" в начале строки
		const token = queryString.startsWith('?')
			? queryString.slice(1)
			: queryString;

		if (token) {
			console.log('Токен:', token);
			//HELP: Здесь можно отправить токен на сервер или выполнить другие действия
			setToken(token);
		} else {
			console.error('Токен не найден в адресной строке');
		}
	}, []);

	const addResponse = async () => {
		const response = await authService.confirm({ token });

		if (response.status === 'OK') {
			Cookies.set(ACCESSIBLYMAP, String(response.map));
			Cookies.set(TOKEN, response.token);
			router.push(`/?map=${response.map}`);
		} else if (response.status === 'error') {
			setPopupError({
				isPopup: true,
				message: response.message,
			});
		}
	};

	const onClick = () => router.push('/auth');

	useEffect(() => {
		if (token !== '') addResponse();
	}, [token]);

	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Подтверждение пользователя</h1>
			{popupError.isPopup && (
				<Popup
					message={popupError.message}
					onClick={onClick}
					isHtmlMessage={true}
				/>
			)}
			<Footer style={{ position: 'absolute', bottom: '0' }} />
		</Layout>
	);
};

export default Confirm;
