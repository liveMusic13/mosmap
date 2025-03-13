import { useQuery } from '@tanstack/react-query';

import { dataService } from '@/services/data.service';

export const useExport = (
	map: number | string,
	dataRequest: {
		separator: string;
		encoding: string;
		uploadfile: string;
		house_id: boolean;
		addCoordinate: boolean;
	},
) => {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ['export'],
		queryFn: () => dataService.export(map, dataRequest),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		enabled: false,
		select: data => data.data,
	});

	return { data, isLoading, isSuccess, refetch };
};
