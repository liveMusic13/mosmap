import { useMutation } from '@tanstack/react-query';

import { mapService } from '@/services/map.service';

export const useDeleteObject = () => {
	const { mutate, data, isPending, isError, isSuccess } = useMutation({
		mutationKey: ['delete_object'],
		mutationFn: (id: number | null) => mapService.delete_object(id),
	});

	return { mutate, data, isPending, isError, isSuccess };
};
