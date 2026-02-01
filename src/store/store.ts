import { create } from 'zustand';

import {
	IActiveAddObjectStore,
	IBurgerMenuStore,
	ICenterMapStore,
	IClearAllFiltersStore,
	IColorsIntervalStore,
	IDotInfoCoordsStore,
	IIdObjectInfoStore,
	IImportResponseStore,
	IListOfObjectsStore,
	IMapLayersStore,
	IPopupStore,
	IQueryKeysForGetCacheDataStore,
	IRemoveMarkerCrdStore,
	ISearchAddressStore,
	ISelectAreaStore,
	ISuccessSaveColorsIntervalStore,
	ITargetObjectStore,
	IToggleViewAreaStore,
	IViewObjectAndAreaInfoStore,
	IViewStore,
	IZoomLevelStore,
} from '@/types/store.types';

export const useListOfObjectsStore = create<IListOfObjectsStore>(set => ({
	isListOfObjects: true,
	setIsListOfObjects: bol => set({ isListOfObjects: bol }),
}));

export const useIdObjectInfoStore = create<IIdObjectInfoStore>((set, get) => ({
	idObjectInfo: null,
	setIdObjectInfo: id => set({ idObjectInfo: id }),
}));

export const useTargetMarkerInAreaStore = create<{
	marker: string | null;
	setMarker: (id: string) => void;
}>((set, get) => ({
	marker: null,
	setMarker: id => set({ marker: id }),
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
	zoomLevel: 10,
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

// один store вместо трёх
export const useViewStore = create<IViewStore>(set => ({
	view: 'filters',
	prevView: null,

	// открываем новый экран, запоминая текущий
	openView: newView =>
		set(state => ({
			prevView: state.view,
			view: newView,
		})),

	// // закрываем текущий экран и возвращаем предыдущее, или к фильтрам
	// closeView: () =>
	// 	set(state => ({
	// 		view: state.prevView ?? 'filters',
	// 		prevView: null,
	// 	})),
	// закрываем текущий экран и возвращаем предыдущее, или к фильтрам
	closeView: () =>
		set(state => ({
			view: state.prevView,
			prevView: null,
		})),

	fullCloseView: () =>
		set(state => ({
			view: null,
			prevView: null,
		})),
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
	isColorIntervalMobile: false,
	setIsColorIntervalMobile: bol => set({ isColorIntervalMobile: bol }),
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

export const useBurgerMenuStore = create<IBurgerMenuStore>(set => ({
	isBurgerMenu: false,
	setIsBurgerMenu: bol => set({ isBurgerMenu: bol }),
}));

export const useRemoveMarkerCrdStore = create<IRemoveMarkerCrdStore>(set => ({
	isRemoveMarker: false,
	setIsRemoveMarker: bol => set({ isRemoveMarker: bol }),
}));

export const useViewObjectAbdAreaInfoStore =
	create<IViewObjectAndAreaInfoStore>(set => ({
		isViewAreaInfo: false,
		setIsViewAreaInfo: bol => set({ isViewAreaInfo: bol }),
		isViewObjectInfo: false,
		setIsViewObjectInfo: bol => set({ isViewObjectInfo: bol }),
	}));

export const useViewPeopleAreaStore = create(set => ({
	isViewPeopleArea: false,
	setIsViewPeopleArea: (bol: boolean) =>
		set({
			isViewPeopleArea: bol,
		}),
}));

export const useIdPeopleAreaStore = create<{
	idPeopleArea: number[];
	setIdPeopleArea: (id: number) => void;
	setAllIdPeopleArea: (id: number[]) => void;
}>(set => ({
	idPeopleArea: [],
	setIdPeopleArea: (id: number) =>
		set(state => ({
			idPeopleArea: state.idPeopleArea.includes(id)
				? state.idPeopleArea.filter(existingId => existingId !== id)
				: [...state.idPeopleArea, id],
		})),
	setAllIdPeopleArea: (ids: number[]) => set({ idPeopleArea: ids }),
}));

export const useViewOrganizationAreaStore = create(set => ({
	isViewOrganizationArea: false,
	setIsViewOrganizationArea: (bol: boolean) =>
		set({
			isViewOrganizationArea: bol,
		}),
}));
