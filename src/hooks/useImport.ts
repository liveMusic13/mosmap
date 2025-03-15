import { useMutation } from '@tanstack/react-query';

import { IImportResponse } from '@/types/requestData.types';

import { useImportResponseStore } from '@/store/store';

import { dataService } from '@/services/data.service';

export const useImport = () => {
	const setImportResponse = useImportResponseStore(
		store => store.setImportResponse,
	);

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
		onSuccess: data => {
			setImportResponse(data.data as IImportResponse);
		},
	});

	return { mutate, data, isPending, isError, isSuccess };
};
