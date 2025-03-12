import { LatLngExpression } from 'leaflet';

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
