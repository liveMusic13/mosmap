import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useCenterMapStore } from '@/store/store';

const FlyToLocation: FC<{ toZoom: number | undefined }> = ({ toZoom }) => {
	const map = useMap();
	const centerMap = useCenterMapStore(store => store.centerMap);

	useEffect(() => {
		if (centerMap) {
			//HELP: Проверяем чтобы координаты центра карты не были равны дефолтным. Если они не дефолтные, значит это координаты объекта и нужно приближать.
			const isZoomToObject =
				JSON.stringify(centerMap) !== JSON.stringify([55.7522, 37.6156]);
			const zoom = toZoom && isZoomToObject ? toZoom - 2 : map.getZoom();
			map.flyTo(centerMap, zoom, {
				animate: true,
				duration: 1,
			});
		}
	}, [centerMap]);

	return null;
};

export default FlyToLocation;
