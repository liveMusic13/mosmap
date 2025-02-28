import { divIcon } from 'leaflet';
import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';

import IconMarker from '@/components/ui/icon-marker/IconMarker';

import { IRenderMarkers } from '@/types/props.types';

import { useClickOnMarker } from '@/hooks/useClickOnMarker';

//TODO: Забыл при разных зумах добавить полигоны. Надо сделать
const RenderMarkers: FC<IRenderMarkers> = ({ dataMap }) => {
	const handleClickOnMarker = useClickOnMarker();

	return dataMap.points.map(mark => (
		<Marker
			key={mark.id}
			position={mark.crd || [0, 0]}
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
	));
};

export default RenderMarkers;
