import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { View } from '@/types/store.types';

import { usePopupStore } from '@/store/store';

export const useCheckDirtyDataObject = (
	idObjectInfo: number | null,
	view: View,
	isDirty: boolean,
	setIsDirty: Dispatch<SetStateAction<boolean>>,
	messageSave: string,
) => {
	const { setIsPopup, setMessageInPopup } = usePopupStore(store => store);

	const prevIdRef = useRef(idObjectInfo);
	const prevViewRef = useRef(view);

	useEffect(() => {
		const prevId = prevIdRef.current;
		const prevView = prevViewRef.current;

		// если был переход на другой объект ИЛИ выход из objectInfo
		const idChanged = prevId !== idObjectInfo;
		const viewExited = prevView === 'objectInfo' && view !== 'objectInfo';

		if ((idChanged || viewExited) && isDirty) {
			// показать попап точно так же, как onPopupSave
			setMessageInPopup(messageSave);
			setIsPopup(true);
		} else if (idChanged || viewExited) {
			// если нет грязи — просто сбрасываем флаги
			setIsDirty(false);
		}

		prevIdRef.current = idObjectInfo;
		prevViewRef.current = view;
	}, [idObjectInfo, view, isDirty]);
};
