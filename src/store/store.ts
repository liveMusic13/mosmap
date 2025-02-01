import { create } from 'zustand';

import { IListOfObjectsStore } from '@/types/store.types';

export const useListOfObjectsStore = create<IListOfObjectsStore>(set => ({
	isListOfObjects: true,
	setIsListOfObjects: bol => set({ isListOfObjects: bol }),
}));

// export const useViewFiltersStore = create<IViewFiltersStore>(set => ({
// 	isViewFilters: true,
// 	setIsViewFilters: bol => set({ isViewFilters: bol }),
// }));
