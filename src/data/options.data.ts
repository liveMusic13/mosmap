import { IOptionsData } from '@/types/data.types';

export const standardArr: IOptionsData[] = [
	{
		id: 0,
		// src: '',
		src_active: 'database-import',
		hover_text: 'Загрузка данных',
	},
	{
		id: 1,
		// src: '',
		src_active: 'database-export',
		hover_text: 'Выгрузка данных',
	},
	{
		id: 2,
		src: 'filter-off',
		src_active: 'filter',
		hover_text: 'Показать/скрыть фильтры',
	},
	{
		id: 3,
		src: 'clipboard-text-off',
		src_active: 'clipboard-text',
		hover_text: 'Показать/скрыть список объектов',
	},
	{
		id: 4,
		src_active: 'text-box-plus',
		hover_text: 'Добавить объект',
	},
	{
		id: 7,
		src_active: 'palete-outline',
		hover_text: 'Закрасить районы',
	},
];

export const settingsArr: IOptionsData[] = [
	{
		id: 6,
		src_active: 'database-settings',
		hover_text: 'Настройка базы данных',
	},
	{
		id: 5,
		src_active: 'gear',
		hover_text: 'Настройка карты',
	},
];
