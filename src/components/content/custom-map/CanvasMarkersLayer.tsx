import L, { Canvas, LatLngExpression } from 'leaflet';
import { FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { ICanvasMarkersLayer } from '@/types/props.types';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';

import {
	useIdObjectInfoStore,
	useIdPeopleAreaStore,
	useTargetMarkerInAreaStore,
	useViewObjectAbdAreaInfoStore,
	useViewPeopleAreaStore,
	useViewStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';
import { useClickOnMarker } from '@/hooks/useClickOnMarker';
import { useGetSizeMarker } from '@/hooks/useGetSizeMarkers';

import { getIconForMarker } from '@/utils/iconForMarker';

import { colors } from '@/app.constants';

const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({ dataMap }) => {
	if (!dataMap.points || dataMap.points.length === 0) return null;

	const { marker: marker_in_area } = useTargetMarkerInAreaStore(store => store);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setIsViewObjectInfo = useViewObjectAbdAreaInfoStore(
		store => store.setIsViewObjectInfo,
	);

	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const view = useViewStore(store => store.view);

	const { areaCoords } = useGetAreaPeoples(view === 'zoneInfo');

	const { idPeopleArea }: any = useIdPeopleAreaStore(store => store);

	const { data: data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		isViewPeopleArea,
	);

	const sizeMarker = useGetSizeMarker();

	const handleClickOnMarker = useClickOnMarker();

	const map = useMap();
	const canvasLayerRef = useRef<Canvas | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);

	useEffect(
		() => console.log('isViewPeopleArea in canvas', isViewPeopleArea),
		[isViewPeopleArea],
	);

	useEffect(() => {
		if (!map || !idObjectInfo) return;
		const marker = dataMap.points.find(m => m.id === idObjectInfo);
		if (marker?.crd) {
			L.popup()
				.setLatLng(marker.crd as LatLngExpression)
				.setContent(marker.name || 'No name')
				.openOn(map);
			setIsViewObjectInfo(true);
		}
	}, [idObjectInfo, map, dataMap]);

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

			dataMap.points.forEach((marker, ind) => {
				const crd = marker.crd || [0, 0];
				const markerName = marker.name || 'No name';
				let mapObject: L.Layer | null = null;
				if (ind === 1)
					console.log('isViewPeopleArea in render marks', isViewPeopleArea);
				if (isViewPeopleArea && data_area?.data?.area && ind === 1) {
					const color = 'red';
					const weight = 3;

					mapObject = L.polygon(data_area?.data?.area, {
						color: color,
						weight: weight,
						interactive: false,
					}).addTo(markersLayerRef.current!);

					if (idPeopleArea.length > 0 && data_area?.data?.orgs) {
						console.log('check orgs', data_area?.data?.orgs, idPeopleArea);
						idPeopleArea.forEach((id: string) => {
							const orgs = data_area?.data?.orgs.find(
								(el: any) => el.group_id === id,
							);
							console.log('orgs in idPeopleArea', orgs);
							if (orgs?.org.length > 0) {
								orgs?.org.forEach((org: any) => {
									// Проверяем что организация существует И у неё есть координаты
									if (!org.lat || !org.lng) {
										console.log('Организация без координат:', id, org);
										return;
									}
									const colorOrg =
										marker_in_area === `${org.name}${org.distance}`
											? colors.green
											: '#000';
									const orgCrd = [org.lat, org.lng];

									L.circleMarker(orgCrd as LatLngExpression, {
										renderer: canvasLayerRef.current!,
										radius: 10,
										color: colorOrg,
										weight: 6,
									})
										.addTo(markersLayerRef.current!)
										.bindPopup(`${org.name}. Расстояние: ${org.distance} м.`)
										.on('click', () => console.log('test', org));
								});
							}
						});
					}
				}

				//HELP: Проверяем, входит ли маркер в видимую область карты. Если нет, то не отрисовываем его
				if (!bounds.contains(crd as LatLngExpression)) return;

				//HELP: Если зум >= 16 и есть полигон то рисуем полигон
				if (zoomLevelMap >= 16 && marker.polygon && marker.polygon.length > 0) {
					const color =
						idObjectInfo === marker.id ? '#000' : `#${marker.color}`;
					const weight = idObjectInfo === marker.id ? 3 : 2;

					mapObject = L.polygon(marker.polygon, {
						color: color,
						weight: weight,
					}).addTo(markersLayerRef.current!);
				}
				//HELP: Если зум < или равен 13 то рисуем круглый маркер (CircleMarker)
				else if (zoomLevelMap <= 13) {
					const color =
						idObjectInfo === marker.id ? '#000' : `#${marker.color}`;

					mapObject = L.circleMarker(crd as LatLngExpression, {
						renderer: canvasLayerRef.current!,
						radius: 6,
						color: color,
					}).addTo(markersLayerRef.current!);
				}
				//HELP: В других случая рисуем кастомную иконку
				else {
					const editMarker =
						idObjectInfo === marker.id
							? { ...marker, icon: 'target', color: colors.red }
							: marker;
					const svg = getIconForMarker(editMarker, sizeMarker);
					const encodedSvg = encodeURIComponent(svg);
					const dataUrl = 'data:image/svg+xml,' + encodedSvg;
					const icon = L.icon({
						iconUrl: dataUrl,
						iconSize: sizeMarker,
					});
					mapObject = L.marker(crd as LatLngExpression, { icon }).addTo(
						markersLayerRef.current!,
					);
				}
				//HELP: Добавляем попап и клик
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
	}, [
		dataMap,
		map,
		idObjectInfo,
		sizeMarker,
		isViewPeopleArea,
		idPeopleArea,
		areaCoords[0],
		areaCoords[1],
		data_area,
		marker_in_area,
	]);

	return null;
};
export default CanvasMarkersLayer;
