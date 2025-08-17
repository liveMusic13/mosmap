import { LatLngExpression, divIcon } from 'leaflet';
import { FC, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Polygon } from 'react-leaflet';

import IconMarker from '@/components/ui/icon-marker/IconMarker';

import { IRenderMarkers } from '@/types/props.types';

import { useIdObjectInfoStore, useZoomLevelStore } from '@/store/store';

import { useClickOnMarker } from '@/hooks/useClickOnMarker';
import { useGetSizeMarker } from '@/hooks/useGetSizeMarkers';

import { colors } from '@/app.constants';

const RenderMarkers: FC<IRenderMarkers> = ({ dataMap }) => {
	const zoomLevel = useZoomLevelStore(state => state.zoomLevel);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	const sizeMarker = useGetSizeMarker();

	const handleClickOnMarker = useClickOnMarker();

	return dataMap.points.map(mark => {
		if (zoomLevel >= 16 && mark.polygon && mark.polygon.length > 0) {
			const color = idObjectInfo === mark.id ? '#000' : `#${mark.color}`;
			const weight = idObjectInfo === mark.id ? 6 : 3;

			return (
				<Fragment key={mark.id}>
					<Polygon
						key={`${mark.id}-${idObjectInfo}`} //HELP: Цвет в отличии от иконки маркера не меняется из-за особенностей полигона. Поэтому добавляем к ключу id таргета и при смене таргета будет создаваться новый полигон с нужным цветом.
						positions={mark.polygon}
						color={color}
						weight={weight}
						eventHandlers={{ click: () => handleClickOnMarker(mark.id) }}
					>
						{/* <Popup>
							{mark.values
							? mark.values?.find(el => el.label === 'Наименование')?.value
							: mark.name}
							</Popup> */}
					</Polygon>
				</Fragment>
			);
		} else {
			let customMarkerIcon;

			if (idObjectInfo === mark.id) {
				customMarkerIcon = divIcon({
					className: 'my-custom-icon',
					iconSize: sizeMarker,
					html: renderToStaticMarkup(
						<IconMarker
							key={mark.id}
							mark={{ ...mark, icon: 'target', color: colors.red }}
							size={sizeMarker}
						/>,
					),
				});
			} else {
				customMarkerIcon = divIcon({
					className: 'my-custom-icon',
					iconSize: sizeMarker,
					html: renderToStaticMarkup(
						<IconMarker key={mark.id} mark={mark} size={sizeMarker} />,
					),
				});
			}

			return (
				<Fragment key={mark.id}>
					<Marker
						key={mark.id}
						position={(mark.crd as LatLngExpression) || [0, 0]}
						icon={customMarkerIcon}
						eventHandlers={{ click: () => handleClickOnMarker(mark.id) }}
					>
						{/* <Popup>
							{mark.values
								? mark.values?.find(el => el.label === 'Наименование')?.value
								: mark.name}
						</Popup> */}
					</Marker>
				</Fragment>
			);
		}
	});
};

export default RenderMarkers;
