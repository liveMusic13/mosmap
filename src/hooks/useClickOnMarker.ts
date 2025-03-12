import {
	useDotInfoCoordsStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
	useViewDotInfoStore,
} from '@/store/store';

export const useClickOnMarker = () => {
	const { setIdObjectInfo } = useIdObjectInfoStore(store => store);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const setCoords = useDotInfoCoordsStore(store => store.setCoords);
	const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);

	const handleClickOnMarker = async (id: number) => {
		//HELP: Добавляю id маркера в глобальный стор, закрываю фильтры и открываю блок с информацией об объекте
		setIdObjectInfo(id);
		setIsFilters(false);
		setIsObjectInfo(true);
		//HELP: Cбрасываем состояние видимости, чтобы при клике на маркер, исчезал маркер пустой области
		// setCoords({ lat: 0, lng: 0 });
		setViewDotInfo(false);
	};

	return handleClickOnMarker;
};
