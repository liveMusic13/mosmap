'use client';

import 'leaflet-draw/dist/leaflet.draw.css';
import dynamic from 'next/dynamic';
import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';

import QueryProvider from '@/providers/QueryProvider';

import { IContent } from '@/types/props.types';

import {
	useActiveAddObjectStore,
	useBurgerMenuStore,
	useColorsIntervalStore,
	useFiltersStore,
	useListOfObjectsStore,
	useMapLayersStore,
	useObjectInfoStore,
	usePopupStore,
	useSearchAddressStore,
	useSelectAreaStore,
	useViewDotInfoStore,
	useViewObjectAbdAreaInfoStore,
} from '@/store/store';

import { useCheckActiveInfo } from '@/hooks/useCheckActiveInfo';
import { useCheckDisabledZone } from '@/hooks/useCheckDisabledZone';
import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDisabledRemoveMarker } from '@/hooks/useDisabledRemoveMarker';
import { useDisabledStatesForMobile } from '@/hooks/useDisabledStatesForMobile';

import { srcStandard } from '@/utils/pathSvg';

import BurgerMenu from '../burger-menu/BurgerMenu';
import BackgroundOpacity from '../ui/background-opacity/BackgroundOpacity';
import Button from '../ui/button/Button';
import Loader from '../ui/loader/Loader';
import SearchAddress from '../ui/search-address/SearchAdress';

import styles from './Content.module.scss';
import ColorInterval from './color-interval/ColorInterval';
import InfoAboutZone from './info-about-zone/InfoAboutZone';
import ObjectInfo from './object-info/ObjectInfo';
import ViewObjectInfo from './object-info/view-object-info/ViewObjectInfo';
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
const DynamicFilters = dynamic(() => import('./filters/Filters'), {
	ssr: false,
	loading: () => null,
});
const DynamicLists = dynamic(() => import('./list-of-objects/ListOfObjects'), {
	ssr: false,
	loading: () => null,
});

const Content: FC<IContent> = ({ dataMap }) => {
	const windowSize = useCheckWidth();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	const isMobile = mounted ? windowSize <= 767 : false; //HELP: Делаем эту часть + динамический импорты для списка и фильтров, что не выдавало ошибок гидратации при использовании условий зависящих от размера экрана при обращении к window на сервере

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
	const isColorInterval = useColorsIntervalStore(
		store => store.isColorInterval,
	);
	const isBurgerMenu = useBurgerMenuStore(store => store.isBurgerMenu);
	const { isViewAreaInfo, isViewObjectInfo } = useViewObjectAbdAreaInfoStore(
		store => store,
	);

	useDisabledStatesForMobile(isMobile); //HELP: Для того чтобы отключало состояния фильтров и прочего, чтобы правильные значки отображались
	useCheckActiveInfo(); //HELP: Для того чтобы отключало показ фильтров при показе информации об объекте или при создании объекта
	useCheckDisabledZone(); //HELP: Для того чтобы отключать показ информации о клике на пустую зону при активации хоть одного из окон кроме списка объектов
	useDisabledRemoveMarker(); //HELP: Для того чтобы по правому клику мыши отменялась смена координат

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

	useEffect(() => {
		if (isViewObjectInfo) {
			console.log('isViewObjectInfo', isViewObjectInfo);
		}
		if (isViewAreaInfo) {
			console.log('isViewAreaInfo', isViewAreaInfo);
		}
	}, [isViewAreaInfo, isViewObjectInfo]);

	return (
		<QueryProvider>
			{/* HELP: Для того чтобы когда глобально вызывается попап, затемнялась область за ним не только в блоке контента, но и во всем приложении */}
			{isPopup && <BackgroundOpacity />}

			{isBurgerMenu ? (
				<BurgerMenu />
			) : (
				<div className={styles.wrapper_content}>
					<h1 className={styles.title}>{dataMap.title}</h1>
					<Options />
					<div className={styles.block__content}>
						{!isMobile && isFilters && !isObjectInfo && !isViewDotInfo && (
							<DynamicFilters />
							// <Filters />
						)}
						{!isMobile &&
							(isActiveAddObject || isObjectInfo) &&
							!isFilters &&
							!isViewDotInfo && <ObjectInfo />}
						{!isMobile &&
							isViewDotInfo &&
							!isFilters &&
							!isObjectInfo &&
							!isActiveAddObject && <InfoAboutZone />}
						{!isMobile && isListOfObjects && (
							<DynamicLists />
							// <ListOfObjects />
						)}
						{!isMobile && isColorInterval && <ColorInterval />}
						{isSearchAddress && <SearchAddress />}

						<DynamicCustomMap />
						{isMobile &&
							(isActiveAddObject || isObjectInfo) &&
							!isViewDotInfo && <ObjectInfo />}
						{isMobile &&
							isViewDotInfo &&
							!isObjectInfo &&
							!isActiveAddObject && <InfoAboutZone />}

						{isViewAreaInfo && <ViewObjectInfo area={true} />}
						{isViewObjectInfo && <ViewObjectInfo area={false} />}
						<div className={styles.block__buttons_map}>
							{buttonsMap.map(el => (
								<Button
									key={el.id}
									style={{
										width: isMobile
											? 'calc(39/480*100vw)'
											: 'calc(39/1920*100vw)',
										height: isMobile
											? 'calc(39/480*100vw)'
											: 'calc(39/1920*100vw)',
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
			)}
		</QueryProvider>
	);
};

export default Content;
