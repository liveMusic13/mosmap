type FieldKey = 'Новый пароль:' | 'Старый пароль:' | 'Подтверждение пароля:';

export const arrFields: { id: number; title: FieldKey }[] = [
	{
		id: 0,
		title: 'Старый пароль:',
	},
	{
		id: 1,
		title: 'Новый пароль:',
	},
	{
		id: 2,
		title: 'Подтверждение пароля:',
	},
];
