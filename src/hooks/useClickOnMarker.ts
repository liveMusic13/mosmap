import {
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
} from '@/store/store';

export const useClickOnMarker = () => {
	const { setIdObjectInfo } = useIdObjectInfoStore(store => store);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);

	const handleClickOnMarker = async (id: number) => {
		//HELP: Добавляю id маркера в глобальный стор, закрываю фильтры и открываю блок с информацией об объекте
		setIdObjectInfo(id);
		setIsFilters(false);
		setIsObjectInfo(true);
	};

	return handleClickOnMarker;
};
