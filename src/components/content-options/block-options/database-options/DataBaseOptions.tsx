import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';

import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IEditableData } from '@/types/localState.types';
import { IAllFieldsResponse } from '@/types/requestData.types';

import { useCheckFormatData } from '@/hooks/requests/database-options/useCheckFormatData';
import { useGetAllFields } from '@/hooks/requests/database-options/useGetAllFields';
import { useSaveAllFields } from '@/hooks/requests/database-options/useSaveAllFields';
import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDatabaseSettings } from '@/hooks/useGetDatabaseSettings';

import { getType } from '@/utils/database';

import styles from './DataBaseOptions.module.scss';
import IconAndColorSettings from './icon-and-color-settings/IconAndColorSettings';
import RowDatabaseOptions from './row-database-options/RowDatabaseOptions';
import { ACTUAL_MAP, colors } from '@/app.constants';
import { arrColumn } from '@/data/database.data';

type Props = {
	onDirtyChange: (dirty: boolean) => void;
	provideSave: (fn: () => Promise<void>) => void;
	onNavigateSettings: () => void;
};

const newObj = {
	address: 0,
	id: '0',
	name: '',
	namefield: 0,
	nameonmap: 0,
	priority: '',
	type: 0,
	type_name: '',
	type_object: 'field',
};

