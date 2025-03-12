import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useDotInfo = (coords: { lat: number; lng: number }) => {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ['dot-info', JSON.stringify(coords)],
		queryFn: () => mapService.dotInfo(coords),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		enabled: false,
		select: data => data.data,
	});

	return { data, isLoading, isSuccess, refetch };
};
