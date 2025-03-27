import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetColorMap = (
	map: string | number | null,
	sloi: string,
	mode: string,
	field_id: string,
	intervals: string,
) => {
	const { data, error, isSuccess, isStale, isError, isLoading, refetch } =
		useQuery({
			queryKey: [
				`get_color_map_${map}_${sloi}_${mode}_${field_id}_${intervals}`,
			],
			queryFn: () => mapService.color_map(map, sloi, mode, field_id),
			staleTime: 5 * 60 * 1000,
			retry: 1,
			select: data => data.data,
			enabled: false,
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
