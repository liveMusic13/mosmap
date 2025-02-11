import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { useGetFilters } from '@/hooks/useGetFilters';

import styles from './Filters.module.scss';
import FilterBlock from './filter-block/FilterBlock';
import FilterCalendar from './filter-calendar/FilterCalendar';
import { colors } from '@/app.constants';

const Filters: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const { data: dataFilters, isLoading } = useGetFilters(map);

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
		</div>
	);
};

export default Filters;
