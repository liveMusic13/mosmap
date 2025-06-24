import { FC, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	// useFiltersStore,
	useIdObjectInfoStore,
	// useObjectInfoStore,
	useRemoveMarkerCrdStore,
	// useViewDotInfoStore,
	useViewObjectAbdAreaInfoStore,
	useViewStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useDotInfo } from '@/hooks/useDotInfo';

const MapClickHandler: FC = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const { coords, setCoords } = useDotInfoCoordsStore(store => store);
	// const setIsFilters = useFiltersStore(store => store.setIsFilters);
	// const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const fullCloseView = useViewStore(store => store.fullCloseView);
	const openView = useViewStore(store => store.openView);

	const setIsActiveAddObject = useActiveAddObjectStore(
		store => store.setIsActiveAddObject,
	);
	// const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const isRemoveMarker = useRemoveMarkerCrdStore(store => store.isRemoveMarker);
	const { setIsViewAreaInfo } = useViewObjectAbdAreaInfoStore(store => store);

	const { refetch } = useDotInfo(coords);

	useEffect(() => {
		refetch();
	}, [coords]);

	useMapEvents({
		click: async e => {
			// setIsObjectInfo(false);
			setIsActiveAddObject(false);
			setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
			if (!isRemoveMarker) {
				//HELP: Если режим смены координат маркера, то не убираем таргет
				setIdObjectInfo(0); //HELP: Сбрасываем на 0 для того чтобы исчезал значок таргета у маркера на карте при клике на пустую область
			}

			if (isMobile) {
				fullCloseView();
				//HELP: Аналогично ситуации в клике по объекту
				setIsViewAreaInfo(true);
			} else {
				// setViewDotInfo(true);
				// setIsFilters(false);
				openView('zoneInfo');
			}

			// setIsFilters(false);
			// setIsObjectInfo(false);
			// setIsActiveAddObject(false);
			// setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
			// setViewDotInfo(true);

			// if (!isRemoveMarker) {
			// 	//HELP: Если режим смены координат маркера, то не убираем таргет
			// 	setIdObjectInfo(0); //HELP: Сбрасываем на 0 для того чтобы исчезал значок таргета у маркера на карте при клике на пустую область
			// }
		},
	});

	return null;
};

export default MapClickHandler;
