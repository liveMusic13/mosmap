import { create } from 'zustand';

import { IFiltersStore, IListOfObjectsStore } from '@/types/store.types';

export const useListOfObjectsStore = create<IListOfObjectsStore>(set => ({
	isListOfObjects: true,
	setIsListOfObjects: bol => set({ isListOfObjects: bol }),
}));

export const useFiltersStore = create<IFiltersStore>(set => ({
	isFilters: true,
	setIsFilters: bol => set({ isFilters: bol }),
}));
