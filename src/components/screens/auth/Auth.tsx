'use client';

import { FC } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';
import Popup from '@/components/ui/popup/Popup';

import { useCallbackPopup } from '@/hooks/useCallbackPopup';

import styles from './Auth.module.scss';
import { arrFormAuth } from '@/data/entryBlock.data';

const Auth: FC = () => {
	const { handleCallback, onClickPopup, popup } = useCallbackPopup();

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
				link_bot='/restore'
				handleCallback={handleCallback}
			/>
			{popup.isPopup && popup.error && (
				<>
					<BackgroundOpacity />
					<Popup
						message={popup.message || `Статус запроса: ${popup.status}`}
						onClick={onClickPopup}
						isHtmlMessage={true}
					/>
				</>
			)}
			<Footer style={{ position: 'absolute', bottom: '0' }} />
		</Layout>
	);
};

export default Auth;
