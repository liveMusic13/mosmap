import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { useClearAllFiltersStore } from '@/store/store';

import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetFilters } from '@/hooks/useGetFilters';

import styles from './Filters.module.scss';
import FilterBlock from './filter-block/FilterBlock';
import FilterCalendar from './filter-calendar/FilterCalendar';
import { colors } from '@/app.constants';

const Filters: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { refetch } = useGetDataMap(queryString);

	const { isClear, setIsClear } = useClearAllFiltersStore(store => store);

	const { data: dataFilters, isLoading } = useGetFilters(map);

	useEffect(() => {
		if (isClear) {
			// router.replace(`/?map=${map}`);
			window.history.replaceState(null, '', `/?map=${map}`); //HELP: чтобы не срабатывал серверный запрос после изменения адресной строки
			setIsClear(false);
		}
	}, [isClear]);

	const handleClickClear = () => setIsClear(true);

	return (
		<div className={styles.wrapper_filters}>
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
				{dataFilters?.map(el => {
					if (el.type === 'number' || el.type === 'map' || el.type === 'list') {
						return <FilterBlock key={el.id} filter={el} />;
					}
				})}
				{!isLoading && <FilterCalendar />}
			</div>
			<Button
				onClick={() => {
					// router.push(window.location.href);
					refetch();
				}}
				style={{
					width: '100%',
					height: 'calc(44/1920*100vw)',
					boxShadow: `0px 0px 10px ${colors.green_light}`,
				}}
			>
				Показать
			</Button>
		</div>
	);
};

export default Filters;
