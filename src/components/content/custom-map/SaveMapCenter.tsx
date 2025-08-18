import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';

import { useCenterMapStore } from '@/store/store';

const SaveMapCenter: FC = () => {
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);

	useMapEvents({
		moveend(e) {
			const { lat, lng } = e.target.getCenter();
			setCenterMap([lat, lng]); // пишем только координаты, без map
		},
	});

	return null;
};

export default SaveMapCenter;
