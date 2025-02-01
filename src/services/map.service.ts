import { IDataMap } from '@/types/requestData.types';

import { $axios } from '@/api';

export const mapService = {
	getObjectISR: async (mapParam: string): Promise<{ data: IDataMap }> =>
		await $axios.get(`/api/get_objects.php?map=${mapParam}`),
	getFiltersISR: async (mapParam: string) =>
		await $axios.get(`/api/filters.php?map=${mapParam}`),
};
