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

const createPopupContent = (org: any) => {
	const container = document.createElement('div');
	container.style.display = 'flex';
	container.style.flexDirection = 'column';
	container.style.fontSize = '1.3rem';

	const nameDiv = document.createElement('div');
	nameDiv.style.marginBottom = '4px';
	nameDiv.textContent = org.name;

	const distanceDiv = document.createElement('div');
	container.style.fontSize = '1.3rem';
	distanceDiv.textContent = `Расстояние: ${org.distance} м`;

	container.appendChild(nameDiv);
	container.appendChild(distanceDiv);

	return container;
};

const CanvasMarkersLayer: FC<ICanvasMarkersLayer> = ({ dataMap }) => {
	if (!dataMap.points || dataMap.points.length === 0) return null;

	const {
		marker: marker_in_area,
		setMarker: setMarkerArea,
		shouldOpenPopup,
	} = useTargetMarkerInAreaStore(store => store);
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
	const orgMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());
	const isPopupOpenRef = useRef(false); // Новый ref для отслеживания

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

			// КРИТИЧНО: Не делаем clearLayers если попап открыт
			if (isPopupOpenRef.current) {
				console.log('Skipping marker update - popup is open');
				return;
			}

			markersLayerRef.current!.clearLayers();

			// Очищаем Map перед добавлением новых маркеров
			orgMarkersRef.current.clear();

			const zoomLevelMap = map.getZoom();
			const bounds = map.getBounds(); //HELP: Получаем границы видимой области карты

			dataMap.points.forEach((marker, ind) => {
				const crd = marker.crd || [0, 0];
				const markerName = marker.name || 'No name';
				let mapObject: L.Layer | null = null;
				if (ind === 1)
					if (isViewPeopleArea && data_area?.data?.area && ind === 1) {
						const color = 'red';
						const weight = 3;

						mapObject = L.polygon(data_area?.data?.area, {
							color: color,
							weight: weight,
							interactive: false,
						}).addTo(markersLayerRef.current!);

						if (idPeopleArea.length > 0 && data_area?.data?.orgs) {
							idPeopleArea.forEach((id: string) => {
								const orgs = data_area?.data?.orgs.find(
									(el: any) => el.group_id === id,
								);

								if (orgs?.org.length > 0) {
									orgs?.org.forEach((org: any) => {
										if (!org.lat || !org.lng) {
											console.log('Организация без координат:', id, org);
											return;
										}

										// Получаем АКТУАЛЬНОЕ значение из стора напрямую
										const currentMarker =
											useTargetMarkerInAreaStore.getState().marker;
										const colorOrg =
											currentMarker === `${org.name}${org.distance}`
												? colors.green
												: '#000';

										const orgCrd = [org.lat, org.lng];
										const markerId = `${org.name}${org.distance}`;

										const circleMarker = L.circleMarker(
											orgCrd as LatLngExpression,
											{
												renderer: canvasLayerRef.current!,
												radius: 10,
												color: colorOrg,
												weight: 6,
											},
										)
											.addTo(markersLayerRef.current!)
											.bindPopup(createPopupContent(org));

										// ВАЖНО: Сохраняем ссылку на маркер
										orgMarkersRef.current.set(markerId, circleMarker);

										// Обработчик клика
										circleMarker.on('click', function (this: L.CircleMarker) {
											// Сбрасываем цвет у ВСЕХ маркеров организаций
											orgMarkersRef.current.forEach(marker => {
												marker.setStyle({ color: '#000' });
											});

											// Обновляем состояние
											setMarkerArea(markerId);

											// Перекрашиваем ТОЛЬКО этот маркер
											this.setStyle({ color: colors.green });

											// Открываем попап
											this.openPopup();
										});
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
			orgMarkersRef.current.clear();
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
	]);

	return null;
};
export default CanvasMarkersLayer;
