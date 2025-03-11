import { LatLngExpression } from 'leaflet';
import Image from 'next/image';
import { memo } from 'react';

import Button from '@/components/ui/button/Button';

import { IMarker } from '@/types/requestData.types';

import {
	useCenterMapStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
} from '@/store/store';

import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';

import styles from './List.module.scss';

const List = memo(({ el }: { el: IMarker }) => {
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);

	const { refetch, data, isSuccess } = useGetObjectInfo(el.id);

	const onClick = (el: IMarker) => {
		if (el.crd) setCenterMap(el.crd as LatLngExpression);
	};
	const handleClickInfo = () => {
		//HELP: Добавляем id объекта для взятия из кэша данных об объекте. Отключаем видимость фильтров и включаем видимость блока информации об объекте. После этого запускаем запрос
		setIdObjectInfo(el.id);
		setIsFilters(false);
		setIsObjectInfo(true);
		refetch();
	};

	return (
		<div key={el.id} className={styles.block__name}>
			<p className={styles.name} onClick={handleClickInfo}>
				{el.name}
			</p>
			<Button
				style={{
					backgroundColor: 'transparent',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 'calc(25/1920*100vw)',
					height: 'calc(25/1920*100vw)',
				}}
				onClick={() => onClick(el)}
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
});

export default List;
