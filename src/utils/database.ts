import { IEditableData } from '@/types/localState.types';

export const getType = (item: any): string => {
	if ('namefield' in item) return 'field';
	if ('visible' in item) return 'map';
	return 'list';
};

export const getCheckboxField = (columnName: string): keyof IEditableData => {
	switch (columnName) {
		case 'Текст для списка':
			return 'namefield';
		case 'Текст для карты':
			return 'nameonmap';
		case 'Адрес':
			return 'address';
		case 'Множ. выбор':
			return 'mode';
		case 'Иконка':
			return 'icon';
		case 'Цвет':
			return 'color';
		case 'Вкл/Выкл':
			return 'visible';
		default:
			return 'name';
	}
};

export const getDisabledState = (type: string, columnName: string): boolean => {
	switch (columnName) {
		case 'Текст для списка':
		case 'Текст для карты':
		case 'Адрес':
			return type !== 'field'; //HELP: Только для полей
		case 'Множ. выбор':
			return type !== 'list' && type !== 'map'; //HELP: Для списков и карт
		case 'Иконка':
		case 'Цвет':
			return type !== 'list'; //HELP: Только для списков
		case 'Вкл/Выкл':
			return type !== 'map'; //HELP: Только для карт
		case 'Тип':
			return type !== 'field'; //HELP: Только для полей
		default:
			return false;
	}
};
