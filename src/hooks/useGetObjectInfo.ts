import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetObjectInfo = (id: number) => {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ['object-info', id],
		queryFn: () => mapService.getObjectInfo(id),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		enabled: false,
		select: data => data.data,
	});

	return { data, isLoading, isSuccess, refetch };
};
