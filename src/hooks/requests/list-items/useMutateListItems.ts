import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { IListItemsResponse } from '@/types/requestData.types';

import { settingsService } from '@/services/settings.service';

export const useMutateListItems = (
	id: number,
	items: IListItemsResponse[],
	column: string,
) => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
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
