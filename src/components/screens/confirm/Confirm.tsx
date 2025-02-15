'use client';

import { useSearchParams } from 'next/navigation';
import { FC, Suspense, useEffect } from 'react';

import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import styles from './Confirm.module.scss';

const SearchParamsComponent = () => {
	const par = useSearchParams();
	useEffect(() => {
		console.log(par);
	}, [par]);
	return null;
};

// export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
// 	const params = searchParams;
// 	console.log('Server-side params:', params);
// 	return {};
// }

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
