'use client';

import { FC } from 'react';

import BurgerMenu from '@/components/burger-menu/BurgerMenu';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';
import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import EntryBlock from '@/components/ui/entry-block/EntryBlock';
import Popup from '@/components/ui/popup/Popup';

import { useBurgerMenuStore } from '@/store/store';

import { useCallbackPopup } from '@/hooks/useCallbackPopup';

import styles from './Registr.module.scss';
import { arrFormRegistr } from '@/data/entryBlock.data';

const Registr: FC = () => {
	const { handleCallback, onClickPopup, popup } = useCallbackPopup();
	const isBurgerMenu = useBurgerMenuStore(store => store.isBurgerMenu);

	return (
		<Layout>
			<Header />
			{isBurgerMenu ? (
				<BurgerMenu />
			) : (
				<>
					<h1 className={styles.title}>Регистрация</h1>
					<EntryBlock
						formData={arrFormRegistr}
						title_block='Регистрация'
						title='Восстановить пароль'
						title_link='/restore'
						title_bot='Войти'
						link_bot='/auth'
						handleCallback={handleCallback}
						mobile_link='/auth'
						mobile_title='Войти'
					/>
					{popup.isPopup && (
						<>
							<BackgroundOpacity />
							<Popup
								message={popup.message}
								functions={{
									onClick: onClickPopup,
								}}
								isHtmlMessage={true}
							/>
						</>
					)}
					<Footer style={{ position: 'absolute', bottom: '0' }} />
				</>
			)}
		</Layout>
	);
};

export default Registr;
