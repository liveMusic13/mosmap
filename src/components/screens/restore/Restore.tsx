'use client';

import { FC } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';
import Popup from '@/components/ui/popup/Popup';

import { useCallbackPopup } from '@/hooks/useCallbackPopup';

import styles from './Restore.module.scss';
import { arrFormRestore } from '@/data/entryBlock.data';

const Restore: FC = () => {
	const { handleCallback, onClickPopup, popup } = useCallbackPopup();

	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Восстановление пароля</h1>
			<EntryBlock
				formData={arrFormRestore}
				title_block='Восстановление пароля'
				title='Зарегистрироваться'
				title_link='/registr'
				title_bot='Войти'
				link_bot='/auth'
				handleCallback={handleCallback}
			/>
			{popup.isPopup && (
				<>
					<BackgroundOpacity />
					<Popup
						message={popup.message}
						onClick={onClickPopup}
						isHtmlMessage={true}
					/>
				</>
			)}
			<Footer style={{ position: 'absolute', bottom: '0' }} />
		</Layout>
	);
};

export default Restore;
