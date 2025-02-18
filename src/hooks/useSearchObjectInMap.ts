export const useSearchObjectInMap = mapRef => {
	const handleCenterChange = coords => {
		mapRef.current?.setView(coords, mapRef.current?.getZoom());
	};
};
