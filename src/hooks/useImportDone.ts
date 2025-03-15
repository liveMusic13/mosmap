import { useMutation } from '@tanstack/react-query';

import { dataService } from '@/services/data.service';

export const useImportDone = () => {
	const { mutate, data, isPending, isError, isSuccess } = useMutation({
		mutationKey: ['import_done'],
		mutationFn: ({
			map,
			option,
			requestBody,
		}: {
			map: number | string;
			option: { uploadfile: string; separator: string; encoding: string };
			requestBody: { [key: string]: string };
		}) => dataService.import_done(map, option, requestBody),
	});

	return { mutate, data, isPending, isError, isSuccess };
};
