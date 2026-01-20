'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import {
	IItemFilter,
	IMarker,
	IValuesObjectInfo,
} from '@/types/requestData.types';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';
import Popup from '@/components/ui/popup/Popup';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';
import { useMapContext } from '@/providers/MapProvider';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	// useFiltersStore,
	useIdObjectInfoStore,
	// useObjectInfoStore,
	usePopupStore,
	useRemoveMarkerCrdStore,
	useTargetObjectStore,
	useToggleViewAreaStore,
	useViewOrganizationAreaStore,
	useViewPeopleAreaStore,
	useViewStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';
import { useCheckDirtyDataObject } from '@/hooks/useCheckDirtyDataObject';
import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDeleteObject } from '@/hooks/useDeleteObject';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useGetFilters } from '@/hooks/useGetFilters';
import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';
import { useSaveObject } from '@/hooks/useSaveObject';
import { useSaveUpdateAfterRemoveMarker } from '@/hooks/useSaveUpdateAfterRemoveMarker';
import { useSelectFromInfoComponent } from '@/hooks/useSelectFromInfoComponent';

import { checkMapAccess } from '@/utils/jwtTokenDecoder';
import { getQueryString } from '@/utils/url';

import Organizations from '../organizations/Organizations';

import styles from './ObjectInfo.module.scss';
import InfoBlock from './info-block/InfoBlock';
import InfoEdit from './info-edit/InfoEdit';
import Info from './info/Info';
import MenuObject from './menu-object/MenuObject';
import OrganizationsNearby from './organizations-nearby/OrganizationsNearby';
import { colors } from '@/app.constants';

const messageSave = 'Вы действительно хотите сохранить?';
const messageDelete = 'Вы действительно хотите удалить?';
const messageMarker = 'Вы хотите удалить или переместить маркер?';
const messageRemoveMarker =
	'Выберите любое место на карте и нажмите на него. Когда установите, нажмите правой кнопкой мыши в любое место чтобы закончить смену координат для маркера.';

