import { create } from 'zustand';

import {
	ICenterMapStore,
	IClearAllFiltersStore,
	IFiltersStore,
	IIdObjectInfoStore,
	IListOfObjectsStore,
	IObjectInfoStore,
	ITargetObjectStore,
	IToggleViewAreaStore,
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
