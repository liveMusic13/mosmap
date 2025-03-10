import { IFormAuth } from '@/types/data.types';
import { IObjectFieldsState } from '@/types/localState.types';

export const getStateFromDate = (formData: IFormAuth[]) => {
	let result: IObjectFieldsState = {};

	formData.forEach(el => {
		result[el.placeholder] = { value: '' };
	});

	return result;
};
