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
	id: number;
	name?: string;
	namefield?: number;
	nameonmap?: number;
	address?: number;
	mode?: number;
	color?: number;
	icon?: number;
	visible?: number;
	type?: string;
	type_object: string;
}
