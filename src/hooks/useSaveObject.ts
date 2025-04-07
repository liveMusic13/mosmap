import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { IMarker } from '@/types/requestData.types';

import { useIdObjectInfoStore } from '@/store/store';

import { mapService } from '@/services/map.service';

export const useSaveObject = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map') || '';
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	const { mutate, data, isPending, isError, isSuccess } = useMutation({
		mutationKey: [`save_object_${idObjectInfo}`],
		mutationFn: (marker: IMarker | any) => mapService.save_object(map, marker), //HELP: Ставлю any для пропса маркера, потому что в компоненте MenuObject при удалении координат нужно прокидывать [null, null], а маркер в координатах может иметь только тип координат из leaflet или null и на этом уже завязана логика проверок в других частях кода. Поэтому чтобы не искать везде где что может сломаться и не исправлять во многих местах, поставил здесь any как исключение.
	});

	return { mutate, data, isPending, isError, isSuccess };
};
