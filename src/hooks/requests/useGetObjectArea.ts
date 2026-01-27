// import { useQuery } from '@tanstack/react-query';
// import { useIdObjectInfoStore, useViewStore } from '@/store/store';
// import { mapService } from '@/services/map.service';
// export const useGetObjectArea = (
// 	lat: number,
// 	lng: number,
// 	isViewPeopleArea: boolean,
// ) => {
// 	const view = useViewStore(store => store.view);
// 	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
// 	return useQuery({
// 		queryKey: [`get_object_area`, lat, lng, idObjectInfo],
// 		queryFn: () => {
// 			if (view === 'objectInfo') {
// 				if (idObjectInfo) mapService.getObjectAreaById(idObjectInfo);
// 				throw Error('Нету id объекта');
// 			}
// 			if (!lat || !lng) throw Error('Нету координат');
// 			return mapService.getObjectArea(lat, lng);
// 		},
// 		enabled: isViewPeopleArea,
// 	});
// };
import { useQuery } from '@tanstack/react-query';

import { useIdObjectInfoStore, useViewStore } from '@/store/store';

import { mapService } from '@/services/map.service';

export const useGetObjectArea = (
	lat: number,
	lng: number,
	isViewPeopleArea: boolean,
) => {
	const view = useViewStore(store => store.view);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	// Определяем, нужно ли использовать ID или координаты
	const useId = view === 'objectInfo' && !!idObjectInfo;
	const useCoords = !useId && lat !== 0 && lng !== 0;

	return useQuery({
		queryKey: [`get_object_area`, useId ? idObjectInfo : null, lat, lng],
		queryFn: () => {
			// Если просматриваем объект с ID - используем запрос по ID
			if (useId) {
				return mapService.getObjectAreaById(idObjectInfo);
			}

			// Если клик по карте - используем координаты
			if (useCoords) {
				return mapService.getObjectArea(lat, lng);
			}

			// Если ни то, ни другое не готово - не выполняем запрос
			throw new Error('Недостаточно данных для запроса');
		},
		// Запрос выполняется только если:
		// 1. Включен просмотр зоны
		// 2. И есть либо ID объекта, либо валидные координаты
		enabled: isViewPeopleArea && (useId || useCoords),
		// Добавьте retry: false чтобы не было множественных попыток при ошибке
		retry: false,
	});
};
