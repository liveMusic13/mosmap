import { useEffect } from 'react';

import {
	useColorsIntervalStore,
	useFiltersStore,
	useListOfObjectsStore,
} from '@/store/store';

export const useDisabledStatesForMobile = (isMobile: boolean) => {
	const setIsListOfObjects = useListOfObjectsStore(
		store => store.setIsListOfObjects,
	);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsColorInterval = useColorsIntervalStore(
		store => store.setIsColorInterval,
	);

	useEffect(() => {
		if (isMobile) {
			setIsListOfObjects(false);
			setIsFilters(false);
			setIsColorInterval(false);
		}
	}, [isMobile]);
};
