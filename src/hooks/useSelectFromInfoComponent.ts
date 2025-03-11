import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IDataFilters, IItemFilter, IMarker } from '@/types/requestData.types';

import { useIdObjectInfoStore } from '@/store/store';

import { useGetObjectInfo } from './useGetObjectInfo';

export const useSelectFromInfoComponent = (
	setEditValuesObject: Dispatch<SetStateAction<IMarker | null>>,
	dataFilters: IDataFilters[] | undefined,
) => {
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	const { data, isSuccess } = useGetObjectInfo(idObjectInfo || 0);

	const [formState, setFormState] = useState<{
		[key: string]: IItemFilter | undefined;
	}>({}); //HELP: Здесь хранится состояние селектов

	useEffect(() => {
		if (isSuccess && data) {
			// console.log('step zero', (data as IMarker).values);

			(data as IMarker)?.values?.forEach(field => {
				//HELP: Проходимся циклом по полям информации об объектах
				// console.log('step one. foreach', field);

				if (field.el === 'select') {
					//HELP: Нас интересуют только селекты
					const filter = dataFilters?.find(
						filter => filter.name === field.name,
					); //HELP: Находим в данных из запроса по фильтрам нужный нам объект фильтров для получения всех вариантов выбора значений для селекта

					// console.log('step two filter', filter);

					if (filter) {
						//HELP: Если есть то закидываем их в переменную
						const options = filter.items;
						const value = options?.find(
							option => option.item_name === field.value,
						); //HELP: Ищем среди существующих опций определенного селекта, существует установленно ли уже какое значение
						console.log('step three. value', value);
						setFormState((prev: any) => ({
							...prev,
							[field.name]: value,
						})); //HELP: После устанавливаем это значение определенном селекту в состоянии всех селектов
						// console.log('result', { [field.name]: [value] });
					}
				}
			});
		}
	}, [idObjectInfo, isSuccess, data]); //HELP: Срабатывает по изменению id таргета объекта (т.е. при переключении объектов) и по выполнению запроса о получении информации об объекте

	useEffect(() => {
		//HELP: Здесь при изменении состояния со значением селектов добавляются новые значения в состояние которое потом уходит в запрос на сохранение
		setEditValuesObject(prev =>
			prev
				? {
						...prev,
						values:
							prev.values?.map(opt =>
								opt.el === 'select'
									? { ...opt, value: formState[opt.name]?.item_name || '' }
									: opt,
							) || [],
						crd: prev.crd ?? null,
					}
				: null,
		);
	}, [formState]);

	return { setFormState };
};
