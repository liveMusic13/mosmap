import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { ICustomMap } from '@/types/props.types';

import { useCenterMapStore } from '@/store/store';

import CanvasMarkersLayer from './CanvasMarkersLayer';
import styles from './CustomMap.module.scss';
import FlyToLocation from './FlyToLocation';
import MapResizeHandler from './MapResizeHandler';
import RenderMarkers from './RenderMarkers';

const CustomMap: FC<ICustomMap> = ({ dataMap }) => {
	const centerMap = useCenterMapStore(store => store.centerMap);

	return (
		<MapContainer
			key={Math.random()} //HELP: Ставлю рандомный ключ, чтобы убрать ошибку, которая возникает при перезагрузки страницы. Суть той ошибки в том, что при обновлении страницы должен создаваться экземпляр новой карты, но старая не удаляется и поэтому возникает ошибка. Благодаря рандомному ключу экземпляр карты всегда будет уникальным
			// center={[55.7522, 37.6156]}
			center={centerMap}
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
			<FlyToLocation />
		</MapContainer>
	);
};

export default CustomMap;
