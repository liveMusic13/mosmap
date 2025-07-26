import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useListOfObjectsStore, useViewStore } from '@/store/store';

const MapResizeHandler = () => {
	const map = useMap();
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const view = useViewStore(store => store.view);

	useEffect(() => {
		if (map && typeof map.invalidateSize === 'function') {
			const timer = setTimeout(() => {
				map.invalidateSize();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [map, isListOfObjects, view]);

	return null;
};

export default MapResizeHandler;
