'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useRef } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContentOptions } from '@/types/props.types';

import { useBurgerMenuStore } from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';

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

	const blockOptionsRef = useRef<{ attemptNavigateBack: () => void }>(null);

	const isBurgerMenu = useBurgerMenuStore(store => store.isBurgerMenu);

	const handleBack = () => router.push(`/?map=${map}`);

	console.log(
		'	blockOptionsRef.current?.attemptNavigateBack',
		blockOptionsRef.current,
	);

	return (
		<QueryProvider>
			{isBurgerMenu && isMobile ? (
				<BurgerMenu />
			) : (
				<div className={styles.wrapper_contentOptions}>
					<h1 className={styles.title}>{title}</h1>
					<Button
						onClick={
							() => blockOptionsRef.current?.attemptNavigateBack()
							// ? blockOptionsRef.current?.attemptNavigateBack()
							// : handleBack()
						}
					>
						{pathname === '/import/done' ? 'Назад' : 'На карту'}
					</Button>
					<div className={styles.block__content}>
						<BlockOptions ref={blockOptionsRef} />
					</div>
				</div>
			)}
		</QueryProvider>
	);
};

export default ContentOptions;
