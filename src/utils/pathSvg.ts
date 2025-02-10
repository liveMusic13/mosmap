import { IOptionsData } from '@/types/data.types';

export const srcStandard = (
	opt: IOptionsData,
	isListOfObjects: boolean,
	isFilters: boolean,
) => {
	if (opt.id === 2 && !isFilters) {
		return `/images/icons/sprite.svg#${opt.src_active}`;
	} else if (opt.id === 2 && isFilters) {
		return `/images/icons/sprite.svg#${opt.src}`;
	} else if (opt.id === 3 && !isListOfObjects) {
		return `/images/icons/sprite.svg#${opt.src_active}`;
	} else if (opt.id === 3 && isListOfObjects) {
		return `/images/icons/sprite.svg#${opt.src}`;
	} else {
		return `/images/icons/sprite.svg#${opt.src_active}`;
	}
};
