import {
	ChangeEvent,
	FC,
	MouseEvent,
	useEffect,
	useRef,
	useState,
} from 'react';

import { IHelpSearchAddress } from '@/types/requestData.types';

import {
	useActiveAddObjectStore,
	useCenterMapStore,
	useFiltersStore,
	useListOfObjectsStore,
	useObjectInfoStore,
	useSearchAddressStore,
} from '@/store/store';

import { useGetSearchAddress } from '@/hooks/useGetSearchAddress';

import styles from './SearchAddress.module.scss';

const SearchAddress: FC = () => {
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const isFilters = useFiltersStore(store => store.isFilters);
	const isObjectInfo = useObjectInfoStore(store => store.isObjectInfo);
	const isActiveAddObject = useActiveAddObjectStore(
		store => store.isActiveAddObject,
	);
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);
	const setIsSearchAddress = useSearchAddressStore(
		store => store.setIsSearchAddress,
	);

	const [value, setValue] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);

	const { data, isLoading, isSuccess, refetch } = useGetSearchAddress(value);

	useEffect(() => {
		if (value.length > 2) {
			refetch();
		}
	}, [value]);

	useEffect(() => {
		if (isSuccess && data) {
			const filterValue = (data as { list: IHelpSearchAddress[] }).list.find(
				el => el.name === value,
			); //HELP: Находим в данных от запроса объект с полем которое находится в инпуте.

			if (filterValue && filterValue.coords) {
				//HELP: Если такое поле есть, то возвращает объект. Если у этого объекта есть координаты, то меняем центр карты и отключаем отображение поисковой строки.
				setCenterMap(filterValue.coords);
				setIsSearchAddress(false);
			}
		}
	}, [isSuccess, data]);

	useEffect(() => {
		if (inputRef.current) {
			const timeoutId = setTimeout(() => {
				inputRef.current?.focus(); // Устанавливаем фокус в инпут
			}, 0);

			return () => clearTimeout(timeoutId);
		}
	}, [data]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) =>
		setValue(e.target.value);
	const onClick = (e: MouseEvent<HTMLParagraphElement>) => {
		const selectedValue = e.currentTarget.innerText;

		setValue(selectedValue);
	};

	const transformStyle = () => {
		//HELP: Здесь контролируется позиционирование по горизонтали поисковой строки
		if (isActiveAddObject || isObjectInfo || isFilters || isListOfObjects) {
			if (isFilters && (isObjectInfo || isActiveAddObject)) {
				return 'translateX(-52%)';
			} else if (
				(isFilters || isObjectInfo || isActiveAddObject) &&
				isListOfObjects
			) {
				return 'translateX(45%)';
			}
			return 'translateX(-25%)';
		}
		return 'translateX(-50%)';
	};

	return (
		<div
			className={styles.block__searchAddress}
			style={{
				transform: transformStyle(),
			}}
		>
			<input
				ref={inputRef}
				type='text'
				className={styles.input}
				onChange={onChange}
				value={value}
				placeholder='Введите адрес дома'
			/>
			{isSuccess &&
				data &&
				(data as { list: IHelpSearchAddress[] }).list.length > 0 && (
					<div className={styles.block__variables}>
						{(data as { list: IHelpSearchAddress[] }).list.map((el: any) => (
							<p key={el.id} className={styles.variables} onClick={onClick}>
								{el.name}
							</p>
						))}
					</div>
				)}
		</div>
	);
};

export default SearchAddress;
