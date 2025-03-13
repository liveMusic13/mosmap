import {
	CSSProperties,
	ChangeEvent,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
} from 'react';

import { IFormAuth } from './data.types';
import { ICalendarState } from './localState.types';
import {
	IDataFilters,
	IDataMap,
	IDotInfoData,
	IItemFilter,
	IMarker,
	IRegistrResponse,
	IValuesObjectInfo,
} from './requestData.types';

export interface IButton extends PropsWithChildren {
	onClick?: () => void;
	style?: CSSProperties;
	disabled?: boolean;
}

export interface ILine {
	style?: CSSProperties;
}

export interface IContent {
	dataMap: IDataMap;
}

export interface IHeader {
	dataMap?: IDataMap;
}

export interface ICustomMap {
	dataMap?: IDataMap;
}

export interface IRenderMarkers {
	dataMap: IDataMap;
}

export interface ICanvasMarkersLayer {
	dataMap: IDataMap;
}

export interface IIconMarker {
	mark: IMarker;
	size: [number, number];
}

export interface IInput {
	type: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	callback?: () => void;
	placeholder?: string;
	styleInput?: CSSProperties;
	styleImage?: CSSProperties;
	widthImage?: number;
	heightImage?: number;
	srcImage?: string;
	style?: CSSProperties;
}

export interface IFilterBlock {
	filter: IDataFilters;
}

export interface IRangeProps {
	min?: number;
	max?: number;
	step?: number;
	values?: { min: number; max: number };
	onChange?: (values: { min: number; max: number }) => void;
	filter?: IDataFilters;
	updateUrlParams?: (newParams: Record<string, string | null>) => void;
}

export interface ICheckbox {
	label?: string;
	value: string;
	checked: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	styleLabel?: CSSProperties;
	styleCheckbox?: CSSProperties;
}

export interface ISelect {
	items: IItemFilter[];
	handleClick: (el: IItemFilter) => void;
	queryName?: string;
	forInfo?: {
		isInfo: boolean;
		value: string;
	};
}

export interface ICustomCalendar {
	callbackDate: (date: ICalendarState) => void;
}

export interface IEntryBlock {
	formData: IFormAuth[];
	title: string;
	title_link: string;
	title_bot: string;
	link_bot: string;
	title_block: string;
	handleCallback?: (data: IRegistrResponse) => void;
	setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

export interface ILayout extends PropsWithChildren {
	style?: CSSProperties;
}

export interface IHeader {
	style?: CSSProperties;
}

export interface IFooter {
	style?: CSSProperties;
}

export interface ITextarea {
	value: string;
	onChange: (
		e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => void;
	style?: CSSProperties;
	placeholder?: string;
}

export interface IPopup {
	message: string;
	isHtmlMessage?: boolean;
	isConfirm?: boolean;
	functions?: {
		onClick?: () => void;
		confirm?: () => void;
		cancel?: () => void;
	};
}

export interface IInfo {
	value_info: IValuesObjectInfo;
}

export interface IInfoEdit extends IInfo {
	callback: (data: { label: string; value: string }) => void;
}

export interface IInfoBlock {
	onCallbackForSelect: (opt: IItemFilter) => void;
	filter: IDataFilters | undefined;
	value: string | number;
}

export interface IInfoZone {
	value_info: IDotInfoData;
}

export interface IContentOptions {
	title: string;
}

export interface IBlockOptions {
	isImport?: boolean;
}

export interface IBlockParam {
	field: string;
	title: string;
	select?: {
		optionsSelect: string[];
		targetValue: string;
	};
	inputValue?: string;
	functions?: {
		select?: (el: IItemFilter) => void;
		input?: (e: ChangeEvent<HTMLInputElement>) => void;
	};
}
