import { IDataFilters, IItemFilter } from '@/types/requestData.types';

export const useSelect = (
	updateUrlParams: (newParams: Record<string, string | null>) => void,
	filter: IDataFilters,
) => {
	// return (el: IItemFilter) => {
	// 	if (updateUrlParams) {
	// 		updateUrlParams({
	// 			[filter.name]: el.item_id.toString(),
	// 		});
	// 	}
	// };
	return (el: IItemFilter | null) => {
		if (el === null) {
			// удаляем параметр из URL
			updateUrlParams({ [filter.name]: null });
		} else {
			// ставим конкретное значение
			updateUrlParams({ [filter.name]: el.item_id.toString() });
		}
	};
};
