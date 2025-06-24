import { IDataFilters } from './requestData.types';

export interface IUseRange {
	min?: number;
	max?: number;
	step?: number;
	values?: { min: number; max: number };
	onChange?: (values: { min: number; max: number }) => void;
	filter?: IDataFilters;
	updateUrlParams?: (newParams: Record<string, string | null>) => void;
}
