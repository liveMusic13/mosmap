import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetFilters = (mapParam: string | null) => {
	const { data, error, isSuccess, isStale, isError, isLoading } = useQuery({
		queryKey: ['filters', mapParam],
		queryFn: () => mapService.getFiltersISR(mapParam),
		staleTime: 5 * 60 * 1000, // кэширование на 5 минут
		retry: 1,
		refetchOnWindowFocus: false, // отключаем повторные запросы при фокусе
		refetchOnReconnect: true, //повторный запрос при восстановлении сетевого соединения
		select: data => data.data,
	});

	return { data, error, isSuccess, isStale, isError, isLoading };
};
