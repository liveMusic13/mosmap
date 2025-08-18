import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useCenterMapStore } from '@/store/store';

const FlyToLocation: FC<{ toZoom: number | undefined }> = ({ toZoom }) => {
	const map = useMap();
	const centerMap = useCenterMapStore(store => store.centerMap);

	// useEffect(() => {
	// 	if (centerMap) {
	// 		//HELP: Проверяем чтобы координаты центра карты не были равны дефолтным. Если они не дефолтные, значит это координаты объекта и нужно приближать.
	// 		const isZoomToObject =
	// 			JSON.stringify(centerMap) !== JSON.stringify([55.7522, 37.6156]);
	// 		const zoom = toZoom && isZoomToObject ? toZoom - 2 : map.getZoom();
	// 		map.flyTo(centerMap, zoom, {
	// 			animate: true,
	// 			duration: 1,
	// 		});
	// 	}
	// }, [centerMap]);

	useEffect(() => {
		if (!centerMap) return;

		const isDefault =
			JSON.stringify(centerMap) === JSON.stringify([55.7522, 37.6156]);
		if (isDefault) return; // не летим в дефолт

		// ⚡️ важный фикс — если карта уже в этих координатах, не дергаем flyTo
		const { lat, lng } = map.getCenter();
		if (
			lat.toFixed(5) === (centerMap as number[])[0].toFixed(5) &&
			lng.toFixed(5) === (centerMap as number[])[1].toFixed(5)
		) {
			return;
		}

		const zoom = toZoom ? toZoom - 2 : map.getZoom();
		map.flyTo(centerMap, zoom, {
			animate: true,
			duration: 1,
		});
	}, [centerMap]);

	return null;
};

export default FlyToLocation;
