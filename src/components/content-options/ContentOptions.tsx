'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContentOptions } from '@/types/props.types';

import Button from '../ui/button/Button';

import styles from './ContentOptions.module.scss';
import BlockOptions from './block-options/BlockOptions';

const ContentOptions: FC<IContentOptions> = ({ title }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const handleBack = () => router.push(`/?map=${map}`);

	return (
		<QueryProvider>
			<div className={styles.wrapper_contentOptions}>
				<h1 className={styles.title}>{title}</h1>
				<Button onClick={handleBack}>
					{pathname === '/import/done' ? 'Назад' : 'На карту'}
				</Button>
				<div className={styles.block__content}>
					<BlockOptions />
				</div>
			</div>
		</QueryProvider>
	);
};

export default ContentOptions;
