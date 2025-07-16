'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContentOptions } from '@/types/props.types';

import { useBurgerMenuStore } from '@/store/store';

import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useCheckWidth } from '@/hooks/useCheckWidth';

import { checkMapAccess } from '@/utils/jwtTokenDecoder';

import BurgerMenu from '../burger-menu/BurgerMenu';
import Button from '../ui/button/Button';

import styles from './ContentOptions.module.scss';
import BlockOptions from './block-options/BlockOptions';

const ContentOptions: FC<IContentOptions> = ({ title }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	useAuthGuard(() => checkMapAccess(Number(map)).hasValidToken);

	const isBurgerMenu = useBurgerMenuStore(store => store.isBurgerMenu);

	const handleBack = () => router.push(`/?map=${map}`);

	return (
		<QueryProvider>
			{isBurgerMenu && isMobile ? (
				<BurgerMenu />
			) : (
				<div className={styles.wrapper_contentOptions}>
					<h1 className={styles.title}>{title}</h1>
					<Button onClick={handleBack}>
						{pathname === '/import/done' ? 'Назад' : 'На карту'}
					</Button>
					<div className={styles.block__content}>
						<BlockOptions />
					</div>
				</div>
			)}
		</QueryProvider>
	);
};

export default ContentOptions;
