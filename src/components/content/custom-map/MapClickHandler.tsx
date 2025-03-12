import { FC, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
	useViewDotInfoStore,
} from '@/store/store';

import { useDotInfo } from '@/hooks/useDotInfo';

const MapClickHandler: FC = () => {
	const { coords, setCoords } = useDotInfoCoordsStore(store => store);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const setIsActiveAddObject = useActiveAddObjectStore(
		store => store.setIsActiveAddObject,
	);
	const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);

	const { refetch } = useDotInfo(coords);

	useEffect(() => {
		refetch();
	}, [coords]);

	useMapEvents({
		click: async e => {
			setIsFilters(false);
			setIsObjectInfo(false);
			setIsActiveAddObject(false);
			setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
			setViewDotInfo(true);
			setIdObjectInfo(0); //HELP: Сбрасываем на 0 для того чтобы исчезал значок таргета у маркера на карте при клике на пустую область
		},
	});

	return null;
};

export default MapClickHandler;
