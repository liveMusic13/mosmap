'use client';

import { FC } from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';
import PopupInfo from '@/components/ui/popup/Popup';

import { useCallbackPopup } from '@/hooks/useCallbackPopup';

import styles from './Newpass.module.scss';
import { arrFormNewPass } from '@/data/entryBlock.data';

const Newpass: FC = () => {
	const { handleCallback, onClickPopup, popup } = useCallbackPopup();

	return (
		<Layout>
			<Header />
			<h1 className={styles.title}>Восстановление пароля</h1>
			<EntryBlock
				formData={arrFormNewPass}
				title_block='Восстановление пароля '
				title='Зарегистрироваться'
				title_link='/registr'
				title_bot='Войти'
				link_bot='/auth'
				handleCallback={handleCallback}
			/>
			{popup.isPopup && (
				<>
					<BackgroundOpacity />
					<PopupInfo
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

export default Newpass;
