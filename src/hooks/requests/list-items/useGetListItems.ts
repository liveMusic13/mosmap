import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { settingsService } from '@/services/settings.service';

export const useGetListItems = (
	id: number,
	// editListData: IListItemsResponse[],
	column: string,
) => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	// const itemsString = JSON.stringify(editListData);

	const query = useQuery({
		queryKey: [`list_items_query_${map}_${id}_${column}}`],
		queryFn: () => settingsService.listItems(map, null, id),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		select: data => data.data,
	});

	return query;
};
