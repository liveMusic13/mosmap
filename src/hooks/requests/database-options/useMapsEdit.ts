import { useMutation } from '@tanstack/react-query';

import { IEditableData } from '@/types/localState.types';

import { settingsService } from '@/services/settings.service';

export const useMapsEdit = (map: string | null, data: IEditableData[]) => {
	const dataString = JSON.stringify(data);
	return useMutation({
		mutationKey: [`list_items_mutate_${map}_${dataString}`],
		mutationFn: ({
			map,
			data,
		}: {
			map: string | null;
			data: IEditableData[] | null;
		}) => settingsService.maps_edit(map, data),
		onSuccess: data => data.data,
	});
};
