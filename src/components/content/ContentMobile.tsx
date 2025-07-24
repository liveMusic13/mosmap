'use client';

import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContent } from '@/types/props.types';

import { useBurgerMenuStore } from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDisabledStatesForMobile } from '@/hooks/useDisabledStatesForMobile';

import BurgerMenu from '../burger-menu/BurgerMenu';

import styles from './ContentMobile.module.scss';
import ColorInterval from './color-interval/ColorInterval';
import Filters from './filters/Filters';
import ListOfObjects from './list-of-objects/ListOfObjects';

const DynamicOptions = dynamic(() => import('./options/Options'), {
	ssr: false,
});

const ContentMobile: FC<IContent> = ({ dataMap }) => {
	const pathname = usePathname();
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	// useAuthGuard(() => hasMapAccess(Number(map)));
	// useAuthGuard(() => checkMapAccess(Number(map)).hasValidToken);

	const isBurgerMenu = useBurgerMenuStore(store => store.isBurgerMenu);

	useDisabledStatesForMobile(isMobile); //HELP: Для того чтобы отключало состояния фильтров и прочего, чтобы правильные значки отображались

	return (
		<QueryProvider>
			{isBurgerMenu ? (
				<BurgerMenu />
			) : (
				<div className={styles.wrapper_content}>
					<h1 className={styles.title}>{dataMap.title}</h1>
					<DynamicOptions />
					<div className={styles.block__content}>
						{pathname === '/mobile-filters/filters' && <Filters />}
						{pathname === '/mobile-filters/list-of-objects' && (
							<ListOfObjects />
						)}
						{pathname === '/mobile-filters/color-interval' && <ColorInterval />}
					</div>
				</div>
			)}
		</QueryProvider>
	);
};

export default ContentMobile;
