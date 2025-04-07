import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';
import Popup from '@/components/ui/popup/Popup';

import { IDotInfoData } from '@/types/requestData.types';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	useIdObjectInfoStore,
	usePopupStore,
	useRemoveMarkerCrdStore,
	useViewDotInfoStore,
} from '@/store/store';

import { useDotInfo } from '@/hooks/useDotInfo';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSaveObject } from '@/hooks/useSaveObject';
import { useSaveUpdateAfterRemoveMarker } from '@/hooks/useSaveUpdateAfterRemoveMarker';

import styles from './InfoAboutZone.module.scss';
import InfoZone from './info-zone/InfoZone';
import { TOKEN, colors } from '@/app.constants';

//TODO: Проверить смогу ли я сюда попап добавить из информации об объекте, чтобы он выводился при сохранении новых координат
const InfoAboutZone: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const token = Cookies.get(TOKEN);

	const setIsRemoveMarker = useRemoveMarkerCrdStore(
		store => store.setIsRemoveMarker,
	);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const coords = useDotInfoCoordsStore(store => store.coords);
	const setIsActiveAddObject = useActiveAddObjectStore(
		store => store.setIsActiveAddObject,
	);
	const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	const { isPopup, messageInPopup, setIsPopup } = usePopupStore(store => store);

	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { data: data_getDataMap } = useGetDataMap(queryString);
	const { data, isSuccess, isLoading } = useDotInfo(coords);
	const { mutate, isSuccess: isSuccess_save } = useSaveObject();

	useSaveUpdateAfterRemoveMarker(isSuccess_save);

	const handleClose = () => setViewDotInfo(false);
	const handleActiveAddObject = () => {
		if (map && token) {
			setIsActiveAddObject(true);
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
					<h2 className={styles.title}>Просмотр объекта</h2>
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
			</div>
			<div className={styles.block__info}>
				{isLoading && (
					<Loader
						style={{
							// position: 'absolute',
							// top: '50%',
							// left: '50%',
							// transform: 'translate(-50%, -50%)',
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{isSuccess &&
					data &&
					(data as IDotInfoData[]).map((el, ind) => (
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
