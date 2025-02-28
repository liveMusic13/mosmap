import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useCenterMapStore } from '@/store/store';

const FlyToLocation: FC = () => {
	const map = useMap();
	const centerMap = useCenterMapStore(store => store.centerMap);

	useEffect(() => {
		if (centerMap) {
			map.flyTo(centerMap, map.getZoom(), {
				animate: true,
				duration: 1,
			});
		}
	}, [centerMap]);

	return null;
};

export default FlyToLocation;
