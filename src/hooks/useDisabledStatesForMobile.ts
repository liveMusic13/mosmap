import { useEffect } from 'react';

import {
	useColorsIntervalStore,
	// useFiltersStore,
	useListOfObjectsStore,
	useViewStore,
} from '@/store/store';

export const useDisabledStatesForMobile = (isMobile: boolean) => {
	const setIsListOfObjects = useListOfObjectsStore(
		store => store.setIsListOfObjects,
	);
	// const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const fullCloseView = useViewStore(store => store.fullCloseView);

	const setIsColorInterval = useColorsIntervalStore(
		store => store.setIsColorInterval,
	);

	useEffect(() => {
		if (isMobile) {
			setIsListOfObjects(false);
			// setIsFilters(false);
			fullCloseView();
			setIsColorInterval(false);
		}
	}, [isMobile]);
};
