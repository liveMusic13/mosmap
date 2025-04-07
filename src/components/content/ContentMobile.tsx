'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContent } from '@/types/props.types';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDisabledStatesForMobile } from '@/hooks/useDisabledStatesForMobile';

import styles from './ContentMobile.module.scss';
import ColorInterval from './color-interval/ColorInterval';
import Filters from './filters/Filters';
import ListOfObjects from './list-of-objects/ListOfObjects';
import Options from './options/Options';

const ContentMobile: FC<IContent> = ({ dataMap }) => {
	const pathname = usePathname();
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	useDisabledStatesForMobile(isMobile); //HELP: Для того чтобы отключало состояния фильтров и прочего, чтобы правильные значки отображались

	return (
		<QueryProvider>
			<div className={styles.wrapper_content}>
				<h1 className={styles.title}>{dataMap.title}</h1>
				<Options />
				<div className={styles.block__content}>
					{pathname === '/mobile-filters/filters' && <Filters />}
					{pathname === '/mobile-filters/list-of-objects' && <ListOfObjects />}
					{pathname === '/mobile-filters/color-interval' && <ColorInterval />}
				</div>
			</div>
		</QueryProvider>
	);
};

export default ContentMobile;
