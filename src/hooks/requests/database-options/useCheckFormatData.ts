import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';

import { IEditableData } from '@/types/localState.types';
import { IAllFieldsResponse } from '@/types/requestData.types';

import { getNullObjectForType } from '@/utils/database';

interface UseCheckFormatDataArgs {
	editableData: IEditableData[];
	cacheFullDataRef: RefObject<IEditableData[]>; // Тот же тип, что и editableData
	targetIdObject: number | null;
	setEditableData: Dispatch<SetStateAction<IEditableData[]>>;
	setMapFullData: Dispatch<SetStateAction<IAllFieldsResponse[]>>;
}

export const useCheckFormatData = ({
	editableData,
	cacheFullDataRef,
	targetIdObject,
	setEditableData,
	setMapFullData,
}: UseCheckFormatDataArgs) => {
	// 1) Инициализируем кэш один раз (или при загрузке начальных данных),
	//    а не при каждом изменении editableData:
	useEffect(() => {
		if (cacheFullDataRef.current.length === 0) {
			cacheFullDataRef.current = editableData;
		}
	}, [editableData, cacheFullDataRef]);

	// 2) Срабатываем, когда пользователь кликнул на объект (изменился targetIdObject)
	//    **и** при фактическом изменении поля type у этого объекта
	useEffect(() => {
		if (targetIdObject === null) return;

		// Находим старый и новый элементы по id
		const prevItem = cacheFullDataRef.current.find(
			el => el.id === targetIdObject,
		);
		const currItem = editableData.find(el => el.id === targetIdObject);
		console.log('editableData', editableData);
		// Если у элемента изменился именно type — обнуляем его поля
		if (prevItem && currItem && prevItem.type !== currItem.type) {
			setEditableData(prev =>
				prev.map(el =>
					el.id === targetIdObject ? getNullObjectForType(currItem.type) : el,
				),
			);
			setMapFullData(prev =>
				prev.map(el =>
					Number(el.id) === targetIdObject
						? getNullObjectForType(currItem.type)
						: el,
				),
			);
		}

		// Обновляем кэш для следующего раза
		cacheFullDataRef.current = editableData;
	}, [targetIdObject, editableData, cacheFullDataRef, setEditableData]);
};
