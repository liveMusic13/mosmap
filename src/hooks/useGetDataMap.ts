import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetDataMap = (mapParam: string) => {
	const { data, error, isSuccess, isStale, isError, isLoading } = useQuery({
		queryKey: ['data_map'],
		queryFn: () => mapService.getObjectISR(mapParam),
		staleTime: 5 * 60 * 1000, //HELP: кэширование на 5 минут
		retry: 1,
		refetchOnWindowFocus: false, //HELP: отключаем повторные запросы при фокусе
		refetchOnReconnect: true, //HELP: повторный запрос при восстановлении сетевого соединения
		select: data => data.data,
	});

	return { data, error, isSuccess, isStale, isError, isLoading };
};
