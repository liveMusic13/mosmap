import L from 'leaflet';
import { FC } from 'react';
import { Marker } from 'react-leaflet';

import { useDotInfoCoordsStore, useViewDotInfoStore } from '@/store/store';

import { useGetSizeMarker } from '@/hooks/useGetSizeMarkers';

const MarkerEmptyArea: FC = () => {
	const coords = useDotInfoCoordsStore(store => store.coords);
	const isViewDotInfo = useViewDotInfoStore(store => store.isViewDotInfo);

	const sizeMarker = useGetSizeMarker();

	return (
		isViewDotInfo && (
			<Marker
				position={[coords.lat, coords.lng]}
				icon={L.icon({
					iconUrl: '/images/icons/marker.png',
					iconSize: sizeMarker,
				})}
			></Marker>
		)
	);
};

export default MarkerEmptyArea;
