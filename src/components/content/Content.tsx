'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import Filters from '@/components/content/filters/Filters';

import { IContent } from '@/types/props.types';

import { useFiltersStore, useListOfObjectsStore } from '@/store/store';

import Loader from '../ui/loader/Loader';

import styles from './Content.module.scss';
import ListOfObjects from './list-of-objects/ListOfObjects';
import Options from './options/Options';

const DynamicCustomMap = dynamic(() => import('./custom-map/CustomMap'), {
	ssr: false,
	loading: () => (
		<Loader
			style={{
				width: 'calc(100/1920*100vw)',
				height: 'calc(100/1920*100vw)',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		/>
	),
});

const queryClient = new QueryClient();

const Content: FC<IContent> = ({ dataMap }) => {
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const isFilters = useFiltersStore(store => store.isFilters);

	return (
		<QueryClientProvider client={queryClient}>
			<div className={styles.wrapper_content}>
				<h1 className={styles.title}>{dataMap.title}</h1>
				<Options />
				<div className={styles.block__content}>
					{isFilters && <Filters />}
					{isListOfObjects && <ListOfObjects />}
					<DynamicCustomMap dataMap={dataMap} />
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default Content;
