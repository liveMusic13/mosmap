'use client';

import { FC, useState } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';
import Loader from '@/components/ui/loader/Loader';
import Popup from '@/components/ui/popup/Popup';

import { useCallbackPopup } from '@/hooks/useCallbackPopup';

import styles from './Auth.module.scss';
import { arrFormAuth } from '@/data/entryBlock.data';

const Auth: FC = () => {
	const { handleCallback, onClickPopup, popup } = useCallbackPopup();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<Layout>
			{isLoading && (
				<>
					<BackgroundOpacity />
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
				</>
			)}
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
				setIsLoading={setIsLoading}
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
