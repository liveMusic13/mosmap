import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { EditControl } from 'react-leaflet-draw';

import { ICustomMap } from '@/types/props.types';
import { IDataMap } from '@/types/requestData.types';

import { useCenterMapStore, useSelectAreaStore } from '@/store/store';

import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSelectArea } from '@/hooks/useSelectArea';

import CanvasMarkersLayer from './CanvasMarkersLayer';
import styles from './CustomMap.module.scss';
import FlyToLocation from './FlyToLocation';
import MapResizeHandler from './MapResizeHandler';
import RenderArea from './RenderArea';
import RenderMarkers from './RenderMarkers';
import ZoomTracker from './ZoomTracker';

const CustomMap: FC<ICustomMap> = () => {
	const searchParams = useSearchParams();
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();
	const { data, isLoading, isSuccess } = useGetDataMap(queryString);

	const centerMap = useCenterMapStore(store => store.centerMap);
	const isSelectArea = useSelectAreaStore(store => store.isSelectArea);

	const { _onCreated, _onDeleted } = useSelectArea();

	return (
		isSuccess && (
			<MapContainer
				//TODO: Если поставлю ключ, то исчезает ошибка и все ок, но тогда при срабатывании FlyToLocation происходит не анимация а просто скачок. ставим этот момент для продакшена и там посмотрим будет ли эта ошибка или нет. Если нет, то можноне ставить ключ, либо поставим и будет переход к маркерубез анимации.
				// key={Math.random()} //HELP: Ставлю рандомный ключ, чтобы убрать ошибку, которая возникает при перезагрузки страницы. Суть той ошибки в том, что при обновлении страницы должен создаваться экземпляр новой карты, но старая не удаляется и поэтому возникает ошибка. Благодаря рандомному ключу экземпляр карты всегда будет уникальным
				// center={[55.7522, 37.6156]}
				center={centerMap || [55.7522, 37.6156]}
				minZoom={data?.zoom_min}
				maxZoom={data?.zoom_max}
				zoom={13}
				maxBounds={
					data?.bounds !== '[[null, null], [null, null]]'
						? JSON.parse(data?.bounds || '')
						: undefined
				}
				className={styles.custom_map}
			>
				<ZoomTracker />
				<MapResizeHandler />
				<TileLayer url={data?.tiles_url || ''} />
				{data?.canvas_map === 0 ? (
					data?.clastering === 0 ? (
						<>
							<RenderMarkers dataMap={data} />
							<RenderArea />
						</>
					) : (
						<MarkerClusterGroup chunkedLoading={true}>
							<RenderMarkers dataMap={data} />
							<RenderArea />
						</MarkerClusterGroup>
					)
				) : (
					<>
						<CanvasMarkersLayer dataMap={data || ({} as IDataMap)} />
						<RenderArea />
					</>
				)}
				<FlyToLocation />
				{isSelectArea && (
					<FeatureGroup>
						<EditControl
							position='bottomright'
							onCreated={_onCreated}
							onDeleted={_onDeleted}
							draw={{
								rectangle: false,
								polyline: false,
								circle: false,
								circlemarker: false,
								marker: false,
							}}
						/>
					</FeatureGroup>
				)}
			</MapContainer>
		)
	);
};

export default CustomMap;
