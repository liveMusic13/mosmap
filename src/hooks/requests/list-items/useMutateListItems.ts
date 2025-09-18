import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

import { IListItemsResponse } from '@/types/requestData.types';

import { ACTUAL_MAP } from '@/app.constants';
import { settingsService } from '@/services/settings.service';

export const useMutateListItems = (
	id: number,
	items: IListItemsResponse[],
	column: string,
) => {
	const searchParams = useSearchParams();
	// const map = searchParams.get('map');
	const map = Cookies.get(ACTUAL_MAP) || null;

	const itemsString = JSON.stringify(items);

	const mutate = useMutation({
		mutationKey: [`list_items_mutate_${map}_${id}_${itemsString}_${column}`],
		mutationFn: ({
			map,
			items,
			id,
		}: {
			map: string | null;
			items: IListItemsResponse[] | null;
			id: number;
		}) => settingsService.listItems(map, items, id),
		onSuccess: data => data.data,
	});

	return mutate;
};
