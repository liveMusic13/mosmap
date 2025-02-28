import { LatLngExpression } from 'leaflet';

import { IMarker } from './requestData.types';

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

export interface IToggleViewAreaStore {
	isViewArea: boolean;
	setIsViewArea: (bol: boolean) => void;
}

export interface ITargetObjectStore {
	marker: IMarker | null;
	setMarker: (marker: IMarker) => void;
	clearMarker: () => void;
}
