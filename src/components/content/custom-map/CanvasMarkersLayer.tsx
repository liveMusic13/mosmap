import L, { Canvas } from 'leaflet';
import { FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { ICanvasMarkersLayer } from '@/types/props.types';

import { useClickOnMarker } from '@/hooks/useClickOnMarker';

import { getIconForMarker } from '@/utils/iconForMarker';

const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({ dataMap }) => {
	const handleClickOnMarker = useClickOnMarker();

	const map = useMap();
	const canvasLayerRef = useRef<Canvas | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);

	useEffect(() => {
		if (!map) return;
		//HELP: Если слой уже существует, очищаем его
		if (markersLayerRef.current) {
			markersLayerRef.current.clearLayers();
		} else {
			markersLayerRef.current = L.layerGroup().addTo(map);
		}

		canvasLayerRef.current = L.canvas({ padding: 0.5 });
		canvasLayerRef.current.addTo(map);

		//HELP: Функция обновления маркеров при изменении зума
		const updateMarkers = () => {
			if (!dataMap || dataMap.points.length === 0) return;

			markersLayerRef.current!.clearLayers();
			const zoomLevelMap = map.getZoom();
			const bounds = map.getBounds(); //HELP: Получаем границы видимой области карты

			dataMap.points.forEach(marker => {
				const crd = marker.crd || [0, 0];
				const markerName = marker.name || 'No name';
				let mapObject: L.Layer | null = null;

				//HELP: Проверяем, входит ли маркер в видимую область карты. Если нет, то не отрисовываем его
				if (!bounds.contains(crd)) return;

				//HELP: Если зум >= 16 и есть полигон то рисуем полигон
				if (zoomLevelMap >= 16 && marker.polygon && marker.polygon.length > 0) {
					mapObject = L.polygon(marker.polygon, {
						color: `#${marker.color}`,
						weight: 2,
						// fillColor: marker.color,
						// fillOpacity: 0.4,
					}).addTo(markersLayerRef.current!);
				}
				//HELP: Если зум 14-15 то рисуем кастомную иконку
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
				//HELP: Если зум < 14 то рисуем круглый маркер (CircleMarker)
				else {
					mapObject = L.circleMarker(crd, {
						renderer: canvasLayerRef.current!,
						radius: 6,
						color: `#${marker.color}`,
						// fillColor: marker.color,
						// fillOpacity: 1,
					}).addTo(markersLayerRef.current!);
				}
				// Добавляем попап и клик
				if (mapObject) {
					mapObject.bindPopup(markerName);
					mapObject.on('click', () => handleClickOnMarker(marker.id));
				}
			});
		};
		//HELP: Вызов при монтировании и подписка на изменение зума
		updateMarkers();

		map.on('zoomend', updateMarkers);
		map.on('moveend', updateMarkers); //HELP: Обновляем маркеры при движении карты
		//HELP: Очистка при размонтировании
		return () => {
			map.off('zoomend', updateMarkers);
			map.off('moveend', updateMarkers);
			markersLayerRef.current?.clearLayers();
		};
	}, [dataMap, map]);

	return null;
};
export default CanvasMarkersLayer;
