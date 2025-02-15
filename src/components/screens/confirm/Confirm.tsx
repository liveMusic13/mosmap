'use client';

import { useSearchParams } from 'next/navigation';
import { FC, Suspense, useEffect } from 'react';

import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import styles from './Confirm.module.scss';

const SearchParamsComponent = () => {
	const searchParams = useSearchParams();
	useEffect(() => {
		// Получаем токен из параметров запроса
		const token = searchParams?.get('token'); // Используем метод get для получения параметра
		if (token) {
			console.log('Токен:', token);
			// Здесь можно выполнить дополнительные действия с токеном, например, отправить его на сервер
		} else {
			console.error('Токен не найден в адресной строке');
		}
	}, [searchParams]);
	return null;
};

const Confirm: FC = () => {
	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Подтверждение пользователя</h1>
			<p>dssd</p>
			<Suspense fallback={<div>Загрузка...</div>}>
				<SearchParamsComponent />
			</Suspense>
		</Layout>
	);
};

export default Confirm;
