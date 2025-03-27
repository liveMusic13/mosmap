import { create } from 'zustand';

import {
	IActiveAddObjectStore,
	ICenterMapStore,
	IClearAllFiltersStore,
	IColorsIntervalStore,
	IDotInfoCoordsStore,
	IFiltersStore,
	IIdObjectInfoStore,
	IImportResponseStore,
	IListOfObjectsStore,
	IMapLayersStore,
	IObjectInfoStore,
	IPopupStore,
	IQueryKeysForGetCacheDataStore,
	ISearchAddressStore,
	ISelectAreaStore,
	ISuccessSaveColorsIntervalStore,
	ITargetObjectStore,
	IToggleViewAreaStore,
	IViewDotInfoStore,
	IZoomLevelStore,
} from '@/types/store.types';

export const useListOfObjectsStore = create<IListOfObjectsStore>(set => ({
	isListOfObjects: true,
	setIsListOfObjects: bol => set({ isListOfObjects: bol }),
}));

export const useFiltersStore = create<IFiltersStore>(set => ({
	isFilters: true,
	setIsFilters: bol => set({ isFilters: bol }),
}));

export const useObjectInfoStore = create<IObjectInfoStore>(set => ({
	isObjectInfo: false,
	setIsObjectInfo: bol => set({ isObjectInfo: bol }),
}));

export const useIdObjectInfoStore = create<IIdObjectInfoStore>((set, get) => ({
	idObjectInfo: null,
	setIdObjectInfo: id => set({ idObjectInfo: id }),
}));

export const useCenterMapStore = create<ICenterMapStore>(set => ({
	centerMap: [55.7522, 37.6156],
	setCenterMap: coords => set({ centerMap: coords }),
}));

export const useClearAllFiltersStore = create<IClearAllFiltersStore>(set => ({
	isClear: false,
	setIsClear: bol => set({ isClear: bol }),
}));

export const useToggleViewAreaStore = create<IToggleViewAreaStore>(set => ({
	isViewArea: false,
	setIsViewArea: bol => set({ isViewArea: bol }),
}));

export const useTargetObjectStore = create<ITargetObjectStore>(set => ({
	marker: null,
	setMarker: marker => set({ marker: marker }),
	clearMarker: () => set({ marker: null }),
}));

export const useActiveAddObjectStore = create<IActiveAddObjectStore>(set => ({
	isActiveAddObject: false,
	setIsActiveAddObject: bol => set({ isActiveAddObject: bol }),
}));

export const usePopupStore = create<IPopupStore>(set => ({
	isPopup: false,
	setIsPopup: bol => set({ isPopup: bol }),
	messageInPopup: '',
	setMessageInPopup: mes => set({ messageInPopup: mes }),
}));

export const useSearchAddressStore = create<ISearchAddressStore>(set => ({
	isSearchAddress: false,
	setIsSearchAddress: bol => set({ isSearchAddress: bol }),
}));

export const useZoomLevelStore = create<IZoomLevelStore>(set => ({
	zoomLevel: 13,
	setZoomLevel: num => set({ zoomLevel: num }),
}));

export const useSelectAreaStore = create<ISelectAreaStore>(set => ({
	isSelectArea: false,
	setSelectArea: bol => set({ isSelectArea: bol }),
}));

export const useMapLayersStore = create<IMapLayersStore>(set => ({
	indexTargetPolygon: null,
	arrayPolygons: [],
	clearPolygon: () => set({ arrayPolygons: [] }),
	setIndexTargetPolygon: id =>
		set(state => {
			const index = state.arrayPolygons.findIndex(pol => pol.id === id);
			if (index !== -1) {
				return { indexTargetPolygon: index };
			} else {
				return { indexTargetPolygon: state.indexTargetPolygon };
			}
		}),
	deletePolygon: id =>
		set(state => ({
			arrayPolygons: state.arrayPolygons.filter(polygon => polygon.id !== id),
		})),
	addPolygon: pol =>
		set(state => ({ arrayPolygons: [...state.arrayPolygons, pol] })),
}));

export const useViewDotInfoStore = create<IViewDotInfoStore>(set => ({
	isViewDotInfo: false,
	setViewDotInfo: bol => set({ isViewDotInfo: bol }),
}));

export const useDotInfoCoordsStore = create<IDotInfoCoordsStore>(set => ({
	coords: {
		lat: 0,
		lng: 0,
	},
	setCoords: coords => set({ coords: coords }),
}));
///
export const useQueryKeysForGetCacheDataStore =
	create<IQueryKeysForGetCacheDataStore>(set => ({
		encoding: '',
		separator: '',
		setNewCache: data => set({ ...data }),
	}));
///

export const useImportResponseStore = create<IImportResponseStore>(set => ({
	encoding: '',
	file_field: [],
	list_field: {},
	separator: '',
	text_field: {},
	uploadfile: '',
	setImportResponse: data => set({ ...data }),
}));

export const useColorsIntervalStore = create<IColorsIntervalStore>(set => ({
	isColorInterval: false,
	setIsColorInterval: bol => set({ isColorInterval: bol }),
}));

export const useSuccessSaveColorsIntervalStore =
	create<ISuccessSaveColorsIntervalStore>(set => ({
		isSuccessSaveColorsInterval: false,
		ranges_color_map: '',
		setRanges_color_map: str => set({ ranges_color_map: str }),
		setIsSuccessSaveColorsInterval: bol =>
			set({ isSuccessSaveColorsInterval: bol }),
	}));
