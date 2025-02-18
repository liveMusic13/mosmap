import 'leaflet/dist/leaflet.css';
import { FC, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { ICustomMap } from '@/types/props.types';

import CanvasMarkersLayer from './CanvasMarkersLayer';
import styles from './CustomMap.module.scss';
import MapResizeHandler from './MapResizeHandler';
import RenderMarkers from './RenderMarkers';

const CustomMap: FC<ICustomMap> = ({ dataMap }) => {
	const mapRef = useRef(null); //TODO: ДОДЕЛАТЬ ЗУМ К МАРКЕРУ ПРИ КЛИКЕ НА СПИСОК

	return (
		<MapContainer
			ref={mapRef}
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
			{/* TODO: На время отрицание, потом поменять обратно на строгое равно */}
			{dataMap.canvas_map === 0 ? (
				dataMap.clastering === 0 ? (
					<RenderMarkers dataMap={dataMap} />
				) : (
					<MarkerClusterGroup chunkedLoading={true}>
						<RenderMarkers dataMap={dataMap} />
					</MarkerClusterGroup>
				)
			) : (
				<CanvasMarkersLayer dataMap={dataMap} />
			)}
		</MapContainer>
	);
};

export default CustomMap;
