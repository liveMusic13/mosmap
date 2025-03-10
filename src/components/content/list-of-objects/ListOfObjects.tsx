import { useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useRef, useState } from 'react';

import Input from '@/components/ui/input/Input';
import Loader from '@/components/ui/loader/Loader';

import { useMapLayersStore } from '@/store/store';

import { useGetDataMap } from '@/hooks/useGetDataMap';

import { isMarkerInsidePolygon } from '@/utils/markersInsidePolygon';

import styles from './ListOfObjects.module.scss';
import List from './list/List';

const ListOfObjects: FC = () => {
	const searchParams = useSearchParams();
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { data, isLoading, isSuccess } = useGetDataMap(queryString);

	const { arrayPolygons, indexTargetPolygon } = useMapLayersStore(
		store => store,
	);

	const [value, setValue] = useState<string>('');

	const objects =
		arrayPolygons.length === 0
			? data?.points
			: data?.points.filter(marker =>
					isMarkerInsidePolygon(marker, arrayPolygons[indexTargetPolygon || 0]),
				);

	//HELP: Ref для хранения ID таймера
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	const [searchValue, setSearchValue] = useState<string>('');

	//HELP: Функция для обработки ввода
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		//HELP: Мгновенно обновляем состояние инпута
		setValue(newValue);

		//HELP: Очищаем предыдущий таймер
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}

		//HELP: Устанавливаем новый таймер для дебаунсинга
		timeoutId.current = setTimeout(
			() => setSearchValue(newValue), //HELP: Обновляем дебаунсированное значение
			500,
		);
	};

	return (
		<div className={styles.wrapper_listOfObjects}>
			<h2 className={styles.title}>Список объектов</h2>
			<div className={styles.block__counts}>
				<div className={styles.block__description}>
					<p className={styles.description}>Всего объектов в списке:</p>
					<p className={styles.count}>{data?.['all-points']}</p>
				</div>
				<div className={styles.block__description}>
					<p className={styles.description}>Всего объектов на карте:</p>
					<p className={styles.count}>
						{data?.points?.filter(el => Array.isArray(el.crd)).length}
					</p>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__list}>
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
				<Input
					type='text'
					value={value}
					onChange={onChange}
					srcImage='/images/icons/search.svg'
					widthImage={16}
					heightImage={16}
					placeholder='Поиск'
					style={{
						width: 'calc(386/1920*100vw)',
						height: 'calc(40/1920*100vw)',
						borderRadius: 'calc(6/1920*100vw)',
						marginLeft: 'calc(11/1920*100vw)',
					}}
					styleInput={{
						outline: 'none',
						fontSize: '1.14rem',
					}}
					styleImage={{
						right: 'calc(12/1920*100vw)',
						width: 'calc(16/1920*100vw)',
						height: 'calc(16/1920*100vw)',
						top: '50%',
						transform: 'translateY(-50%)',
					}}
				/>
				{
					// data?.points //HELP:Предложить вывод ограниченного количества объектов и подгружать их при скроле. Т.к. все равно же есть фильтрация в новой версии
					objects &&
						objects
							.filter(el =>
								(el.name || '')
									.toLowerCase()
									.includes(searchValue.toLowerCase()),
							)
							.map(el => <List key={el.id} el={el} />)
				}
			</div>
		</div>
	);
};

export default ListOfObjects;
