import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useMapContext } from '@/providers/MapProvider';

import { useCenterMapStore } from '@/store/store';

import { getQueryString } from '@/utils/url';

import { useGetDataMap } from './useGetDataMap';

export const useSaveUpdateAfterRemoveMarker = (isSuccess_save: boolean) => {
	const searchParams = useSearchParams();
	const { mapId: map, loading } = useMapContext();

	// //HELP: Преобразование searchParams в строку
	const queryString = getQueryString(searchParams, map); // включает map параметр

	const { refetch: refetch_getDataMap } = useGetDataMap(queryString, map);

	const setCenterMap = useCenterMapStore(store => store.setCenterMap);

	useEffect(() => {
		//HELP: При удачном сохранении обновить данные
		if (isSuccess_save) {
			refetch_getDataMap();

			const timeoutId = setTimeout(() => {
				setCenterMap([55.7522, 37.6156]); //TODO: Почему-то центр перемещается в случайное место на карте после обновления данных о маркерах в refetch_getDataMap. Поэтому это временное решение пока не найду в чем проблема. Скорее всего проблема в том, что возвращается null в координатах, а т.к. объект в таргете то устанавливается null и карту кидает в рандомное место.
			}, 700);
			return () => clearTimeout(timeoutId);
		}
	}, [isSuccess_save]);
};
