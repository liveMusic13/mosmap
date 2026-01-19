import { useQuery } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useGetObjectArea = (
	lat: number,
	lng: number,
	idObjectInfo: number | null,
	isViewPeopleArea: boolean,
) => {
	// console.log(`get_object_area_${idObjectInfo}_${isViewPeopleArea}`, lat, lng);
	return useQuery({
		queryKey: [`get_object_area_${idObjectInfo}_${isViewPeopleArea}`],
		queryFn: () => mapService.getObjectArea(lat, lng),
		enabled: isViewPeopleArea,
	});
};
