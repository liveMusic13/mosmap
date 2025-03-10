import { IMarker } from '@/types/requestData.types';

export const isMarkerInsidePolygon = (
	marker: IMarker,
	polygon: { id: number; latLngs: { lat: number; lng: number }[] },
	// polygon: IPolygonForMapLayers,
) => {
	if (marker.crd === null || polygon === undefined) {
		return false;
	}
	let x = marker.crd[0],
		y = marker.crd[1];
	console.log(polygon);
	//HELP: Преобразование формата полигона
	let polygonCoordinates = polygon.latLngs.map(point => [point.lat, point.lng]);

	let inside = false;
	for (
		let i = 0, j = polygonCoordinates.length - 1;
		i < polygonCoordinates.length;
		j = i++
	) {
		let xi = polygonCoordinates[i][0],
			yi = polygonCoordinates[i][1];
		let xj = polygonCoordinates[j][0],
			yj = polygonCoordinates[j][1];

		let intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
};
