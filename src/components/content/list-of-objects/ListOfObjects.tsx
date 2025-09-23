import { useRouter, useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Loader from '@/components/ui/loader/Loader';

import { useIdObjectInfoStore, useMapLayersStore } from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDataMap } from '@/hooks/useGetDataMap';

import { isMarkerInsidePolygon } from '@/utils/markersInsidePolygon';
import { getMapId, getQueryString } from '@/utils/url';

import styles from './ListOfObjects.module.scss';
import List from './list/List';

const ListOfObjects: FC = () => {
	const router = useRouter();
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const searchParams = useSearchParams();
	const map = getMapId(searchParams); // работает с SEO URL

	// const map = Cookies.get(ACTUAL_MAP);
	// //HELP: Преобразование searchParams в строку
	// const queryString = new URLSearchParams(searchParams.toString()).toString();
	const queryString = getQueryString(searchParams, map); // включает map параметр
	// const resultQuery = map ? `?map=${map}${queryString}` : queryString;
	// const pathname = usePathname(); // "/map/renovation"
	// const searchParams = useSearchParams();

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;

	const { data, isLoading, isSuccess } = useGetDataMap(queryString);
	console.log('in list', queryString, data);

	const { arrayPolygons, indexTargetPolygon } = useMapLayersStore(
		store => store,
	);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	//HELP: Ref для хранения ID таймера
	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const [searchValue, setSearchValue] = useState<string>('');
	const [value, setValue] = useState<string>('');

	const objects =
		arrayPolygons.length === 0
			? data?.points
			: data?.points.filter(marker =>
					isMarkerInsidePolygon(marker, arrayPolygons[indexTargetPolygon || 0]),
				);

	const filteredObjects =
		objects &&
		objects.filter(el =>
			(el.name || '').toLowerCase().includes(searchValue.toLowerCase()),
		);

	useEffect(() => {
		if (!idObjectInfo || !objects) return;

		// Получаем отфильтрованный список с учетом поиска
		const filteredObjects = objects.filter(el =>
			(el.name || '').toLowerCase().includes(searchValue.toLowerCase()),
		);

		// Проверяем, есть ли элемент в текущем списке
		const elementExists = filteredObjects.some(el => el.id === idObjectInfo);
		if (!elementExists) return;

		// Прокручиваем к элементу, если он существует в DOM
		const element = refs.current[idObjectInfo];
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [idObjectInfo, objects, searchValue]);

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
	const handleRef = useCallback(
		(id: string) => (node: HTMLDivElement | null) => {
			refs.current[id] = node;
		},
		[],
	);

	return (
		<div className={styles.wrapper_listOfObjects}>
			{isMobile && (
				<Button
					style={{
						marginBottom: '3rem',
						minHeight: '3.5rem',
						width: '100%',
						borderRadius: '0.675rem',
					}}
					className='button_mobile_header'
					onClick={() => router.back()}
				>
					&larr; Назад
				</Button>
			)}
			<h2 className={styles.title}>Список объектов</h2>
			<div className={styles.block__counts}>
				<div className={styles.block__description}>
					<p className={styles.description}>Всего объектов в списке:</p>
					{/* <p className={styles.count}>{data?.['all-points']}</p> */}
					<p className={styles.count}>
						{filteredObjects?.length || data?.['all-points']}
					</p>
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
					style={
						isMobile
							? {
									width: '100%',
									height: 'calc(40/480*100vw)',
									borderRadius: 'calc(6/480*100vw)',
									// marginLeft: 'calc(11/480*100vw)',
								}
							: {
									width: 'calc(386/1920*100vw)',
									height: 'calc(40/1920*100vw)',
									borderRadius: 'calc(6/1920*100vw)',
									marginLeft: 'calc(11/1920*100vw)',
								}
					}
					styleInput={{
						outline: 'none',
						fontSize: '1.14rem',
					}}
					styleImage={
						isMobile
							? {
									right: 'calc(12/480*100vw)',
									width: 'calc(16/480*100vw)',
									height: 'calc(16/480*100vw)',
									top: '50%',
									transform: 'translateY(-50%)',
								}
							: {
									right: 'calc(12/1920*100vw)',
									width: 'calc(16/1920*100vw)',
									height: 'calc(16/1920*100vw)',
									top: '50%',
									transform: 'translateY(-50%)',
								}
					}
				/>
				{
					// data?.points //HELP:Предложить вывод ограниченного количества объектов и подгружать их при скроле. Т.к. все равно же есть фильтрация в новой версии
					// objects &&
					// 	objects
					filteredObjects &&
						filteredObjects.map(el => (
							<List
								key={el.id}
								el={el}
								ref={handleRef(el.id.toString())}
								isTarget={idObjectInfo === el.id}
							/>
						))
				}
			</div>
		</div>
	);
};

export default ListOfObjects;
