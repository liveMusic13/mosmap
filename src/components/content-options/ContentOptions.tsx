'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';

import { IContentOptions } from '@/types/props.types';

import styles from './ContentOptions.module.scss';
import BlockOptions from './block-options/BlockOptions';

const queryClient = new QueryClient();

const ContentOptions: FC<IContentOptions> = ({ title }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className={styles.wrapper_contentOptions}>
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.block__content}>
					<BlockOptions />
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default ContentOptions;
