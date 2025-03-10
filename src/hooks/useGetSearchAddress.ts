import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetSearchAddress = (query: string) => {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ['search-address', query],
		queryFn: () => mapService.getHelpSearchAddress(query),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		enabled: false,
		select: data => data.data,
	});

	return { data, isLoading, isSuccess, refetch };
};
