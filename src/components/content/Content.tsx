'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'leaflet-draw/dist/leaflet.draw.css';
import dynamic from 'next/dynamic';
import { CSSProperties, FC, useCallback } from 'react';

import Filters from '@/components/content/filters/Filters';

import { IContent } from '@/types/props.types';

import {
	useActiveAddObjectStore,
	useFiltersStore,
	useListOfObjectsStore,
	useMapLayersStore,
	useObjectInfoStore,
	usePopupStore,
	useSearchAddressStore,
	useSelectAreaStore,
	useViewDotInfoStore,
} from '@/store/store';

import { useCheckActiveInfo } from '@/hooks/useCheckActiveInfo';
import { useCheckDisabledZone } from '@/hooks/useCheckDisabledZone';

import { srcStandard } from '@/utils/pathSvg';

import BackgroundOpacity from '../ui/background-opacity/BackgroundOpacity';
import Button from '../ui/button/Button';
import Loader from '../ui/loader/Loader';
import SearchAddress from '../ui/search-address/SearchAdress';

import styles from './Content.module.scss';
import InfoAboutZone from './info-about-zone/InfoAboutZone';
import ListOfObjects from './list-of-objects/ListOfObjects';
import ObjectInfo from './object-info/ObjectInfo';
import Options from './options/Options';
import { colors } from '@/app.constants';
import { buttonsMap } from '@/data/content.data';

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
	const isActiveAddObject = useActiveAddObjectStore(
		store => store.isActiveAddObject,
	);
	const isPopup = usePopupStore(store => store.isPopup);
	const isSearchAddress = useSearchAddressStore(store => store.isSearchAddress);
	const isSelectArea = useSelectAreaStore(store => store.isSelectArea);
	const clearPolygon = useMapLayersStore(store => store.clearPolygon);
	const isViewDotInfo = useViewDotInfoStore(store => store.isViewDotInfo);

	useCheckActiveInfo(); //HELP: Для того чтобы отключало показ фильтров при показе информации об объекте или при создании объекта
	useCheckDisabledZone(); //HELP: Для того чтобы отключать показ информации о клике на пустую зону при активации хоть одного из окон кроме списка объектов

	const handleClickButtonInMap = useCallback((id: number) => {
		if (id === 0) {
			useSearchAddressStore.setState(state => ({
				isSearchAddress: !state.isSearchAddress,
			}));
		} else if (id === 1) {
			useSelectAreaStore.setState(state => {
				if (state.isSelectArea) {
					clearPolygon();
				}
				return {
					isSelectArea: !state.isSelectArea,
				};
			});
		}
	}, []);

	const personActiveStyle = (id: number): CSSProperties | undefined => {
		if (id === 0) {
			return {
				color: isSearchAddress ? colors.red : colors.green,
			};
		} else if (id === 1) {
			return {
				color: isSelectArea ? colors.red : colors.green,
			};
		}
	};

	return (
		<QueryClientProvider client={queryClient}>
			{/* HELP: Для того чтобы когда глобально вызывается попап, затемнялась область за ним не только в блоке контента, но и во всем приложении */}
			{isPopup && <BackgroundOpacity />}
			<div className={styles.wrapper_content}>
				<h1 className={styles.title}>{dataMap.title}</h1>
				<Options />
				<div className={styles.block__content}>
					{isFilters && !isObjectInfo && !isViewDotInfo && <Filters />}
					{(isActiveAddObject || isObjectInfo) &&
						!isFilters &&
						!isViewDotInfo && <ObjectInfo />}
					{isViewDotInfo &&
						!isFilters &&
						!isObjectInfo &&
						!isActiveAddObject && <InfoAboutZone />}
					{isListOfObjects && <ListOfObjects />}

					<DynamicCustomMap />
					{isSearchAddress && <SearchAddress />}
					<div className={styles.block__buttons_map}>
						{buttonsMap.map(el => (
							<Button
								key={el.id}
								style={{
									width: 'calc(39/1920*100vw)',
									height: 'calc(39/1920*100vw)',
									backgroundColor: colors.white,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
								}}
								onClick={() => handleClickButtonInMap(el.id)}
							>
								<svg
									className={styles.icon_svg}
									style={personActiveStyle(el.id)}
								>
									<use
										xlinkHref={
											isSelectArea && el.id === 1
												? `/images/icons/sprite.svg#selection-remove`
												: srcStandard(el, isListOfObjects, isFilters)
										}
									></use>
								</svg>
								<p className={styles.hover__text} style={{ right: 0 }}>
									{el.hover_text}
								</p>
							</Button>
						))}
					</div>
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default Content;