const ObjectInfo: FC = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const closeView = useViewStore(store => store.closeView);
	const view = useViewStore(store => store.view);

	const setIsViewArea = useToggleViewAreaStore(store => store.setIsViewArea);
	const { setMarker, clearMarker } = useTargetObjectStore(store => store);
	const { isActiveAddObject, setIsActiveAddObject } = useActiveAddObjectStore(
		store => store,
	);
	const { setIsRemoveMarker } = useRemoveMarkerCrdStore(store => store);
	const { isPopup, setIsPopup, setMessageInPopup, messageInPopup } =
		usePopupStore(store => store);

	const searchParams = useSearchParams();
	const { mapId: map, loading } = useMapContext();

	const queryString = getQueryString(searchParams, map); // включает map параметр

	const {
		refetch: refetch_getDataMap,
		data: dataMap,
		data: data_getDataMap,
	} = useGetDataMap(queryString, map);

	const { refetch, data, isSuccess, isLoading } = useGetObjectInfo(
		idObjectInfo || 0,
	);
	const {
		mutate,
		isSuccess: isSuccess_save,
		isPending,
		isError,
		mutateAsync,
	} = useSaveObject();
	const { mutate: mutate_delete } = useDeleteObject();
	const { data: dataFilters, isLoading: isLoading_dataFilters } =
		useGetFilters(map);

	const { isViewPeopleArea, setIsViewPeopleArea }: any = useViewPeopleAreaStore(
		store => store,
	);

	useEffect(() => console.log('isViewPeopleArea', isViewPeopleArea), []);

	// useEffect(() => {
	// 	setIsViewPeopleArea(false);
	// }, [idObjectInfo]);

	const { areaCoords } = useGetAreaPeoples();

	// const token = Cookies.get(TOKEN);
	const token = checkMapAccess(dataMap?.map || null).hasMapAccess;
	const findTargetObject = data_getDataMap?.points.find(
		el => el.id === idObjectInfo,
	); //HELP: Находим объект таргета
	const { data: data_area, isLoading: isLoading_data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		isViewPeopleArea,
	);

	const [editValuesObject, setEditValuesObject] = useState<IMarker | null>( //HELP: Записываем в стейт данные, чтобы можно было изменять при активной авторизации. А после спокойно отправлять весь объект
		isSuccess ? (data as IMarker) : null,
	);
	const skipNextSubscriptionRef = useRef(false);
	const prevIdRef = useRef<number>(idObjectInfo);
	const pendingIdRef = useRef<number | null>(null);
	const snapshotRef = useRef<IMarker | null>(null); // снимок старых данных
	const { isViewOrganizationArea }: any = useViewOrganizationAreaStore();

	const [isDirty, setIsDirty] = useState(false);

	// Подписываемся на любой чендж стейта и вручную сравниваем old/new
	useEffect(() => {
		const unsub = useIdObjectInfoStore.subscribe(state => {
			const newId = state.idObjectInfo;
			const oldId = prevIdRef.current;

			// если флаг поднят — сбрасываем его и выходим
			if (skipNextSubscriptionRef.current) {
				skipNextSubscriptionRef.current = false;
				prevIdRef.current = newId; // зафиксируем, что мы уже здесь были
				return;
			}

			// если не поменялось — не нужен побочный эффект
			if (newId === oldId) return;

			if (isDirty) {
				// 1) запоминаем, куда после попапа перейти
				pendingIdRef.current = newId;
				// 2) делаем снимок того, что надо сохранить
				snapshotRef.current = editValuesObject;
				// говорим, что этот следующий апдейт id мы уже обрабатывали
				skipNextSubscriptionRef.current = true;

				// 3) откатываем глобальный id назад
				setIdObjectInfo(oldId || 0);
				// 4) открываем попап
				messageSave;
				setMessageInPopup(messageSave);

				// setMessageInPopup('Вы действительно хотите сохранить изменения?');
				console.log('zdes');
				setIsPopup(true);
			} else {
				// если нечего сохранять — просто обновляем prevId
				prevIdRef.current = newId;
			}
		});

		return () => {
			unsub();
		};
	}, [isDirty, editValuesObject, setIdObjectInfo]);
	useSaveUpdateAfterRemoveMarker(isSuccess_save);
	useCheckDirtyDataObject(idObjectInfo, view, isDirty, setIsDirty, messageSave);

	///test
	const coords = useDotInfoCoordsStore(store => store.coords);

	useEffect(() => {
		setEditValuesObject(data as IMarker);
	}, [isSuccess]);

	useEffect(() => {
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
		// setIsObjectInfo(false);
		// setIsObjectInfoReserve(false);
		setIsActiveAddObject(false);
		// setIsFilters(true);
		closeView();
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
			setIsDirty(true);
		},
		[],
	);
	const resetValue = () => {
		setEditValuesObject(data as IMarker);
		setIsDirty(false);
	};

	// Сохранение из попапа

	const onConfirm = () => {
		setIsPopup(false);

		const toSave = snapshotRef.current!;
		mutate(toSave, {
			onSuccess: () => {
				setIsDirty(false);

				if (pendingIdRef.current != null) {
					// опять говорим подписчику пропустить этот вызов
					skipNextSubscriptionRef.current = true;
					setIdObjectInfo(pendingIdRef.current);
					prevIdRef.current = pendingIdRef.current;
				}
				pendingIdRef.current = null;
				snapshotRef.current = null;
			},
		});
	};

	// useEffect(() => {
	// 	console.log('isPopup', isPopup, isDirty);
	// }, [isPopup, isDirty]);

	const deleteObject = () => {
		mutate_delete(idObjectInfo);

		// setIsObjectInfo(false);
		// setIsFilters(true);
		closeView();
		setIsPopup(false);

		const timeoutId = setTimeout(() => refetch_getDataMap(), 1500);

		return () => clearTimeout(timeoutId);
	};
	const onPopupSave = () => {
		setIsPopup(true);
		setMessageInPopup(messageSave);
		setIsDirty(false);
	};
	const onPopupDelete = () => {
		setIsPopup(true);
		setMessageInPopup(messageDelete);
		setIsDirty(false);
	};
	const cancelPopup = () => {
		setIsPopup(false);
		setIsDirty(false);
	};
	const handleDeleteCrd = () => {
		if (findTargetObject && findTargetObject.crd) {
			mutate({ ...findTargetObject, crd: [null, null] }); //TODO: Возможно проблема с тем что при удалении карты переключается в случайное место здесь. Т.к. приходит null вместо координат и возможно в этом и есть проблема. Позже надо будет разобраться.
			setIsPopup(false);
		}
	};
	const handleRemoveMarker = () => {
		setMessageInPopup(
			'Выберите любое место на карте и нажмите на него. Когда установите, нажмите правой кнопкой мыши в любое место чтобы закончить смену координат для маркера.',
		);
	};
	const closePopupRemoveMarker = () => {
		setIsRemoveMarker(true); //HELP: Включаем состояния при активации которого каждый клик на карту будет сохранятся для этого объекта как новые координаты, пока не отключишь это состояние правой кнопкой мыши.
		setIsPopup(false);
		setIsDirty(false);
	};

	// 1) Обработчик для вашей toolbar–кнопки «Сохранить»
	const handleToolbarSave = () => {
		if (!editValuesObject) return;

		mutate(editValuesObject, {
			onSuccess: () => {
				// сбросим флаг «грязи»
				setIsDirty(false);
				// обновим карту
				refetch_getDataMap();
				// закроем попап, если он случайно открыт
				setIsPopup(false);
			},
		});
	};

	const [errorSave, setErrorSave] = useState(false);
	useEffect(() => {
		if (isError) {
			setErrorSave(true);

			const timeoutId = setTimeout(() => setErrorSave(false), 3000);

			return () => clearTimeout(timeoutId);
		}
	}, [isError]);

	if (loading) {
		return <div>Loading map...</div>;
	}

	return (
		<div className={styles.wrapper_objectInfo}>
			<div className={styles.block__objectInfo}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>
						{view === 'addObject' ? 'Добавление объекта' : 'Просмотр обьекта'}
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
						{isMobile ? (
							<Image
								src={'/images/icons/arrow_viewObject_mobile.svg'}
								alt='arrow'
								width={19}
								height={19}
								style={
									view === 'objectInfo' || view === 'addObject'
										? { transform: 'rotate(-180deg)' }
										: {}
								}
							/>
						) : (
							<Image
								src='/images/icons/exit.svg'
								alt='exit'
								width={9}
								height={9}
								className={styles.image_title}
							/>
						)}
					</Button>
				</div>
				{!isActiveAddObject && !isLoading && <MenuObject />}
				{isViewPeopleArea && data_area?.data && (
					<Suspense>
						<OrganizationsNearby orgs={data_area.data.orgs} />
					</Suspense>
				)}
				{isLoading_data_area && <Loader style={{}} />}
				{isMobile && isViewPeopleArea && isViewOrganizationArea && (
					<Organizations />
				)}
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				<div className={styles.block__info} data-scrollable={true}>
					{isSuccess &&
						data &&
						(data as IMarker)?.values?.map((el, ind) => {
							if (token) {
								if (el.el === 'select') {
									const filter = dataFilters?.find(
										filter => filter.name === el.name,
									);

									const onCallbackForSelect = (opt: IItemFilter | null) => {
										if (!opt) return;
										setFormState(prev => ({ ...prev, [el.name]: opt }));
										setIsDirty(true);
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
					isConfirm={messageInPopup === messageRemoveMarker ? false : true}
					functions={{
						// confirm:
						// 	messageSave === messageInPopup
						// 		? handleSaveValues
						// 		: messageMarker === messageInPopup
						// 			? handleRemoveMarker
						// 			: deleteObject,
						confirm:
							messageInPopup === messageSave
								? onConfirm // <-- сюда
								: messageInPopup === messageMarker
									? handleRemoveMarker // не ваш случай «удалить координаты»
									: deleteObject, // случай «удалить объект»
						cancel:
							messageMarker === messageInPopup ? handleDeleteCrd : cancelPopup,
						onClick: closePopupRemoveMarker,
					}}
					cancelButtonText={
						messageMarker === messageInPopup ? 'Удалить' : undefined
					}
					confirmButtonText={
						messageMarker === messageInPopup ? 'Переместить' : undefined
					}
				/>
			)}

			{token && (
				<div className={styles.block__buttons}>
					<Button
						onClick={
							// handleSaveValues
							// onPopupSave
							handleToolbarSave
						}
						style={
							isMobile
								? isPending
									? {
											backgroundColor: colors.orange,
										}
									: errorSave
										? {
												backgroundColor: colors.red,
											}
										: {}
								: {}
						}
					>
						Сохранить
						{isMobile ? (
							isPending ? (
								<Loader
									style={{
										width: 'calc(50/1920*100vw)',
										height: 'calc(50/1920*100vw)',
									}}
								/>
							) : null
						) : null}
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
