// export interface IValues {
// 	disabled: number;
// 	el: string;
// 	label: string;
// 	name: string;
// 	type?: string;
// 	id?: string;
// 	value: string | number;
// }
import { LatLngExpression } from 'leaflet';

export interface IMarker {
	// crd: [number, number] | null;
	crd: LatLngExpression | null;
	id: number;
	icon: string;
	color: string;
	raion_id: string;
	// polygon: number[][];
	polygon: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
	name: string;
	name_map: null | string;
	// values?: IValues[];
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
