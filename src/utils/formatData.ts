import { IFormAuth } from '@/types/data.types';
import { IObjectFieldsState } from '@/types/localState.types';

export const getStateFromDate = (formData: IFormAuth[]) => {
	let result: IObjectFieldsState = {};

	formData.forEach(el => {
		result[el.placeholder] = { value: '' };
	});

	return result;
};

export const convertImportDoneField = (
	targetOptions: { [key: string]: { value: string; type: 'text' | 'list' } },
	fileFieldData: string[],
	dataIdData: string[],
) => {
	const result: { [key: string]: string } = {};

	Object.keys(targetOptions).forEach(key => {
		const selectedOption = targetOptions[key].value;
		const fieldType = targetOptions[key].type;

		//HELP: Выбираем соответствующий массив данных
		const dataArray = key === 'dataId' ? dataIdData : fileFieldData;

		//HELP: Логика для dataIdData: индекс элемента минус 1
		let valueIndex;
		if (key === 'dataId') {
			valueIndex =
				selectedOption === 'Нет' ? -1 : dataArray.indexOf(selectedOption) - 1;
		} else {
			//HELP: Логика для fileFieldData остаётся неизменной
			valueIndex = dataArray.indexOf(selectedOption);
		}

		//HELP: Обрабатываем значения в зависимости от ключа
		if (key === 'ID дома mosmap') {
			result['house_id'] = valueIndex.toString();
		} else if (key === 'Широта') {
			result['lat'] = valueIndex.toString();
		} else if (key === 'Долгота') {
			result['lng'] = valueIndex.toString();
		} else if (key === 'dataId') {
			result['identificator'] = valueIndex.toString();
		} else {
			result[`fill_${fieldType}[${key}]`] = valueIndex.toString();
		}
	});

	console.log(result);
	return result;
};

export const renameKeys = (obj: {
	[key: string]: any;
}): { [key: string]: any } => {
	const keyMap: { [key: string]: string } = {
		'Название карты': 'title',
		'Описание карты': 'descr',
		'Размер значков': 'iconsize',
		'Радиус зоны в метрах для анализа местности:': 'radius',
		'URL карты': 'url',
	};

	return Object.keys(obj).reduce(
		(acc, key) => {
			const newKey = keyMap[key] || key; //HELP: Используем оригинальный ключ, если нет соответствия
			acc[newKey] = obj[key];
			return acc;
		},
		{} as { [key: string]: any },
	);
};
