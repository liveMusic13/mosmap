import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IEditableData } from '@/types/localState.types';
import {
	IFieldsResponse,
	IListsResponse,
	IMapResponse,
} from '@/types/requestData.types';

import { useGetDatabaseSettings } from '@/hooks/useGetDatabaseSettings';

import { getType } from '@/utils/database';

import styles from './DataBaseOptions.module.scss';
import RowDatabaseOptions from './row-database-options/RowDatabaseOptions';
import { arrColumn } from '@/data/database.data';

const DatabaseOptions: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const { query_fields, query_lists, query_maps, query_icons } =
		useGetDatabaseSettings();

	const [mapFullData, setMapFullData] = useState<
		(IFieldsResponse | IMapResponse | IListsResponse)[]
	>([]); //HELP: Стейт для мапинга

	const [editableData, setEditableData] = useState<IEditableData[]>([]);

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

	const handleUpdate = (id: number, field: keyof IEditableData, value: any) => {
		setEditableData(prev =>
			prev.map(item => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};
	const handleSettingsMap = () => router.push(`/settings-map?map=${map}`);

	return (
		<div className={styles.wrapper_dataBaseOptions}>
			<div className={styles.block__dataBaseOptions}>
				<div className={styles.block__titles}>
					{arrColumn.map(el => (
						<h2
							className={styles.title}
							key={el.id}
							style={
								el.name !== 'Наименование столбца' &&
								el.name !== 'Тип' &&
								el.name !== '#'
									? {
											textAlign: 'center',
										}
									: {}
							}
						>
							{el.name}
						</h2>
					))}
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
					/>
				))}
			</div>
			<Button>Добавить новое поле</Button>
			<Button style={{ alignSelf: 'flex-start' }} onClick={handleSettingsMap}>
				Настройка карты
			</Button>
		</div>
	);
};

export default DatabaseOptions;
