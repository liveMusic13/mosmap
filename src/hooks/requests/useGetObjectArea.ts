import { useQuery } from '@tanstack/react-query';

import { useViewStore } from '@/store/store';

import { mapService } from '@/services/map.service';

export const useGetObjectArea = (lat: number, lng: number) => {
	const view = useViewStore(store => store.view);

	return useQuery({
		queryKey: ['get_object_area'],
		queryFn: () => mapService.getObjectArea(lat, lng),
		enabled: view === 'objectInfo' || view === 'addObject',
	});
};
