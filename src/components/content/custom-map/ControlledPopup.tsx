import { LatLngExpression } from 'leaflet';
import { FC, useEffect, useMemo, useRef } from 'react';
import { Popup, useMap } from 'react-leaflet';

import { IMarker } from '@/types/requestData.types';

import {
	useIdObjectInfoStore,
	useViewObjectAbdAreaInfoStore,
} from '@/store/store';

const ControlledPopup: FC<{ markers: IMarker[] }> = ({ markers }) => {
	const idObjectInfo = useIdObjectInfoStore(s => s.idObjectInfo);
	const setIsViewObjectInfo = useViewObjectAbdAreaInfoStore(
		store => store.setIsViewObjectInfo,
	);
	const map = useMap();
	const popupRef = useRef<L.Popup>(null);
	const selected = useMemo(
		() => markers.find(m => m.id === idObjectInfo),
		[markers, idObjectInfo],
	);

	useEffect(() => {
		if (idObjectInfo === selected?.id && popupRef.current) {
			// открываем попап для текущего выбранного объекта
			popupRef.current.openOn(map);
			setIsViewObjectInfo(true);
		}
	}, [idObjectInfo, selected?.id, map]);

	if (!selected?.crd) return null;

	return (
		<Popup
			ref={popupRef}
			key={selected?.id} // форсим ремаунт при смене id
			position={selected?.crd as LatLngExpression}
			// closeOnClick можно оставить дефолтным поведениям карты
		>
			{selected.values
				? selected.values.find((el: any) => el.label === 'Наименование')?.value
				: selected.name}
		</Popup>
	);
};

export default ControlledPopup;
