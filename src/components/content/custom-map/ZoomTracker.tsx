import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';

import { useZoomLevelStore } from '@/store/store';

const ZoomTracker: FC = () => {
	const setZoomLevel = useZoomLevelStore(state => state.setZoomLevel);

	const map = useMapEvents({
		zoomend: () => setZoomLevel(map.getZoom()),
	});

	return null;
};

export default ZoomTracker;
