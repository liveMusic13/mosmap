import { useMutation } from '@tanstack/react-query';

import { dataService } from '@/services/data.service';

export const useImport = () => {
	const { mutate, data, isPending, isError, isSuccess } = useMutation({
		mutationKey: ['import'],
		mutationFn: ({
			map,
			file,
			separator,
			encoding,
		}: {
			map: number | string;
			file: File;
			separator: string;
			encoding: string;
		}) => dataService.import(map, file, separator, encoding),
	});

	return { mutate, data, isPending, isError, isSuccess };
};
