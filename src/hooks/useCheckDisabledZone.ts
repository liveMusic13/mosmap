import { useActiveAddObjectStore } from '@/store/store';

export const useCheckDisabledZone = () => {
	// const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	// const isFilters = useFiltersStore(store => store.isFilters);
	// const isObjectInfo = useObjectInfoStore(store => store.isObjectInfo);
	const isActiveAddObject = useActiveAddObjectStore(
		store => store.isActiveAddObject,
	);

	// useEffect(() => {
	// 	if (isFilters || isObjectInfo || isActiveAddObject) {
	// 		setViewDotInfo(false);
	// 	}
	// }, [isFilters, isObjectInfo, isActiveAddObject]);
};
