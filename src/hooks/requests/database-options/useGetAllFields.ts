import { useQuery } from '@tanstack/react-query';

import { settingsService } from '@/services/settings.service';

export const useGetAllFields = () => {
	return useQuery({
		queryKey: [`get_all_fields`],
		queryFn: () => settingsService.getAllFields(),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		select: data => data.data,
	});
};
