import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetColorInterval = (map: string | number | null) => {
	const { data, error, isSuccess, isStale, isError, isLoading, refetch } =
		useQuery({
			queryKey: ['get_color_interval'],
			queryFn: () => mapService.color_interval(map),
			staleTime: 5 * 60 * 1000,
			retry: 1,
			select: data => data.data,
		});

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
