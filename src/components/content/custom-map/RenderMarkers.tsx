import { LatLngExpression, divIcon } from 'leaflet';
import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Polygon, Popup } from 'react-leaflet';

import IconMarker from '@/components/ui/icon-marker/IconMarker';

import { IRenderMarkers } from '@/types/props.types';

import { useZoomLevelStore } from '@/store/store';

import { useClickOnMarker } from '@/hooks/useClickOnMarker';

const RenderMarkers: FC<IRenderMarkers> = ({ dataMap }) => {
	const zoomLevel = useZoomLevelStore(state => state.zoomLevel);
	const handleClickOnMarker = useClickOnMarker();

	return dataMap.points.map(mark => {
		if (zoomLevel >= 16 && mark.polygon && mark.polygon.length > 0) {
			return (
				<Polygon
					key={mark.id}
					positions={mark.polygon}
					eventHandlers={{ click: () => handleClickOnMarker(mark.id) }}
				>
					<Popup>
						{mark.values
							? mark.values?.find(el => el.label === 'Наименование')?.value
							: mark.name}
					</Popup>
				</Polygon>
			);
		} else {
			return (
				<Marker
					key={mark.id}
					position={(mark.crd as LatLngExpression) || [0, 0]}
					icon={divIcon({
						className: 'my-custom-icon',
						iconSize: [22, 22],
						html: renderToStaticMarkup(
							<IconMarker key={mark.id} mark={mark} size={[22, 22]} />,
						),
					})}
					eventHandlers={{ click: () => handleClickOnMarker(mark.id) }}
				>
					<Popup>
						{mark.values
							? mark.values?.find(el => el.label === 'Наименование')?.value
							: mark.name}
					</Popup>
				</Marker>
			);
		}
	});
};

export default RenderMarkers;
