import { LatLngExpression } from 'leaflet';

import { IIntervals } from './props.types';

export interface IValuesObjectInfo {
	disabled: number;
	el: string;
	label: string;
	name: string;
	type?: string;
	id?: string;
	value: string | number;
}

export interface IMarker {
	// crd: LatLngExpression | null;
	crd: number[] | null;
	id: number;
	icon: string;
	color: string;
	raion_id: string;
	polygon: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
	name: string;
	name_map: null | string;
	//HELP: Для информации об объекте
	cuts?: number[];
	area?: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
	values?: IValuesObjectInfo[];
}

export interface IDataMap {
	title: string;
	tiles_url: string;
	description: string;
	'all-points': number;
	bounds: string;
	clastering: number;
	canvas_map: number;
	icons_ref: string;
	color_ref: string;
	map: number;
	icons: {
		[key: string]: string;
	};
	colors: {
		[key: string]: string | null;
	};
	icon_sizes: { [key: string]: number[] };
	points: IMarker[];
	zoom_max: number;
	zoom_min: number;
}

export interface IApiResponse<T> {
	status: number;
	data: T;
}

export interface IDeleteAndOtherResponses {
	delete: boolean;
	id: number;
}

export interface IItemFilter {
	item_id: number;
	item_name: string;
}

export interface IDataFilters {
	caption: string;
	id: number;
	items?: IItemFilter[];
	multiple?: number;
	name: string;
	type: string;
	min_value?: string;
	max_value?: string;
}

export interface IRegistrationData {
	login: string;
	password: string;
	email: string;
	mapname: string;
	descr: string;
}

export interface IRestoreData {
	login?: string;
	email?: string;
}

export interface INewpassData {
	password: string;
	token: string;
}

export interface INewpassClientData {
	password: string;
	oldpassword: string;
	map: string | number;
}

export interface IRegistrResponse {
	message: string;
	status: string;
	error?: boolean;
}

export interface IHelpSearchAddress {
	id: string;
	name: string;
	subname?: string;
	coords?: LatLngExpression;
}

export interface IDotInfoData {
	href: string;
	name: string;
	value: string;
}

export interface IImportResponse {
	encoding: string;
	file_field: string[];
	list_field: {
		[key: string]: string;
	};
	separator: string;
	text_field: {
		[key: string]: string;
	};
	uploadfile: string;
}

export interface IExportResponse {
	OK: boolean;
	filename: string;
}

export interface IImportDoneResponse {
	add_rows: number;
	read_rows: number;
	update_rows: number;
}

export interface ISaveSettingsMapResponse {
	autosize: string;
	clastering: string;
	descr: string;
	iconsize: string;
	radius: string;
	save_status: string;
	showanalytic: string;
	showhouses: string;
	tiles_id: string;
	title: string;
	url: string;
	tiles_list: {
		name: string;
		id: string;
	}[];
}

export interface IMapResponse {
	id: number;
	mode: number;
	name: string;
	visible: number;
}

export interface IFieldsResponse {
	id: number;
	address: number;
	name: string;
	namefield: number;
	nameonmap: number;
	type: string;
	type_name: string;
}

export interface IListsResponse {
	id: number;
	mode: number;
	name: string;
	color: number;
	icon: number;
}

export interface IIntervalObject {
	field_id: number;
	min_value: number;
	max_value: number;
	sloi: number;
	type: number;
	values?: IIntervals[];
	//  {
	// 	color: string;
	// 	max: number;
	// 	min: number;
	// }[];
}

export interface IModeListObject {
	field_visible: number;
	interval_visible: number;
	id: number;
	name: string;
}

export interface INumAndSloiFieldsObject {
	id: number;
	name: string;
}

export interface IColorIntervalResponse {
	current_field: number | string;
	current_mode: number | string;
	current_sloi: number | string;
	intervals: IIntervalObject[];
	mode_list: IModeListObject[];
	num_fields: INumAndSloiFieldsObject[];
	sloi_fields: INumAndSloiFieldsObject[];
}

export interface IColorMapResponse {
	color: string;
	id: number;
	name: string;
	polygon: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
}

export interface IListItemsResponse {
	icon_name?: string;
	color?: string;
	id: number;
	name: string;
}

export interface IAllFieldsResponse {
	id: string;
	name: string;
	type: number;
	priority: string | null;
	address?: number;
	namefield?: number;
	nameonmap?: number;
	type_name?: string;
	mode?: number;
	visible?: number;
	color?: number;
	icon?: number;
}

export type TUrl = 'valid' | 'invalid' | 'standard';
