import { FC } from 'react';

import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';

import styles from './Registr.module.scss';
import { arrFormRegistr } from '@/data/entryBlock.data';

const Registr: FC = () => {
	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Регистрация</h1>
			<EntryBlock
				formData={arrFormRegistr}
				title_block='Регистрация'
				title='Восстановить пароль'
				title_link='/'
				title_bot='Войти'
				link_bot='/auth'
			/>
		</Layout>
	);
};

export default Registr;
