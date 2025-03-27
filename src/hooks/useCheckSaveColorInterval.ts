import { AxiosError } from 'axios';
import { useEffect } from 'react';

import {
	IApiResponse,
	IColorIntervalResponse,
} from '@/types/requestData.types';

import { useSuccessSaveColorsIntervalStore } from '@/store/store';

export const useCheckSaveColorInterval = (
	isSuccess: boolean,
	data_saveColorInterval:
		| IApiResponse<
				| Error
				| IColorIntervalResponse
				| AxiosError<{ message?: string | undefined }, any>
		  >
		| undefined,
) => {
	const setIsSuccessSaveColorsInterval = useSuccessSaveColorsIntervalStore(
		store => store.setIsSuccessSaveColorsInterval,
	);

	useEffect(() => {
		if (isSuccess) {
			setIsSuccessSaveColorsInterval(true);
			const timeoutId = setTimeout(
				() => setIsSuccessSaveColorsInterval(false),
				3000,
			);

			return () => clearTimeout(timeoutId);
		}
	}, [isSuccess, data_saveColorInterval]);
};
