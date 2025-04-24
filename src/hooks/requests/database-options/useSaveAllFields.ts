import { useMutation } from '@tanstack/react-query';

import { IAllFieldsResponse } from '@/types/requestData.types';

import { settingsService } from '@/services/settings.service';

export const useSaveAllFields = () => {
	return useMutation({
		mutationKey: [`save_all_fields`],
		mutationFn: (data: IAllFieldsResponse[]) =>
			settingsService.saveAllFields(data),
		onSuccess: data => data.data,
	});
};
