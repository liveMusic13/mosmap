import {
	CSSProperties,
	ChangeEvent,
	Dispatch,
	MouseEventHandler,
	PropsWithChildren,
	RefObject,
	SetStateAction,
} from 'react';

import { IFormAuth } from './data.types';
import { ICalendarState, IEditableData } from './localState.types';
import {
	IAllFieldsResponse,
	IDataFilters,
	IDataMap,
	IDotInfoData,
	IIntervalObject,
	IItemFilter,
	IListItemsResponse,
	IMarker,
	INumAndSloiFieldsObject,
	IRegistrResponse,
	IValuesObjectInfo,
} from './requestData.types';

export interface IButton extends PropsWithChildren {
	// onClick?: () => void;
	// onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	style?: CSSProperties;
	disabled?: boolean;
	className?: string;
}

export interface ILine {
	style?: CSSProperties;
	className?: string;
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
	disabled?: boolean;
}

export interface IFilterBlock {
	filter: IDataFilters;
}

export interface IRangeProps {
	min?: number;
	max?: number;
	handleMouseDown: (type: 'min' | 'max') => (e: React.MouseEvent) => void;
	handleTouchStart: (type: 'min' | 'max') => (e: React.TouchEvent) => void;
	handleMouseUp: () => void;
	handleTouchMove: (e: TouchEvent) => void;
	handleMouseMove: (e: MouseEvent) => void;
	localValues: { min: number; max: number };
	containerRef: RefObject<HTMLDivElement | null>;
}

export interface ICheckbox {
	label?: string;
	value: string;
	checked: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	styleLabel?: CSSProperties;
	styleCheckbox?: CSSProperties;
}

export interface ICheckboxCircle extends ICheckbox {
	disabled?: boolean;
}

export interface ISelect {
	disabled?: boolean;
	style?: CSSProperties;
	absoluteOptions?: boolean;
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
	mobile_link: string;
	mobile_title: string;
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
	soloButtonText?: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
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
	absoluteOptionsForSelect?: boolean;
}

export interface IRowDatabaseOptions {
	// data: IFieldsResponse | IMapResponse | IListsResponse;
	data: IAllFieldsResponse;
	position: number;
	targetIdObject: number;
	handleDelete?: (id: number) => void;
	editableData?: IEditableData;
	onUpdate: (id: number, field: keyof IEditableData, value: any) => void;
	handleViewSettings: (el: { id: number; name: string }) => void;
}

export interface IBlockIntervalParam {
	title: string;
	options: INumAndSloiFieldsObject[];
	targetValue: string;
	absoluteOptionsForSelect: boolean;
}

export interface IColorPicker {
	color: string;
	onClick: () => void;
	handleColorChange: (color: string) => void;
}

export interface IInputGroup {
	index: number;
	inputValues: {
		min: string;
		max: string;
	}[];
	interval: {
		min: number;
		max: number;
		color?: string;
	};
	disableMin?: boolean;
	disableMax?: boolean;
	handleInputChange: (
		index: number,
		field: 'min' | 'max',
		e: ChangeEvent<HTMLInputElement>,
	) => void;
	handleInputBlurWrapper: (
		index: number,
		field: 'min' | 'max',
		e: React.FocusEvent<HTMLInputElement>,
	) => void;
	setRangeData: Dispatch<SetStateAction<IIntervals[]>>;
	rangeData: IIntervals[];
}

export interface IIntervals {
	min: number;
	max: number;
	color: string;
}

export interface IRangeIntervalProps {
	// intervals: IIntervals[];
	// min_value: number;
	// max_value: number;
	intervalsObject: IIntervalObject | any;
	isViewInputsInterval: boolean;
	isViewFieldSelect: boolean;
	isValidTargetValues: boolean;
}

export interface IUseRangeIntervalLogicProps {
	intervals: IIntervals[];
	min_value: number;
	max_value: number;
}

export interface IUseRangeIntervalLogicReturn {
	rangeData: IIntervals[];
	sliderPositions: number[];
	handleSliderChange: (index: number, newValue: number) => void;
	handleInputBlur: (index: number, field: 'min' | 'max', value: string) => void;
	setRangeData: Dispatch<SetStateAction<IIntervals[]>>;
	handleAddNewInterval: () => void;
}

export interface IViewObjectInfoProps {
	area: boolean;
}

export interface IIconAndColorSettings {
	column: string;
	targetIdObject: number;
	// editableData: IEditableData[];
	closeFunc: () => void;
}

export interface IIconsSettingsProps {
	editListData: IListItemsResponse[];
	onUpdate: (id: number, field: keyof IListItemsResponse, value: any) => void;
	handleDelete: (id: number) => void;
}

export interface IColorSettingsProps extends IIconsSettingsProps {}

export interface IChoiceIconProps {
	handleClose: () => void;
	idListItem: number;
	onUpdate: (id: number, field: keyof IListItemsResponse, value: any) => void;
}
