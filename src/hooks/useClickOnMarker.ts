import {
	useFiltersStore,
	useIdObjectInfoStore,
	useObjectInfoStore,
	useViewDotInfoStore,
	useViewObjectAbdAreaInfoStore,
} from '@/store/store';

import { useCheckWidth } from './useCheckWidth';

export const useClickOnMarker = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const { setIdObjectInfo } = useIdObjectInfoStore(store => store);
	const setIsFilters = useFiltersStore(store => store.setIsFilters);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	const { setIsViewObjectInfo } = useViewObjectAbdAreaInfoStore(store => store);

	const handleClickOnMarker = async (id: number) => {
		//HELP: Добавляю id маркера в глобальный стор, закрываю фильтры и открываю блок с информацией об объекте
		setIdObjectInfo(id);
		//HELP: Cбрасываем состояние видимости, чтобы при клике на маркер, исчезал маркер пустой области
		// setCoords({ lat: 0, lng: 0 });
		setViewDotInfo(false);

		if (isMobile) {
			//HELP: В мобильной версии состояние видимости фильтров и так не нужно, поэтому его оставляем только в пк версии. А состояние самой информации об объекте я буду во всплывающем блоке открывать, который в свою очередь отображу сменой состояния setIsViewObjectAbdAreaInfo(true)
			setIsViewObjectInfo(true);
		} else {
			setIsFilters(false);
			setIsObjectInfo(true);
		}
	};

	return handleClickOnMarker;
};
