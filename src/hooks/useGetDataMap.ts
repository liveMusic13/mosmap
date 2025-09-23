import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetDataMap = (
	queryParams: string | null,
	map?: string | null,
) => {
	const { data, error, isSuccess, isStale, isError, isLoading, refetch } =
		useQuery({
			queryKey: ['data_map', map],
			queryFn: () => mapService.getObjectWithFilters(queryParams),
			staleTime: 5 * 60 * 1000,
			retry: 1,
			select: data => data.data,
		});

	console.log('in hook data', queryParams, map);

	return {
		data,
		error,
		isSuccess,
		isStale,
		isError,
		isLoading,
		refetch,
	};
};
