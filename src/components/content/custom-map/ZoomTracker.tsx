import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';

import { useZoomLevelStore } from '@/store/store';

const ZoomTracker: FC = () => {
	const setZoomLevel = useZoomLevelStore(state => state.setZoomLevel);
	const zoomLevel = useZoomLevelStore(state => state.zoomLevel);

	console.log('zoomLevel', zoomLevel);

	const map = useMapEvents({
		zoomend: () => setZoomLevel(map.getZoom()),
	});

	return null;
};

export default ZoomTracker;
