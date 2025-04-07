import { LatLngExpression } from 'leaflet';

import { IImportResponse, IMarker } from './requestData.types';

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

export interface IActiveAddObjectStore {
	isActiveAddObject: boolean;
	setIsActiveAddObject: (bol: boolean) => void;
}

export interface ITargetObjectStore {
	marker: IMarker | null;
	setMarker: (marker: IMarker) => void;
	clearMarker: () => void;
}

export interface IPopupStore {
	isPopup: boolean;
	setIsPopup: (bol: boolean) => void;
	messageInPopup: string;
	setMessageInPopup: (mes: string) => void;
}

export interface ISearchAddressStore {
	isSearchAddress: boolean;
	setIsSearchAddress: (bol: boolean) => void;
}

export interface IZoomLevelStore {
	zoomLevel: number;
	setZoomLevel: (num: number) => void;
}

export interface ISelectAreaStore {
	isSelectArea: boolean;
	setSelectArea: (bol: boolean) => void;
}

export interface IPolygonForMapLayers {
	id: number;
	latLngs: {
		lat: number;
		lng: number;
	}[];
}

export interface IMapLayersStore {
	indexTargetPolygon: number | null;
	arrayPolygons: IPolygonForMapLayers[];
	setIndexTargetPolygon: (id: number | null) => void;
	addPolygon: (pol: IPolygonForMapLayers) => void;
	deletePolygon: (id: number) => void;
	clearPolygon: () => void;
}

export interface IViewDotInfoStore {
	isViewDotInfo: boolean;
	setViewDotInfo: (bol: boolean) => void;
}

export interface IDotInfoCoordsStore {
	coords: {
		lat: number;
		lng: number;
	};
	setCoords: (coords: { lat: number; lng: number }) => void;
}

export interface IQueryKeysForGetCacheDataStore {
	separator: string;
	encoding: string;
	setNewCache: (data: { separator: string; encoding: string }) => void;
}

export interface IImportResponseStore extends IImportResponse {
	setImportResponse: (data: IImportResponse) => void;
}

export interface IColorsIntervalStore {
	isColorInterval: boolean;
	setIsColorInterval: (bol: boolean) => void;
}

export interface ISuccessSaveColorsIntervalStore {
	isSuccessSaveColorsInterval: boolean;
	ranges_color_map: string;
	setRanges_color_map: (str: string) => void;
	setIsSuccessSaveColorsInterval: (bol: boolean) => void;
}

export interface IBurgerMenuStore {
	isBurgerMenu: boolean;
	setIsBurgerMenu: (bol: boolean) => void;
}

export interface IRemoveMarkerCrdStore {
	isRemoveMarker: boolean;
	setIsRemoveMarker: (bol: boolean) => void;
}
