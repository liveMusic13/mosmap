import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useListOfObjectsStore } from '@/store/store';

const MapResizeHandler = () => {
	const map = useMap();
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);

	useEffect(() => {
		if (map && typeof map.invalidateSize === 'function') {
			const timer = setTimeout(() => {
				map.invalidateSize();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [map, isListOfObjects]);

	// useEffect(() => {
	// 	console.log('use');

	// 	if (map) {
	// 		console.log('yes');
	// 		map.invalidateSize();
	// 	}
	// }, [
	// 	// isViewAllObjects,
	// 	map,
	// 	isListOfObjects,
	// ]);

	return null;
};

export default MapResizeHandler;
