import { useMutation } from '@tanstack/react-query';

import { ISaveSettingsMapResponse } from '@/types/requestData.types';

import { settingsService } from '@/services/settings.service';

export const useSaveEditingDataSettingsMap = () => {
	const { mutate, data, isPending, isError, isSuccess, mutateAsync } =
		useMutation({
			mutationKey: ['save_editing_data_settings_map'],
			mutationFn: ({
				map,
				data,
			}: {
				map: number | string | null;
				data: ISaveSettingsMapResponse;
			}) => settingsService.saveEditingDataSettingsMap(map, data),
		});

	return { mutate, data, isPending, isError, isSuccess, mutateAsync };
};
