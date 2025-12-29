import L from 'leaflet';
import { FC } from 'react';
import { Marker } from 'react-leaflet';

import {
	useDotInfoCoordsStore,
	// useViewDotInfoStore,
	useViewObjectAbdAreaInfoStore,
	useViewStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetSizeMarker } from '@/hooks/useGetSizeMarkers';

const MarkerEmptyArea: FC = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const coords = useDotInfoCoordsStore(store => store.coords);
	const view = useViewStore(store => store.view);

	const isViewAreaInfo = useViewObjectAbdAreaInfoStore(
		store => store.isViewAreaInfo,
	);

	const sizeMarker = useGetSizeMarker();

	// const shouldShowMarker = isMobile ? isViewAreaInfo : isViewDotInfo;
	const shouldShowMarker = isMobile ? isViewAreaInfo : view === 'zoneInfo';

	console.log('shouldShowMarker', shouldShowMarker, isViewAreaInfo, view);

	return shouldShowMarker ? (
		<Marker
			position={[coords.lat, coords.lng]}
			icon={L.icon({
				iconUrl: '/images/icons/marker.png',
				iconSize: sizeMarker,
			})}
		></Marker>
	) : null;
};

export default MarkerEmptyArea;
