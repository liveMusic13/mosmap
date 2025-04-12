import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { settingsService } from '@/services/settings.service';

export const useListItems = (
	id: number,
	items: { id: number; name: string }[],
) => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const itemsString = JSON.stringify(items);

	const mutate = useMutation({
		mutationKey: [`list_items_mutate_${id}_${itemsString}`],
		mutationFn: ({
			map,
			items,
			id,
		}: {
			map: string | null;
			items: { id: number; name: string }[] | null;
			id: number;
		}) => settingsService.listItems(map, items, id),
		onSuccess: data => data.data,
	});

	const query = useQuery({
		queryKey: [`list_items_query_${id}`],
		queryFn: () => settingsService.listItems(map, null, id),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		enabled: false,
		select: data => data.data,
	});

	return {
		mutate,
		query,
	};
};
