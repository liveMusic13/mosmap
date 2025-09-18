import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

import { ACTUAL_MAP } from '@/app.constants';
import { settingsService } from '@/services/settings.service';

export const useGetDatabaseSettings = () => {
	const searchParams = useSearchParams();
	// const map = searchParams.get('map');
	const map = Cookies.get(ACTUAL_MAP) || null;

	// const query_maps = useQuery({
	// 	queryKey: ['database_settings_maps'],
	// 	queryFn: () => settingsService.maps(map),
	// 	staleTime: 5 * 60 * 1000,
	// 	retry: 1,
	// 	select: data => data.data,
	// });

	// const query_fields = useQuery({
	// 	queryKey: ['database_settings_fields'],
	// 	queryFn: () => settingsService.fields(map),
	// 	staleTime: 5 * 60 * 1000,
	// 	retry: 1,
	// 	select: data => data.data,
	// });

	// const query_lists = useQuery({
	// 	queryKey: ['database_settings_lists'],
	// 	queryFn: () => settingsService.lists(map),
	// 	staleTime: 5 * 60 * 1000,
	// 	retry: 1,
	// 	select: data => data.data,
	// });

	const query_icons = useQuery({
		queryKey: ['database_settings_icons'],
		queryFn: () => settingsService.getIcons(map),
		staleTime: 5 * 60 * 1000,
		retry: 1,
		select: data => data.data,
	});

	return {
		// query_maps,
		// query_fields,
		// query_lists,
		query_icons,
	};
};
