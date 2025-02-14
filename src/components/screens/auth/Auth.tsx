'use client';

import { FC } from 'react';

import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';

import styles from './Auth.module.scss';
import { arrFormAuth } from '@/data/entryBlock.data';

const Auth: FC = () => {
	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Авторизация</h1>
			<EntryBlock
				formData={arrFormAuth}
				title_block='Авторизация'
				title='Зарегистрироваться'
				title_link='/registr'
				title_bot='Восстановить пароль'
				link_bot='/'
			/>
		</Layout>
	);
};

export default Auth;
