import L from 'leaflet';
import { FC } from 'react';
import { Marker } from 'react-leaflet';

import { useDotInfoCoordsStore, useViewDotInfoStore } from '@/store/store';

const MarkerEmptyArea: FC = () => {
	const coords = useDotInfoCoordsStore(store => store.coords);
	const isViewDotInfo = useViewDotInfoStore(store => store.isViewDotInfo);

	return (
		isViewDotInfo && (
			<Marker
				position={[coords.lat, coords.lng]}
				icon={L.icon({
					iconUrl: '/images/icons/marker.png',
					iconSize: [40, 40],
					iconAnchor: [18.5, 34],
				})}
			></Marker>
		)
	);
};

export default MarkerEmptyArea;
