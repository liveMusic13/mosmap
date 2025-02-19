import { create } from 'zustand';

import {
	ICenterMapStore,
	IClearAllFiltersStore,
	IFiltersStore,
	IListOfObjectsStore,
} from '@/types/store.types';

export const useListOfObjectsStore = create<IListOfObjectsStore>(set => ({
	isListOfObjects: true,
	setIsListOfObjects: bol => set({ isListOfObjects: bol }),
}));

export const useFiltersStore = create<IFiltersStore>(set => ({
	isFilters: true,
	setIsFilters: bol => set({ isFilters: bol }),
}));

export const useCenterMapStore = create<ICenterMapStore>(set => ({
	centerMap: [55.7522, 37.6156],
	setCenterMap: coords => set({ centerMap: coords }),
}));

export const useClearAllFiltersStore = create<IClearAllFiltersStore>(set => ({
	isClear: false,
	setCenterMap: bol => set({ isClear: bol }),
}));
