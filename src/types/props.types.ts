import { CSSProperties, ChangeEvent, PropsWithChildren } from 'react';

import { IDataMap, IMarker } from './requestData.types';

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

export interface ICustomMap {
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
	placeholder?: string;
	styleInput?: CSSProperties;
	styleImage?: CSSProperties;
	widthImage?: number;
	heightImage?: number;
	srcImage?: string;
	style?: CSSProperties;
}
