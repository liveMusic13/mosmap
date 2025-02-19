import { ChangeEvent, useState } from 'react';

import { IDataFilters, IItemFilter } from '@/types/requestData.types';

export const useCheckbox = (
	filter: IDataFilters,
	updateUrlParams: (newParams: Record<string, string | null>) => void,
) => {
	const searchParams = new URLSearchParams(window.location.search);

	//HELP: Получаем параметры из адресной строки и создаем начальное состояние чекбоксов
	const initialState = (filter.items || []).reduce(
		(acc, el) => {
			acc[el.item_id] = false;
			return acc;
		},
		{} as { [key: string]: boolean },
	);

	//HELP: использую состояние т.к. оно при изменении состояния чекбоксов вызывает перерисовку что позволяет корректно отображать ченкбоксы и добавлять значения в адресную строку.
	const [checkboxState, setCheckboxState] = useState<{
		[key: string]: boolean;
	}>(initialState);

	//HELP: Обработчик изменения чекбокса
	const onChange = (e: ChangeEvent<HTMLInputElement>, el: IItemFilter) => {
		const newChecked = e.target.checked;
		setCheckboxState(prev => ({ ...prev, [el.item_id]: newChecked }));

		// Текущие значения
		const currentValues = searchParams.get(filter.name)?.split(',') || [];
		let updatedValues;

		if (newChecked) {
			updatedValues = [...new Set([...currentValues, String(el.item_id)])];
		} else {
			updatedValues = currentValues.filter(id => id !== String(el.item_id));
		}

		//HELP: Обновляем URL через общую функцию
		updateUrlParams({
			[filter.name]: updatedValues.length > 0 ? updatedValues.join(',') : null,
		});
	};

	const checkValueInUrl = searchParams.get(filter.name)?.split(',');

	return {
		checkboxState,
		onChange,
		checkValueInUrl,
		setCheckboxState,
	};
};
