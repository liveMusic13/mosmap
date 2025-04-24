export interface ICalendarState {
	start: string | null;
	end: string | null;
}

export interface IObjectFieldsState {
	[key: string]: { value: string };
}

export interface IPopupErrorInConfirmPage {
	isPopup: boolean;
	message: string;
	status?: string;
	error?: boolean;
}

export interface IExportCheckboxData {
	id: number;
	name: string;
	isCheck: boolean;
}

export interface IEditableData {
	id: number | any; // TODO: Убрать потом тип строки
	name: string;
	namefield?: number;
	nameonmap?: number;
	address?: number;
	mode?: number;
	color?: number;
	icon?: number;
	visible?: number;
	type: number;
	type_object: string;
	priority: string | null;
}
