import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import IconMarker from '@/components/ui/icon-marker/IconMarker';

import { ICustomMap } from '@/types/props.types';

import styles from './CustomMap.module.scss';
import MapResizeHandler from './MapResizeHandler';

const CustomMap: FC<ICustomMap> = ({ dataMap }) => {
	return (
		<MapContainer
			center={[55.7522, 37.6156]}
			minZoom={dataMap.zoom_min}
			maxZoom={dataMap.zoom_max}
			zoom={13}
			maxBounds={
				dataMap.bounds !== '[[null, null], [null, null]]'
					? JSON.parse(dataMap.bounds)
					: undefined
			}
			className={styles.custom_map}
		>
			<MapResizeHandler />
			<TileLayer url={dataMap.tiles_url} />
			{dataMap.points.map(mark => (
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
				>
					<Popup>{mark.name}</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default CustomMap;
