'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { useMapContext } from '@/providers/MapProvider';

import { useClearAllFiltersStore } from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetFilters } from '@/hooks/useGetFilters';

import { getQueryString } from '@/utils/url';

import styles from './Filters.module.scss';
import FilterBlock from './filter-block/FilterBlock';
import { colors } from '@/app.constants';

const Filters: FC = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const router = useRouter();
	const searchParams = useSearchParams();
	// const map = searchParams.get('map');
	// const map = getMapId(searchParams); // работает с SEO URL
	// const map = useMapId();
	const { mapId: map, loading } = useMapContext();

	// const { mapId: map } = useContext(MapContext);

	// const map = Cookies.get(ACTUAL_MAP) || null;

	// //HELP: Преобразование searchParams в строку
	// const queryString = new URLSearchParams(searchParams.toString()).toString();
	const queryString = getQueryString(searchParams, map); // включает map параметр
	// const resultQuery = map ? `?map=${map}${queryString}` : queryString;
	// const pathname = usePathname(); // "/map/renovation"

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;
	console.log('test map Filters', queryString, map);

	const { refetch } = useGetDataMap(queryString, map);

	const { isClear, setIsClear } = useClearAllFiltersStore(store => store);

	const { data: dataFilters, isLoading, isSuccess } = useGetFilters(map);

	useEffect(() => {
		if (isClear) {
			// router.replace(`/?map=${map}`);
			// window.history.replaceState(null, '', `/?map=${map}`); //HELP: чтобы не срабатывал серверный запрос после изменения адресной строки
			setIsClear(false);
		}
	}, [isClear]);

	const handleClickClear = () => {
		setIsClear(true);
		window.history.replaceState(null, '', `/?map=${map}`); //HELP: чтобы не срабатывал серверный запрос после изменения адресной строки

		const timeoutId = setTimeout(() => {
			console.log('click');
			refetch();
		}, 2000);
		return () => clearTimeout(timeoutId);
	};

	if (loading) {
		return <div>Loading map...</div>;
	}

	return (
		<div className={styles.wrapper_filters}>
			{isMobile && (
				<Button
					style={{ marginBottom: '2rem', width: '100%' }}
					className='button_mobile_header'
					onClick={() => router.back()}
				>
					&larr; Назад
				</Button>
			)}
			<div className={styles.block__title}>
				<h2 className={styles.title}>Фильтры</h2>
				<Button
					style={{
						backgroundColor: 'transparent',
						color: colors.green,
						display: 'flex',
						alignItems: 'center',
					}}
					onClick={handleClickClear}
				>
					<Image
						src='/images/icons/exit.svg'
						alt='exit'
						width={9}
						height={9}
						className={styles.image_title}
					/>
					Сбросить
				</Button>
			</div>
			<div className={styles.block__filters}>
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
				{isSuccess &&
					typeof dataFilters !== 'string' &&
					dataFilters?.map(el => {
						if (
							el.type === 'number' ||
							el.type === 'map' ||
							el.type === 'list'
						) {
							return <FilterBlock key={el.id} filter={el} />;
						}
					})}
				{/* {!isLoading && <FilterCalendar />} */}
			</div>
			<Button
				onClick={() => {
					if (isMobile) {
						router.push(`/?${queryString}`);
					}
					refetch();
				}}
				style={{
					width: '100%',
					height: isMobile ? 'calc(44/480*100vw)' : 'calc(44/1920*100vw)',
					boxShadow: `0px 0px 10px ${colors.green_light}`,
				}}
			>
				Показать
			</Button>
		</div>
	);
};

export default Filters;
