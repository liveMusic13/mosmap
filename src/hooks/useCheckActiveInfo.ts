import { useActiveAddObjectStore, useViewStore } from '@/store/store';

export const useCheckActiveInfo = () => {
	// const isObjectInfo = useObjectInfoStore(store => store.isObjectInfo);
	const isActiveAddObject = useActiveAddObjectStore(
		store => store.isActiveAddObject,
	);
	// const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const closeView = useViewStore(store => store.closeView);

	// useEffect(() => {
	// 	if (isObjectInfo || isActiveAddObject) {
	// 		setIsFilters(false);
	// 	}
	// }, [isObjectInfo, isActiveAddObject]);
};
