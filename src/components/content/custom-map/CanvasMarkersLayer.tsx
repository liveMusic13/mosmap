import L, { Canvas } from 'leaflet';
import { FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { ICanvasMarkersLayer } from '@/types/props.types';

import { getIconForMarker } from '@/utils/iconForMarker';

const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({ dataMap }) => {
	const map = useMap();
	const canvasLayerRef = useRef<Canvas | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);

	useEffect(() => {
		if (!map) return;
		// Если слой уже существует, очищаем его
		if (markersLayerRef.current) {
			markersLayerRef.current.clearLayers();
		} else {
			markersLayerRef.current = L.layerGroup().addTo(map);
		}

		canvasLayerRef.current = L.canvas({ padding: 0.5 });
		canvasLayerRef.current.addTo(map);

		// Функция обновления маркеров при изменении зума
		const updateMarkers = () => {
			if (!dataMap || dataMap.points.length === 0) return;

			markersLayerRef.current!.clearLayers();
			const zoomLevelMap = map.getZoom();
			const bounds = map.getBounds(); // Получаем границы видимой области карты

			dataMap.points.forEach(marker => {
				const crd = marker.crd || [0, 0];
				const markerName = marker.name || 'No name';
				let mapObject: L.Layer | null = null;

				// Проверяем, входит ли маркер в видимую область карты
				if (!bounds.contains(crd)) return;

				// Если зум >= 16 и есть полигон → рисуем полигон
				if (zoomLevelMap >= 16 && marker.polygon && marker.polygon.length > 0) {
					mapObject = L.polygon(marker.polygon, {
						color: `#${marker.color}`,
						weight: 2,
						// fillColor: marker.color,
						// fillOpacity: 0.4,
					}).addTo(markersLayerRef.current!);
				}
				// Если зум 14-15 → рисуем кастомную иконку
				else if (zoomLevelMap >= 14 && zoomLevelMap < 16) {
					const svg = getIconForMarker(marker);
					const encodedSvg = encodeURIComponent(svg);
					const dataUrl = 'data:image/svg+xml,' + encodedSvg;
					// console.log(svg);
					const icon = L.icon({
						iconUrl: dataUrl,
						iconSize: [20, 20],
					});
					mapObject = L.marker(crd, { icon }).addTo(markersLayerRef.current!);
				}
				// Если зум < 14 → рисуем круглый маркер (CircleMarker)
				else {
					mapObject = L.circleMarker(crd, {
						renderer: canvasLayerRef.current!,
						radius: 6,
						color: `#${marker.color}`,
						// fillColor: marker.color,
						// fillOpacity: 1,
					}).addTo(markersLayerRef.current!);
				}
				// Добавляем попап
				if (mapObject) {
					mapObject.bindPopup(markerName);
				}
			});
		};
		// Вызов при монтировании и подписка на изменение зума
		updateMarkers();

		map.on('zoomend', updateMarkers);
		map.on('moveend', updateMarkers); // Обновляем маркеры при движении карты
		// Очистка при размонтировании
		return () => {
			map.off('zoomend', updateMarkers);
			map.off('moveend', updateMarkers);
			markersLayerRef.current?.clearLayers();
		};
	}, [dataMap, map]);

	return null;
};
export default CanvasMarkersLayer;
// import L, { Canvas } from 'leaflet';
// import { FC, useEffect, useRef } from 'react';
// import { useMap } from 'react-leaflet';

// import { ICanvasMarkersLayer } from '@/types/props.types';

// const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({ dataMap }) => {
// 	const map = useMap();
// 	const canvasLayerRef = useRef<Canvas | null>(null);

// 	useEffect(() => {
// 		if (!map) return;

// 		canvasLayerRef.current = L.canvas({ padding: 0.5 });
// 		canvasLayerRef.current.addTo(map);

// 		if (map && dataMap && dataMap.points.length > 0) {
// 			dataMap.points.forEach(marker => {
// 				const crd = marker.crd || [0, 0];
// 				const markerName = marker.name || 'No name';
// 				//HELP: если есть слой на котором рисовать, то рисуем маркеры и указываем их размер, цвет и собственно сам слой на котором они будут + добавляем попап с именем объекта
// 				if (canvasLayerRef.current) {
// 					let mapObject; //HELP: маркер для карты
// 					const zoomLevelMap = map.getZoom();

// 					// //HELP: если соответствует зум и у маркера есть полигон, то рисуется полигон
// 					// if (
// 					// 	zoomLevelMap >= 16 &&
// 					// 	marker.polygon &&
// 					// 	marker.polygon.length > 0
// 					// ) {
// 					// 	mapObject = new L.Polygon(marker.polygon, {
// 					// 		color: marker.color,
// 					// 		weight: 3,
// 					// 	}).addTo(map);

// 					// 	mapObject.bindPopup(markerName);
// 					// } else if (zoomLevelMap > 13 && zoomLevelMap < 16) {
// 					// 	let svg = getIconForMarker(marker); //HELP: ПОЛУЧАЕМ МАРКЕР
// 					// 	let encodedSvg = encodeURIComponent(svg); //HELP: КОНВЕРТИРУЕМ В ССЫЛКУ
// 					// 	let dataUrl = 'data:image/svg+xml,' + encodedSvg; //HELP: ДОБАВЛЯЕМ К НЕМУ DATA И ТЕПЕРЬ ЭТО ССЫЛКА НА КАРТИНКУ

// 					// 	const icon = L.icon({
// 					// 		iconUrl: dataUrl,
// 					// 		iconSize: [20, 20],
// 					// 	});

// 					// 	if (marker.crd) {
// 					// 		mapObject = L.marker(marker.crd, {
// 					// 			icon,
// 					// 			zIndexOffset: 3,
// 					// 		}).addTo(map);
// 					// 	}
// 					// } else {
// 					// 	//HELP: иначе обычный маркер в виде кружка
// 					// 	mapObject = new L.CircleMarker(crd, {
// 					// 		renderer: canvasLayerRef.current,
// 					// 		radius: 5,
// 					// 		color: marker.color,
// 					// 	}).addTo(map);
// 					// 	mapObject.bindPopup(markerName);
// 					// }

// 					//HELP: иначе обычный маркер в виде кружка
// 					mapObject = new L.CircleMarker(crd, {
// 						renderer: canvasLayerRef.current,
// 						radius: 5,
// 						color: marker.color,
// 					}).addTo(map);
// 					mapObject.bindPopup(markerName);
// 				}
// 			});
// 		}
// 	}, [dataMap, map]);

// 	return null;
// };

// export default CanvasMarkersLayer;
