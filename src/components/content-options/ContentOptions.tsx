'use client';

import { FC } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContentOptions } from '@/types/props.types';

import styles from './ContentOptions.module.scss';
import BlockOptions from './block-options/BlockOptions';

const ContentOptions: FC<IContentOptions> = ({ title }) => {
	return (
		<QueryProvider>
			<div className={styles.wrapper_contentOptions}>
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.block__content}>
					<BlockOptions />
				</div>
			</div>
		</QueryProvider>
	);
};

export default ContentOptions;
