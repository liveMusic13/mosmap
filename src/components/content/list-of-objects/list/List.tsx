'use client';

import { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Ref, forwardRef, memo } from 'react';

import Button from '@/components/ui/button/Button';

import { IMarker } from '@/types/requestData.types';

import {
	useCenterMapStore,
	// useFiltersStore,
	useIdObjectInfoStore,
	useViewStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';

import styles from './List.module.scss';
import { colors } from '@/app.constants';

const List = memo(
	forwardRef(
		(
			{ el, isTarget }: { el: IMarker; isTarget: boolean },
			ref: Ref<HTMLDivElement>,
		) => {
			const router = useRouter();
			const searchParams = useSearchParams();
			const map = searchParams.get('map');
			const windowSize = useCheckWidth();
			const isMobile = windowSize <= 767;

			const setCenterMap = useCenterMapStore(store => store.setCenterMap);
			const setIdObjectInfo = useIdObjectInfoStore(
				store => store.setIdObjectInfo,
			);
			// const setIsFilters = useFiltersStore(store => store.setIsFilters);
			// const setIsObjectInfo = useObjectInfoStore(
			// 	store => store.setIsObjectInfo,
			// );
			const openView = useViewStore(store => store.openView);

			const { refetch, data, isSuccess } = useGetObjectInfo(el.id);

			const onClick = (el: IMarker) => {
				if (isMobile) {
					router.push(`/?map=${map}`);
					if (el.crd) {
						setCenterMap(el.crd as LatLngExpression);
					}
					setIdObjectInfo(el.id);
				} else {
					if (el.crd) setCenterMap(el.crd as LatLngExpression);
					setIdObjectInfo(el.id);
				}
			};

			const handleClickInfo = () => {
				//HELP: Добавляем id объекта для взятия из кэша данных об объекте. Отключаем видимость фильтров и включаем видимость блока информации об объекте. После этого запускаем запрос
				setIdObjectInfo(el.id);
				// setIsFilters(false);
				// setIsObjectInfo(true);
				openView('objectInfo');
				refetch();
			};

			return (
				<div
					key={el.id}
					ref={ref}
					className={styles.block__name}
					style={isTarget ? { backgroundColor: colors.blue_very_light } : {}}
					onClick={handleClickInfo}
				>
					<p className={styles.name}>{el.name}</p>
					<Button
						style={{
							backgroundColor: 'transparent',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 'calc(25/1920*100vw)',
							height: 'calc(25/1920*100vw)',
						}}
						onClick={e => {
							e.stopPropagation();
							onClick(el);
						}}
					>
						<Image
							src={
								el.crd === null
									? '/images/icons/no_coords.svg'
									: '/images/icons/target.svg'
							}
							alt='target'
							width={20}
							height={20}
							className={styles.icon_svg}
						/>
					</Button>
					<p className={styles.hover__text} style={{ right: 0 }}>
						{el.crd === null ? 'Объекта нет на карте' : 'Показать на карте'}
					</p>
				</div>
			);
		},
	),
);

export default List;
