import { IFormAuth } from '@/types/data.types';

export const arrFormAuth: IFormAuth[] = [
	{
		id: 0,
		type: 'text',
		placeholder: 'Логин',
	},
	{
		id: 1,
		type: 'password',
		placeholder: 'Пароль',
	},
];

export const arrFormRestore: IFormAuth[] = [
	{
		id: 0,
		type: 'text',
		placeholder: 'Логин',
	},
	{
		id: 1,
		type: 'text',
		placeholder: 'Email',
	},
];

export const arrFormNewPass: IFormAuth[] = [
	{
		id: 0,
		type: 'password',
		placeholder: 'Пароль',
	},
	{
		id: 1,
		type: 'password',
		placeholder: 'Подтверждение пароля',
	},
];

export const arrFormRegistr: IFormAuth[] = [
	{
		id: 2,
		type: 'text',
		placeholder: 'Логин',
	},
	{
		id: 3,
		type: 'password',
		placeholder: 'Пароль',
	},
	{
		id: 4,
		type: 'text',
		placeholder: 'Email',
	},
	{
		id: 5,
		type: 'text',
		placeholder: 'Название карты',
	},
	{
		id: 6,
		type: 'text',
		placeholder: 'Описание карты..',
	},
];
