import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, Suspense, useCallback } from 'react';

import { IDotInfoData } from '@/types/requestData.types';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';
import Popup from '@/components/ui/popup/Popup';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';
import { useMapContext } from '@/providers/MapProvider';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	useIdObjectInfoStore,
	usePopupStore,
	useRemoveMarkerCrdStore,
	useViewPeopleAreaStore,
	useViewStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';
import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDotInfo } from '@/hooks/useDotInfo';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSaveObject } from '@/hooks/useSaveObject';
import { useSaveUpdateAfterRemoveMarker } from '@/hooks/useSaveUpdateAfterRemoveMarker';

import { getQueryString } from '@/utils/url';

import MenuObject from '../object-info/menu-object/MenuObject';
import OrganizationsNearby from '../object-info/organizations-nearby/OrganizationsNearby';

import styles from './InfoAboutZone.module.scss';
import InfoZone from './info-zone/InfoZone';
import { TOKEN, colors } from '@/app.constants';

const InfoAboutZone: FC = () => {
	const windowSize = useCheckWidth();
	const router = useRouter();
	const searchParams = useSearchParams();
	// const map = getMapId(searchParams); // работает с SEO URL
	// const map = useMapId();
	const { mapId: map, loading } = useMapContext();

	// const { mapId: map } = useContext(MapContext);

	const token = Cookies.get(TOKEN);
	const isMobile = windowSize <= 767;

	const setIsRemoveMarker = useRemoveMarkerCrdStore(
		store => store.setIsRemoveMarker,
	);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const coords = useDotInfoCoordsStore(store => store.coords);
	const setIsActiveAddObject = useActiveAddObjectStore(
		store => store.setIsActiveAddObject,
	);
	// const { isViewDotInfo, setViewDotInfo } = useViewDotInfoStore(store => store);
	const view = useViewStore(store => store.view);
	const openView = useViewStore(store => store.openView);
	const closeView = useViewStore(store => store.closeView);
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);

	const { isPopup, messageInPopup, setIsPopup } = usePopupStore(store => store);

	// //HELP: Преобразование searchParams в строку
	const queryString = getQueryString(searchParams, map); // включает map параметр

	const { data: data_getDataMap } = useGetDataMap(queryString, map);
	console.log('test map InfoAboutZone', queryString, map);

	const { data, isSuccess, isLoading } = useDotInfo(coords);
	const { mutate, isSuccess: isSuccess_save } = useSaveObject();

	useSaveUpdateAfterRemoveMarker(isSuccess_save);

	const { areaCoords } = useGetAreaPeoples(true);
	const { data: data_area, isLoading: isLoading_data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		isViewPeopleArea,
	);

	const handleClose = () => {
		// setViewDotInfo(false)
		closeView();
	};
	const handleActiveAddObject = () => {
		if (map && token) {
			setIsActiveAddObject(true);
			openView('addObject');
		} else {
			router.push('/registr');
		}
	};
	const handleClosePopup = () => {
		setIsRemoveMarker(false);
		setIsPopup(false);
	};
	const closeDisabledRemoveMarkerPopup = useCallback(() => {
		//TODO: Добавить колбэк, чтобы закэшировать функцию и проверить чтобы все так же работало
		const findTargetObject = data_getDataMap?.points.find(
			el => el.id === idObjectInfo,
		);

		if (findTargetObject) {
			mutate({ ...findTargetObject, crd: [coords.lat, coords.lng] });
		}
		setIsPopup(false);
		setIsRemoveMarker(false);
	}, [data_getDataMap, idObjectInfo]);

	if (loading) {
		return <div>Loading map...</div>;
	}

	return (
		<div className={styles.wrapper__infoAboutZone}>
			{isPopup && (
				<Popup
					message={messageInPopup}
					isConfirm={true}
					functions={{
						confirm: closeDisabledRemoveMarkerPopup,
						cancel: handleClosePopup,
					}}
				/>
			)}

			<div className={styles.block__objectInfo}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>Информация по точке</h2>

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
									// isViewDotInfo
									view === 'zoneInfo' ? { transform: 'rotate(-180deg)' } : {}
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
			</div>
			<MenuObject isArea={true} />
			{isLoading_data_area && <Loader style={{}} />}
			{isViewPeopleArea && data_area?.data && (
				<Suspense>
					<OrganizationsNearby orgs={data_area.data.orgs} isArea={true} />
				</Suspense>
			)}
			<div className={styles.block__info}>
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{isSuccess &&
					data &&
					Array.isArray(data) &&
					(data as IDotInfoData[])?.map((el, ind) => (
						<InfoZone key={ind} value_info={el} />
					))}
			</div>
			<div className={styles.block__buttons}>
				<Button onClick={handleActiveAddObject}>Добавить объект</Button>
			</div>
		</div>
	);
};

export default InfoAboutZone;
