import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// import { useViewAllObjectsStore } from '@/store/store';

const MapResizeHandler = () => {
	const map = useMap();
	// const isViewAllObjects = useViewAllObjectsStore(
	// 	store => store.isViewAllObjects,
	// );

	useEffect(() => {
		if (map && typeof map.invalidateSize === 'function') {
			const timer = setTimeout(() => {
				map.invalidateSize();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [map]);

	// useEffect(() => {
	// 	if (map) {
	// 		map.invalidateSize();
	// 	}
	// }, [
	// 	// isViewAllObjects,
	// 	map,
	// ]);

	return null;
};

export default MapResizeHandler;
