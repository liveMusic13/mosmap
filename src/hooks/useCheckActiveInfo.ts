import { useEffect } from 'react';

import {
	useActiveAddObjectStore,
	useFiltersStore,
	useObjectInfoStore,
} from '@/store/store';

export const useCheckActiveInfo = () => {
	const isObjectInfo = useObjectInfoStore(store => store.isObjectInfo);
	const isActiveAddObject = useActiveAddObjectStore(
		store => store.isActiveAddObject,
	);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);

	useEffect(() => {
		if (isObjectInfo || isActiveAddObject) {
			setIsFilters(false);
		}
	}, [isObjectInfo, isActiveAddObject]);
};
