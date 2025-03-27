import { useMutation } from '@tanstack/react-query';

import { IIntervalObject } from '@/types/requestData.types';

import { mapService } from '@/services/map.service';

export const useSaveColorInterval = () => {
	const { mutate, data, error, isSuccess, isError } = useMutation({
		mutationKey: ['save_color_interval'],
		mutationFn: ({
			map,
			data,
		}: {
			map: string | number | null;
			data: IIntervalObject;
		}) => mapService.color_interval_save(map, data),
		onSuccess: data => data.data,
	});

	return {
		mutate,
		data,
		error,
		isSuccess,
		isError,
	};
};
