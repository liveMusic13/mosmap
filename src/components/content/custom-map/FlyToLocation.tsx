import { FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { useCenterMapStore, useZoomLevelStore } from '@/store/store';

// const FlyToLocation: FC<{ toZoom: number | undefined }> = ({ toZoom }) => {
// 	const map = useMap();
// 	const centerMap = useCenterMapStore(store => store.centerMap);

// 	useEffect(() => {
// 		if (!centerMap) return;

// 		const isDefault =
// 			JSON.stringify(centerMap) === JSON.stringify([55.7522, 37.6156]);
// 		if (isDefault) return; // не летим в дефолт

// 		// ⚡️ важный фикс — если карта уже в этих координатах, не дергаем flyTo
// 		const { lat, lng } = map.getCenter();
// 		if (
// 			lat.toFixed(5) === (centerMap as number[])[0].toFixed(5) &&
// 			lng.toFixed(5) === (centerMap as number[])[1].toFixed(5)
// 		) {
// 			return;
// 		}

// 		const zoom = toZoom ? toZoom - 2 : map.getZoom();
// 		map.flyTo(centerMap, zoom, {
// 			animate: true,
// 			duration: 1,
// 		});
// 	}, [centerMap]);

// 	return null;
// };

const FlyToLocation: FC<{ toZoom: number | undefined }> = ({ toZoom }) => {
	const map = useMap();
	const centerMap = useCenterMapStore(store => store.centerMap);
	const setZoomLevel = useZoomLevelStore(state => state.setZoomLevel);
	const hasFlownRef = useRef(false);

	useEffect(() => {
		console.log('FlyToLocation effect, centerMap:', centerMap);

		if (!centerMap) {
			console.log('No centerMap, returning');
			return;
		}

		const isDefault =
			JSON.stringify(centerMap) === JSON.stringify([55.7522, 37.6156]);

		if (isDefault) {
			console.log('Default coordinates detected, NOT flying');
			// При дефолтных координатах вообще ничего не делаем
			return;
		}

		// Проверяем, что это не первая загрузка с дефолтными координатами
		const { lat, lng } = map.getCenter();
		const currentCenter = [lat, lng];
		const isCurrentDefault =
			JSON.stringify([lat.toFixed(4), lng.toFixed(4)]) ===
			JSON.stringify(['55.7522', '37.6156']);

		if (isCurrentDefault && !hasFlownRef.current) {
			console.log(
				"Current position is default and haven't flown yet, skipping",
			);
			return;
		}

		if (
			lat.toFixed(5) === (centerMap as number[])[0].toFixed(5) &&
			lng.toFixed(5) === (centerMap as number[])[1].toFixed(5)
		) {
			console.log('Already at target coordinates');
			return;
		}

		console.log('Actually flying to:', centerMap);
		hasFlownRef.current = true;

		const targetZoom = toZoom ? toZoom - 2 : map.getZoom(); // Вернул оригинальную логику, но с меньшим зумом

		map.flyTo(centerMap, targetZoom, {
			animate: true,
			duration: 1,
		});
	}, [centerMap, map, toZoom]);

	return null;
};

export default FlyToLocation;
