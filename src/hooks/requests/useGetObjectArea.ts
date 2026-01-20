import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetObjectArea = (
	lat: number,
	lng: number,
	isViewPeopleArea: boolean,
) => {
	return useQuery({
		queryKey: [`get_object_area`, lat, lng],
		queryFn: () => mapService.getObjectArea(lat, lng),
		enabled: isViewPeopleArea,
	});
};