const DatabaseOptions: FC<Props> = ({
	onDirtyChange,
	provideSave,
	onNavigateSettings,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mapQuery = searchParams.get('map');
	const map = Cookies.get(ACTUAL_MAP) || mapQuery || null;

	const windowSize = useCheckWidth();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	const isMobile = mounted ? windowSize <= 767 : false;

	const { query_icons } = useGetDatabaseSettings();
	const {
		data: dataAllFields,
		isSuccess: isSuccessAllFields,
		isLoading: isLoadingAllFields,
	} = useGetAllFields();

	const [mapFullData, setMapFullData] = useState<IAllFieldsResponse[]>([]); //HELP: Стейт для мапинга
	const cacheFullDataRef = useRef<IEditableData[]>([]);
	const [editableData, setEditableData] = useState<IEditableData[]>([]);
	const [targetIdObject, setTargetIdObject] = useState<number>(0);
	const [targetNewAddObject, setTargetNewAddObject] = useState();
	const [activeMoveButton, setActiveMoveButton] = useState<{
		isView: boolean;
		id: number | null;
	}>({ isView: false, id: null });
	const [isDeleteObj, setIsDeleteObj] = useState<boolean>(false);
	const [targetColumn, setTargetColumn] = useState({
		isTarget: false,
		column: '',
	});
	const initialDataRef = useRef<IEditableData[]>([]);

	useEffect(() => {
		if (isSuccessAllFields) {
			setMapFullData(dataAllFields);
		}
	}, [dataAllFields, isSuccessAllFields]);

	useEffect(() => {
		if (mapFullData && mapFullData.length > 0) {
			const initialData = mapFullData.map(el => {
				return {
					...el,
					id: Number(el.id),
					type_object: getType(el),
				};
			});

			setEditableData(initialData);
			initialDataRef.current = initialData;
			if (!isDeleteObj) {
				onDirtyChange(false); // первый раз – грязи нет
			} else {
				setIsDeleteObj(false);
			}
		}
	}, [mapFullData]);

	// useEffect(() => {
	// 	//HELP:Для маппинга всех элементов
	// 	if (
	// 		query_fields.isSuccess &&
	// 		query_maps.isSuccess &&
	// 		query_lists.isSuccess
	// 	) {
	// 		const mapFullData = [
	// 			...(query_fields?.data as IFieldsResponse[]),
	// 			...(query_lists?.data as IListsResponse[]),
	// 			...(query_maps?.data as IMapResponse[]),
	// 		];

	// 		setMapFullData(mapFullData);
	// 	}
	// }, [
	// 	query_fields.data as IFieldsResponse[],
	// 	query_maps.data as IMapResponse[],
	// 	query_lists.data as IListsResponse[],
	// ]);

	// useEffect(() => {
	// 	if (mapFullData.length) {
	// 		const initialData = mapFullData.map(item => ({
	// 			id: item.id,
	// 			name: item.name,
	// 			...((item as IFieldsResponse).namefield !== undefined && {
	// 				namefield: (item as IFieldsResponse).namefield,
	// 			}),
	// 			...((item as IFieldsResponse).nameonmap !== undefined && {
	// 				nameonmap: (item as IFieldsResponse).nameonmap,
	// 			}),
	// 			...((item as IFieldsResponse).address !== undefined && {
	// 				address: (item as IFieldsResponse).address,
	// 			}),
	// 			...((item as IFieldsResponse).type !== undefined && {
	// 				type: (item as IFieldsResponse).type,
	// 			}),
	// 			...((item as IListsResponse).mode !== undefined && {
	// 				mode: (item as IListsResponse).mode,
	// 			}),
	// 			...((item as IListsResponse).color !== undefined && {
	// 				color: (item as IListsResponse).color,
	// 			}),
	// 			...((item as IListsResponse).icon !== undefined && {
	// 				icon: (item as IListsResponse).icon,
	// 			}),
	// 			...((item as IMapResponse).visible !== undefined && {
	// 				visible: (item as IMapResponse).visible,
	// 			}),
	// 			type_object: getType(item),
	// 		}));
	// 		setEditableData(initialData);
	// 	}
	// }, [mapFullData]);

	const { mutate, mutateAsync, isSuccess: isSuccess_save } = useSaveAllFields();

	useEffect(() => {
		if (isSuccess_save) {
			router.back();
		}
	}, [isSuccess_save]);

	const handleMovePriority = (id: number, direction: string) => {
		setTargetIdObject(id);

		// Получаем отсортированный массив
		const sortedData = [...mapFullData].sort(
			(a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0),
		);

		const currentIndex = sortedData.findIndex(item => Number(item.id) === id);

		if (currentIndex === -1) return;

		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

		// Проверяем границы
		if (newIndex < 0 || newIndex >= sortedData.length) return;

		// Перемещаем элемент в массиве
		const [movedItem] = sortedData.splice(currentIndex, 1);
		sortedData.splice(newIndex, 0, movedItem);

		// Пересчитываем priority для всех элементов (1, 2, 3, ...)
		const updatedData = sortedData.map((item, index) => ({
			...item,
			priority: String(index + 1),
		}));

		// Создаем Map для быстрого поиска новых priority
		const priorityMap = new Map(
			updatedData.map(item => [Number(item.id), item.priority]),
		);

		// Обновляем состояния
		setMapFullData(prev =>
			prev.map(item => ({
				...item,
				priority: priorityMap.get(Number(item.id)) || item.priority,
			})),
		);

		setEditableData(prev =>
			prev.map(item => ({
				...item,
				priority: priorityMap.get(item.id) || item.priority,
			})),
		);

		onDirtyChange(true);
	};

	const handleUpdate = (
		id: number,
		field: keyof IEditableData,
		value: string,
	) => {
		setTargetIdObject(id);
		setEditableData(prev =>
			prev.map(item => (item.id === id ? { ...item, [field]: value } : item)),
		);
		onDirtyChange(true);
	};
	const handleDelete = (id: number) => {
		setIsDeleteObj(true);
		console.log('id', id);
		setEditableData(prev => prev.filter(el => el.id !== id)); //TODO: Проверить потом нужно ли удалять из этого состояния или достаточно из фулмап, из которого выводятся объекты в таблицу.
		setMapFullData(prev => prev.filter(el => Number(el.id) !== id));
		onDirtyChange(true);
	};
	const handleSettingsMap = () => router.push(`/settings-map?map=${map}`);
	const handleViewSettings = (el: { id: number; name: string }) =>
		setTargetColumn({ isTarget: true, column: el.name });
	const handleCloseTargetPopup = () =>
		setTargetColumn(prev => ({ ...prev, isTarget: false }));
	const handleAddObjectData = () => {
		const findTargetObject = editableData.find(el => el.id === targetIdObject);
		const typeTarget = findTargetObject?.type_object;
		const typeCategory = findTargetObject?.type || 0;

		setMapFullData(prev => {
			return [...prev, newObj];
		});
		onDirtyChange(true);

		// if (typeTarget === 'field') {
		// 	setMapFullData(prev => {
		// 		return [...prev, clearFieldObject(typeTarget, typeCategory)];
		// 	});
		// } else if (typeTarget === 'list') {
		// 	setMapFullData(prev => {
		// 		return [...prev, clearListObject(typeTarget, typeCategory)];
		// 	});
		// } else if (typeTarget === 'map') {
		// 	setMapFullData(prev => {
		// 		return [...prev, clearMapObject(typeTarget, typeCategory)];
		// 	});
		// }
	};

	// отдадим наверх функцию сохранения, оборачивая её в async:
	useEffect(() => {
		provideSave(async () => {
			await mutateAsync(editableData.map(({ type_object, ...rest }) => rest));
			onDirtyChange(false);
		});
	}, [editableData, mutateAsync]);

	useCheckFormatData({
		editableData,
		cacheFullDataRef,
		targetIdObject,
		setEditableData,
		setMapFullData,
	});

	const saveDatabaseData = async () => {
		const formatData = editableData.map(({ type_object, ...rest }) => rest);
		mutate(formatData);
	};

	return (
		<div className={styles.wrapper_dataBaseOptions}>
			{targetColumn.isTarget && (
				<>
					<BackgroundOpacity />
					<IconAndColorSettings
						column={targetColumn.column}
						targetIdObject={targetIdObject}
						closeFunc={handleCloseTargetPopup}
					/>
				</>
			)}
			<div className={styles.block__titles}>
				{arrColumn.map(el => {
					const arrList = editableData.filter(el => el.type_object === 'list');
					const isActive = arrList.some(elem => elem.id === targetIdObject);
					const isShadow =
						isActive && (el.name === 'Иконка' || el.name === 'Цвет');

					return (
						<h2
							className={styles.title}
							key={el.id}
							style={
								el.name !== 'Наименование столбца' &&
								el.name !== 'Тип' &&
								el.name !== '#'
									? {
											textAlign: 'center',
											textShadow: isShadow
												? `0px 0px 10px ${colors.green_shadow}`
												: 'none',
										}
									: {
											textShadow: isShadow
												? `0px 0px 30px ${colors.green_shadow}`
												: 'none',
										}
							}
						>
							{el.name}
							{(el.id === 9 || el.id === 8) && (
								<svg
									className={styles.icon_svg}
									style={{ color: colors.green }}
									onClick={() =>
										isActive ? handleViewSettings(el) : undefined
									}
								>
									<use xlinkHref={`/images/icons/sprite.svg#gear`}></use>
								</svg>
							)}
						</h2>
					);
				})}
			</div>
			<div className={styles.block__dataBaseOptions}>
				{(isLoadingAllFields || query_icons.isLoading) && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{mapFullData
					.sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0))
					.map((el, ind) => (
						<RowDatabaseOptions
							key={ind}
							data={el}
							position={ind}
							editableData={editableData.find(
								d => Number(d.id) === Number(el.id),
							)}
							onUpdate={handleUpdate}
							handleMovePriority={handleMovePriority}
							handleDelete={handleDelete}
							targetIdObject={targetIdObject}
							handleViewSettings={handleViewSettings}
							activeMoveButton={activeMoveButton}
							setActiveMoveButton={setActiveMoveButton}
							setTargetIdObject={setTargetIdObject}
						/>
					))}
			</div>
			<div className={styles.block__buttons_options}>
				<Button
					style={
						isMobile
							? { alignSelf: 'flex-start', marginTop: 'calc(20/480*100vw)' }
							: { alignSelf: 'flex-start' }
					}
					// onClick={handleSettingsMap}
					onClick={onNavigateSettings}
				>
					Настройка карты
				</Button>
				<div className={styles.block__buttons_right}>
					<Button onClick={handleAddObjectData}>Добавить новое поле</Button>
					<Button onClick={saveDatabaseData}>Сохранить</Button>
				</div>
			</div>
		</div>
	);
};

export default DatabaseOptions;

// const clearFieldObject = (type_object: string, type: number) => ({
// 	address: 0,
// 	id: '0',
// 	name: '',
// 	namefield: 0,
// 	nameonmap: 0,
// 	priority: '',
// 	type,
// 	type_name: '',
// 	type_object: type_object,
// });
// const clearListObject = (type_object: string, type: number) => ({
// 	color: 0,
// 	icon: 0,
// 	id: '0',
// 	mode: 0,
// 	priority: '',
// 	name: '',
// 	type,
// 	type_object: type_object,
// });
// const clearMapObject = (type_object: string, type: number) => ({
// 	id: '0',
// 	mode: 0,
// 	name: '',
// 	priority: '',
// 	type,
// 	visible: 0,
// 	type_object: type_object,
// });
