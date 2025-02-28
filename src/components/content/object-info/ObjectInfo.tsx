import Cookies from 'js-cookie';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IMarker, IValuesObjectInfo } from '@/types/requestData.types';

import {
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
} from '@/store/store';

import { useDeleteObject } from '@/hooks/useDeleteObject';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';
import { useSaveObject } from '@/hooks/useSaveObject';

import styles from './ObjectInfo.module.scss';
import InfoEdit from './info-edit/InfoEdit';
import Info from './info/Info';
import MenuObject from './menu-object/MenuObject';
import { TOKEN, colors } from '@/app.constants';

const ObjectInfo: FC = () => {
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);

	const searchParams = useSearchParams();
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { refetch: refetch_getDataMap } = useGetDataMap(queryString);

	const { refetch, data, isSuccess, isLoading } = useGetObjectInfo(
		idObjectInfo || 0,
	);
	const { mutate, isSuccess: isSuccess_save } = useSaveObject();
	const { mutate: mutate_delete } = useDeleteObject();

	const token = Cookies.get(TOKEN);

	const [editValuesObject, setEditValuesObject] = useState<IMarker | null>( //HELP: Записываем в стейт данные, чтобы можно было изменять при активной авторизации. А после спокойно отправлять весь объект
		isSuccess ? (data as IMarker) : null,
	);

	useEffect(() => {
		//HELP: За счет изменения id в глобальном сторе, происходит refetch на получение новых данных по новому id
		refetch();
	}, [idObjectInfo, isSuccess_save]);

	//HELP: Обновляем состояние при успешном получении данных
	useEffect(() => {
		if (isSuccess && data) {
			setEditValuesObject(data as IMarker);
		}
	}, [isSuccess, data]);

	const handleClose = () => {
		setIsObjectInfo(false);
		setIsFilters(true);
	};
	const onCallbackNewValue = useCallback(
		(data: { label: string; value: string }) => {
			setEditValuesObject(prev => {
				if (prev && prev.values) {
					const updatedValues = prev.values.map(el =>
						el.label === data.label ? { ...el, value: data.value } : el,
					);
					return {
						...prev,
						values: updatedValues,
					};
				}
				return prev;
			});
		},
		[],
	);
	const resetValue = () => setEditValuesObject(data as IMarker);
	const handleSaveValues = () => {
		mutate(editValuesObject as IMarker);
		const timeoutId = setTimeout(() => refetch_getDataMap(), 1500);

		return () => clearTimeout(timeoutId);
	};
	const deleteObject = () => {
		mutate_delete(idObjectInfo);

		setIsObjectInfo(false);
		setIsFilters(true);

		const timeoutId = setTimeout(() => refetch_getDataMap(), 1500);

		return () => clearTimeout(timeoutId);
	};

	return (
		<div className={styles.wrapper_objectInfo}>
			<div className={styles.block__objectInfo}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>Просмотр обьекта</h2>
					<Button
						style={{
							backgroundColor: 'transparent',
							color: colors.green,
							display: 'flex',
							alignItems: 'center',
						}}
						onClick={handleClose}
					>
						<Image
							src='/images/icons/exit.svg'
							alt='exit'
							width={9}
							height={9}
							className={styles.image_title}
						/>
					</Button>
				</div>
				{!isLoading && <MenuObject />}
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
				<div className={styles.block__info}>
					{isSuccess &&
						data &&
						(data as IMarker)?.values?.map((el, ind) => {
							if (token) {
								let value_info_in_state = {} as IValuesObjectInfo;
								if (editValuesObject?.values) {
									value_info_in_state =
										editValuesObject?.values.find(
											element => element.label === el.label,
										) || ({} as IValuesObjectInfo);
								}
								return (
									<InfoEdit
										key={ind}
										value_info={value_info_in_state}
										callback={onCallbackNewValue}
									/>
								);
							} else {
								return <Info key={ind} value_info={el} />;
							}
						})}
				</div>
			</div>

			{token && (
				<div className={styles.block__buttons}>
					<Button onClick={handleSaveValues}>Сохранить</Button>
					<Button
						style={{ color: colors.grey_light, backgroundColor: 'transparent' }}
						onClick={resetValue}
					>
						Отменить
					</Button>
					<Button
						style={{ color: colors.red, backgroundColor: 'transparent' }}
						onClick={deleteObject}
					>
						Удалить
					</Button>
				</div>
			)}
		</div>
	);
};

export default ObjectInfo;
