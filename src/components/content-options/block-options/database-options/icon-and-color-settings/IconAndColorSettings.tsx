import Cookies from 'js-cookie';
import { FC, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IIconAndColorSettings } from '@/types/props.types';
import { IListItemsResponse } from '@/types/requestData.types';

import { useGetListItems } from '@/hooks/requests/list-items/useGetListItems';
import { useMutateListItems } from '@/hooks/requests/list-items/useMutateListItems';
import { useCheckWidth } from '@/hooks/useCheckWidth';

import styles from './IconAndColorSettings.module.scss';
import ColorSettings from './color-settings/ColorSettings';
import IconsSettings from './icons-settings/IconsSettings';
import { ACTUAL_MAP, colors } from '@/app.constants';

const IconAndColorSettings: FC<IIconAndColorSettings> = ({
	column,
	targetIdObject,
	closeFunc,
}) => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const map = Cookies.get(ACTUAL_MAP) || null;
	const [editListData, setEditListData] = useState<IListItemsResponse[]>([]);

	const { data, isSuccess, isLoading, isError, refetch } = useGetListItems(
		targetIdObject,
		column,
	);

	useEffect(() => {
		if (isSuccess) {
			setEditListData(data as IListItemsResponse[]);
		}
	}, [isSuccess, data]);

	const {
		// 	data: data_mutate,
		isSuccess: isSuccess_mutate,
		// 	isPending: isLoading_mutate,
		mutate,
	} = useMutateListItems(targetIdObject, data as IListItemsResponse[], column);

	useEffect(() => {
		if (isSuccess_mutate) {
			refetch();
			closeFunc();
		}
	}, [isSuccess_mutate]);

	const handleUpdate = (
		id: number,
		field: keyof IListItemsResponse,
		value: any,
	) => {
		setEditListData(prev =>
			prev.map(item => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};
	const handleAddNewObject = () =>
		setEditListData(prev => [...prev, { id: 0, icon_name: '', name: '' }]);
	const handleAddNewObjectColor = () =>
		setEditListData(prev => [...prev, { id: 0, color: '', name: '' }]);
	const handleDelete = (id: number) => {
		setEditListData(prev => prev.filter(el => el.id !== id));
	};
	const handleSaveIcons = () => {
		mutate({ map, items: editListData, id: targetIdObject });
	};

	return (
		<div className={styles.wrapper_iconAndColorSettings}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>Настроить группу</h2>
				<Button onClick={closeFunc}>Назад</Button>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__content}>
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{isSuccess &&
					(column === 'Иконка' || column === 'Наименование столбца') && (
						<>
							<IconsSettings
								isOnlyList={column === 'Наименование столбца'}
								editListData={editListData}
								onUpdate={handleUpdate}
								handleDelete={handleDelete}
							/>
						</>
					)}
				{isSuccess && column === 'Цвет' && (
					<ColorSettings
						editListData={editListData}
						onUpdate={handleUpdate}
						handleDelete={handleDelete}
					/>
				)}
				<Button
					onClick={
						isSuccess && column === 'Цвет'
							? handleAddNewObjectColor
							: handleAddNewObject
					}
					style={{ marginTop: 'calc(16/1920*100vw)' }}
				>
					ДОБАВИТЬ
				</Button>
				<Button
					onClick={handleSaveIcons}
					style={{
						marginTop: isMobile ? 'calc(16/480*100vw)' : 'calc(16/1920*100vw)',
						width: '100%',
						boxShadow: `0px 0px 15px ${colors.green_light}`,
					}}
				>
					Сохранить
				</Button>
			</div>
		</div>
	);
};

export default IconAndColorSettings;
