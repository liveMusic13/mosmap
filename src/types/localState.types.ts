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
