import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IEditableData } from '@/types/localState.types';
import {
	IFieldsResponse,
	IListsResponse,
	IMapResponse,
} from '@/types/requestData.types';

import { useMapsEdit } from '@/hooks/requests/database-options/useMapsEdit';
import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDatabaseSettings } from '@/hooks/useGetDatabaseSettings';

import { getType } from '@/utils/database';

import styles from './DataBaseOptions.module.scss';
import IconAndColorSettings from './icon-and-color-settings/IconAndColorSettings';
import RowDatabaseOptions from './row-database-options/RowDatabaseOptions';
import { colors } from '@/app.constants';
import { arrColumn } from '@/data/database.data';

const clearFieldObject = (type_object: string) => ({
	address: 0,
	id: 0,
	name: '',
	namefield: 0,
	nameonmap: 0,
	type: '',
	type_name: '',
	type_object: type_object,
});
const clearListObject = (type_object: string) => ({
	color: 0,
	icon: 0,
	id: 0,
	mode: 0,
	name: '',
	type_object: type_object,
});
const clearMapObject = (type_object: string) => ({
	id: 0,
	mode: 0,
	name: '',
	visible: 0,
	type_object: type_object,
});

const DatabaseOptions: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const windowSize = useCheckWidth();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	const isMobile = mounted ? windowSize <= 767 : false;

	const { query_fields, query_lists, query_maps, query_icons } =
		useGetDatabaseSettings();

	const [mapFullData, setMapFullData] = useState<
		(IFieldsResponse | IMapResponse | IListsResponse)[]
	>([]); //HELP: Стейт для мапинга

	const [editableData, setEditableData] = useState<IEditableData[]>([]);
	const [targetIdObject, setTargetIdObject] = useState<number>(0);
	const [targetColumn, setTargetColumn] = useState({
		isTarget: false,
		column: '',
	});

	useEffect(() => {
		//HELP:Для маппинга всех элементов
		if (
			query_fields.isSuccess &&
			query_maps.isSuccess &&
			query_lists.isSuccess
		) {
			const mapFullData = [
				...(query_fields.data as IFieldsResponse[]),
				...(query_lists.data as IListsResponse[]),
				...(query_maps.data as IMapResponse[]),
			];

			setMapFullData(mapFullData);
		}
	}, [
		query_fields.data as IFieldsResponse[],
		query_maps.data as IMapResponse[],
		query_lists.data as IListsResponse[],
	]);

	useEffect(() => {
		if (mapFullData.length) {
			const initialData = mapFullData.map(item => ({
				id: item.id,
				name: item.name,
				...((item as IFieldsResponse).namefield !== undefined && {
					namefield: (item as IFieldsResponse).namefield,
				}),
				...((item as IFieldsResponse).nameonmap !== undefined && {
					nameonmap: (item as IFieldsResponse).nameonmap,
				}),
				...((item as IFieldsResponse).address !== undefined && {
					address: (item as IFieldsResponse).address,
				}),
				...((item as IFieldsResponse).type !== undefined && {
					type: (item as IFieldsResponse).type,
				}),
				...((item as IListsResponse).mode !== undefined && {
					mode: (item as IListsResponse).mode,
				}),
				...((item as IListsResponse).color !== undefined && {
					color: (item as IListsResponse).color,
				}),
				...((item as IListsResponse).icon !== undefined && {
					icon: (item as IListsResponse).icon,
				}),
				...((item as IMapResponse).visible !== undefined && {
					visible: (item as IMapResponse).visible,
				}),
				type_object: getType(item),
			}));
			setEditableData(initialData);
		}
	}, [mapFullData]);

	const { data, mutate } = useMapsEdit(map, editableData);

	const handleUpdate = (id: number, field: keyof IEditableData, value: any) => {
		setTargetIdObject(id);
		setEditableData(prev =>
			prev.map(item => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};
	const handleDelete = (id: number) => {
		console.log('id', id);
		setEditableData(prev => prev.filter(el => el.id !== id)); //TODO: Проверить потом нужно ли удалять из этого состояния или достаточно из фулмап, из которого выводятся объекты в таблицу.
		setMapFullData(prev => prev.filter(el => el.id !== id));
	};
	const handleSettingsMap = () => router.push(`/settings-map?map=${map}`);
	const handleViewSettings = (el: { id: number; name: string }) =>
		setTargetColumn({ isTarget: true, column: el.name });
	const handleCloseTargetPopup = () =>
		setTargetColumn(prev => ({ ...prev, isTarget: false }));
	const handleAddObjectData = () => {
		const findTargetObject = editableData.find(el => el.id === targetIdObject);
		const typeTarget = findTargetObject?.type_object;

		if (typeTarget === 'field') {
			setMapFullData(prev => {
				return [...prev, clearFieldObject(typeTarget)];
			});
		} else if (typeTarget === 'list') {
			clearListObject;
			setMapFullData(prev => {
				return [...prev, clearListObject(typeTarget)];
			});
		} else if (typeTarget === 'map') {
			setMapFullData(prev => {
				return [...prev, clearMapObject(typeTarget)];
			});
		}
	};

	useEffect(
		() => console.log('editableData', editableData, targetColumn),
		[editableData],
	);

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
			<div className={styles.block__dataBaseOptions}>
				<div className={styles.block__titles}>
					{arrColumn.map(el => {
						const arrList = editableData.filter(
							el => el.type_object === 'list',
						);
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
				{(query_fields.isLoading ||
					query_lists.isLoading ||
					query_maps.isLoading ||
					query_icons.isLoading) && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{mapFullData.map((el, ind) => (
					<RowDatabaseOptions
						key={ind}
						data={el}
						position={ind}
						editableData={editableData.find(d => d.id === el.id)}
						onUpdate={handleUpdate}
						handleDelete={handleDelete}
						targetIdObject={targetIdObject}
						handleViewSettings={handleViewSettings}
					/>
				))}
			</div>
			<Button onClick={handleAddObjectData}>Добавить новое поле</Button>
			<Button onClick={() => mutate({ map, data: editableData })}>
				Сохранить
			</Button>
			<Button
				style={
					isMobile
						? { alignSelf: 'flex-start', marginTop: 'calc(20/480*100vw)' }
						: { alignSelf: 'flex-start' }
				}
				onClick={handleSettingsMap}
			>
				Настройка карты
			</Button>
		</div>
	);
};

export default DatabaseOptions;
