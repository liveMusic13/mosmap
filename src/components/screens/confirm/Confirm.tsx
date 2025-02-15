'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import styles from './Confirm.module.scss';

const Confirm: FC = () => {
	// const confirm = async () => authService.confirm()
	const par = useSearchParams();
	useEffect(() => {
		console.log(par);
	}, []);

	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Подтверждение пользователя</h1>
			<p>dssd</p>
		</Layout>
	);
};

export default Confirm;
