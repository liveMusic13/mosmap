import Cookies from 'js-cookie';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';
import Popup from '@/components/ui/popup/Popup';

import {
	IItemFilter,
	IMarker,
	IValuesObjectInfo,
} from '@/types/requestData.types';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
	usePopupStore,
	useTargetObjectStore,
	useToggleViewAreaStore,
} from '@/store/store';

import { useDeleteObject } from '@/hooks/useDeleteObject';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetFilters } from '@/hooks/useGetFilters';
import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';
import { useSaveObject } from '@/hooks/useSaveObject';
import { useSelectFromInfoComponent } from '@/hooks/useSelectFromInfoComponent';

import styles from './ObjectInfo.module.scss';
import InfoBlock from './info-block/InfoBlock';
import InfoEdit from './info-edit/InfoEdit';
import Info from './info/Info';
import MenuObject from './menu-object/MenuObject';
import { TOKEN, colors } from '@/app.constants';

const messageSave = 'Вы действительно хотите сохранить?';
const messageDelete = 'Вы действительно хотите удалить?';

const ObjectInfo: FC = () => {
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const setIsViewArea = useToggleViewAreaStore(store => store.setIsViewArea);
	const { setMarker, clearMarker } = useTargetObjectStore(store => store);
	const { isActiveAddObject, setIsActiveAddObject } = useActiveAddObjectStore(
		store => store,
	);
	const { isPopup, setIsPopup, setMessageInPopup, messageInPopup } =
		usePopupStore(store => store);

	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { refetch: refetch_getDataMap } = useGetDataMap(queryString);
	const { refetch, data, isSuccess, isLoading } = useGetObjectInfo(
		idObjectInfo || 0,
	);
	const { mutate, isSuccess: isSuccess_save } = useSaveObject();
	const { mutate: mutate_delete } = useDeleteObject();
	const { data: dataFilters, isLoading: isLoading_dataFilters } =
		useGetFilters(map);

	const token = Cookies.get(TOKEN);

	const [editValuesObject, setEditValuesObject] = useState<IMarker | null>( //HELP: Записываем в стейт данные, чтобы можно было изменять при активной авторизации. А после спокойно отправлять весь объект
		isSuccess ? (data as IMarker) : null,
	);

	///test
	const { coords, setCoords } = useDotInfoCoordsStore(store => store);

	useEffect(() => {
		setEditValuesObject(data as IMarker);
	}, [isSuccess]);

	useEffect(() => {
		console.log('test', editValuesObject, coords);
		if (!editValuesObject?.crd && coords.lat) {
			setEditValuesObject(prev =>
				prev ? { ...prev, crd: [coords.lat, coords.lng] } : null,
			);
		}
	}, [coords, editValuesObject]);

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

	useEffect(() => {
		//HELP: По изменению id таргета добавляем в глобальный стейт данные о маркере таргета полученными из запроса. Т.к. в общих данных нету поля area приходится хранить в глобальном сторе данные об объекте таргета, которые возвращает запрос object_info
		if (idObjectInfo) {
			setMarker(data as IMarker);
		}
	}, [isSuccess, data, idObjectInfo]);

	const { setFormState } = useSelectFromInfoComponent(
		setEditValuesObject,
		dataFilters,
	);
	//////

	const handleClose = () => {
		setIdObjectInfo(0); //HELP: Обнуляем чтобы маркер таргета исчезал
		setIsObjectInfo(false);
		setIsActiveAddObject(false);
		setIsFilters(true);
		setIsViewArea(false);
		clearMarker();
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
	// const onCallbackNewValue = useCallback(
	// 	(data: { label: string; value: string }) => {
	// 		setEditValuesObject(prev => {
	// 			if (!prev || !prev.values) return prev; // Защита от null/undefined

	// 			return {
	// 				...prev,
	// 				values: prev.values.map(el =>
	// 					el.label === data.label ? { ...el, value: data.value } : el,
	// 				),
	// 			};
	// 		});
	// 	},
	// 	[setEditValuesObject], // Добавьте зависимость
	// );
	const resetValue = () => setEditValuesObject(data as IMarker);
	const handleSaveValues = () => {
		mutate(editValuesObject as IMarker);
		const timeoutId = setTimeout(() => refetch_getDataMap(), 1500);

		setIsActiveAddObject(false);
		setIsPopup(false);

		return () => clearTimeout(timeoutId);
	};
	const deleteObject = () => {
		mutate_delete(idObjectInfo);

		setIsObjectInfo(false);
		setIsFilters(true);
		setIsPopup(false);

		const timeoutId = setTimeout(() => refetch_getDataMap(), 1500);

		return () => clearTimeout(timeoutId);
	};
	const onPopupSave = () => {
		setIsPopup(true);
		setMessageInPopup(messageSave);
	};
	const onPopupDelete = () => {
		setIsPopup(true);
		setMessageInPopup(messageDelete);
	};
	const cancelPopup = () => setIsPopup(false);

	return (
		<div className={styles.wrapper_objectInfo}>
			<div className={styles.block__objectInfo}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>
						{isActiveAddObject ? 'Добавление объекта' : 'Просмотр обьекта'}{' '}
					</h2>
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
				{!isActiveAddObject && !isLoading && <MenuObject />}
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
							// position: 'absolute',
							// top: '50%',
							// left: '50%',
							// transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
				<div className={styles.block__info}>
					{isSuccess &&
						data &&
						(data as IMarker)?.values?.map((el, ind) => {
							if (token) {
								if (el.el === 'select') {
									const filter = dataFilters?.find(
										filter => filter.name === el.name,
									);

									const onCallbackForSelect = (opt: IItemFilter) => {
										setFormState(prev => ({ ...prev, [el.name]: opt }));
									};

									return (
										<InfoBlock
											key={ind}
											onCallbackForSelect={onCallbackForSelect}
											filter={filter}
											value={el.value}
										/>
									);
								} else {
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
								}
							} else {
								return <Info key={ind} value_info={el} />;
							}
						})}
				</div>
			</div>

			{isPopup && (
				<Popup
					message={messageInPopup}
					isConfirm={true}
					functions={{
						confirm:
							messageSave === messageInPopup ? handleSaveValues : deleteObject,
						cancel: cancelPopup,
					}}
				/>
			)}

			{token && (
				<div className={styles.block__buttons}>
					<Button
						onClick={
							// handleSaveValues
							onPopupSave
						}
					>
						Сохранить
					</Button>
					<Button
						style={{ color: colors.grey_light, backgroundColor: 'transparent' }}
						onClick={resetValue}
					>
						Отменить
					</Button>
					{!isActiveAddObject && (
						<Button //HELP: Чтобы не появлялась кнопка удаления при добавлении объекта
							style={{ color: colors.red, backgroundColor: 'transparent' }}
							onClick={
								// deleteObject
								onPopupDelete
							}
						>
							Удалить
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default ObjectInfo;
