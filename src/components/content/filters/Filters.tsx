'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { useClearAllFiltersStore } from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetFilters } from '@/hooks/useGetFilters';

import styles from './Filters.module.scss';
import FilterBlock from './filter-block/FilterBlock';
import FilterCalendar from './filter-calendar/FilterCalendar';
import { colors } from '@/app.constants';

const Filters: FC = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();

	const { refetch } = useGetDataMap(queryString);

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
				{!isLoading && <FilterCalendar />}
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
