'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic';
import { FC } from 'react';

import Filters from '@/components/content/filters/Filters';

import { IContent } from '@/types/props.types';

import {
	useFiltersStore,
	useListOfObjectsStore,
	useObjectInfoStore,
} from '@/store/store';

import Loader from '../ui/loader/Loader';

import styles from './Content.module.scss';
import ListOfObjects from './list-of-objects/ListOfObjects';
import ObjectInfo from './object-info/ObjectInfo';
import Options from './options/Options';

const DynamicCustomMap = dynamic(() => import('./custom-map/CustomMap'), {
	ssr: false,
	loading: () => (
		<Loader
			style={{
				width: 'calc(100/1920*100vw)',
				height: 'calc(100/1920*100vw)',
				position: 'relative',
				left: '25%',
				top: '50%',
				transform: 'translate(-25%, -50%)',
			}}
		/>
	),
});

const queryClient = new QueryClient();

const Content: FC<IContent> = ({ dataMap }) => {
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const isFilters = useFiltersStore(store => store.isFilters);
	const isObjectInfo = useObjectInfoStore(store => store.isObjectInfo);

	return (
		<QueryClientProvider client={queryClient}>
			{/* TODO: Потом удалить девтулс из зависимостей и тут */}
			<ReactQueryDevtools initialIsOpen={false} />
			<div className={styles.wrapper_content}>
				<h1 className={styles.title}>{dataMap.title}</h1>
				<Options />
				<div className={styles.block__content}>
					{isFilters && !isObjectInfo && <Filters />}
					{isObjectInfo && !isFilters && <ObjectInfo />}
					{isListOfObjects && <ListOfObjects />}
					<DynamicCustomMap />
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default Content;
