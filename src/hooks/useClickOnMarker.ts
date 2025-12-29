import {
	useIdObjectInfoStore,
	useViewObjectAbdAreaInfoStore,
	useViewStore,
} from '@/store/store';

import { useCheckWidth } from './useCheckWidth';

export const useClickOnMarker = () => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const { setIdObjectInfo } = useIdObjectInfoStore(store => store);
	const openView = useViewStore(store => store.openView);
	const closeView = useViewStore(store => store.closeView);

	const { setIsViewObjectInfo } = useViewObjectAbdAreaInfoStore(store => store);

	const handleClickOnMarker = async (id: number) => {
		//HELP: Добавляю id маркера в глобальный стор, закрываю фильтры и открываю блок с информацией об объекте
		setIdObjectInfo(id);
		console.log('сработала функция');

		if (isMobile) {
			closeView();
			//HELP: В мобильной версии состояние видимости фильтров и так не нужно, поэтому его оставляем только в пк версии. А состояние самой информации об объекте я буду во всплывающем блоке открывать, который в свою очередь отображу сменой состояния setIsViewObjectAbdAreaInfo(true)
			setIsViewObjectInfo(true);
			console.log('сработало для мобилки');
		} else {
			openView('objectInfo');
			console.log('сработало условие');
		}
	};

	return handleClickOnMarker;
};
