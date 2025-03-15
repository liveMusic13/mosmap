import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useSaveSettingsMap = () => {
	const { data, isPending, isError, isSuccess } = useQuery({
		queryKey: ['save_settings_map'],
		queryFn: () => mapService.save_settings_map(),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		select: data => data.data,
	});

	return { data, isPending, isError, isSuccess };
};
