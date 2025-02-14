export interface ICalendarState {
	start: string | null;
	end: string | null;
}

export interface IObjectFieldsState {
	[key: string]: { value: string };
}
