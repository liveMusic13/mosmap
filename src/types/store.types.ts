import { LatLngExpression } from 'leaflet';

export interface IListOfObjectsStore {
	isListOfObjects: boolean;
	setIsListOfObjects: (bol: boolean) => void;
}

export interface IFiltersStore {
	isFilters: boolean;
	setIsFilters: (bol: boolean) => void;
}

export interface IObjectInfoStore {
	isObjectInfo: boolean;
	setIsObjectInfo: (bol: boolean) => void;
}

export interface IIdObjectInfoStore {
	idObjectInfo: number | null;
	setIdObjectInfo: (bol: number) => void;
}

export interface ICenterMapStore {
	centerMap: LatLngExpression;
	setCenterMap: (coords: LatLngExpression) => void;
}

export interface IClearAllFiltersStore {
	isClear: boolean;
	setIsClear: (bol: boolean) => void;
}
