import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import {
	IApiResponse,
	IColorIntervalResponse,
} from '@/types/requestData.types';

import { useSuccessSaveColorsIntervalStore } from '@/store/store';

import { useCheckWidth } from './useCheckWidth';

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

	///
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = Object.fromEntries(searchParams.entries());
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	///

	useEffect(() => {
		console.log('in Hook', isSuccess, data_saveColorInterval);
		if (isSuccess) {
			////
			if (isMobile) {
				const newParam = new URLSearchParams(params).toString();
				console.log(
					'url params',
					params,
					new URLSearchParams(params).toString(),
				);
				router.push(`/?${newParam}`);
			}
			////

			setIsSuccessSaveColorsInterval(true);
			const timeoutId = setTimeout(
				() => setIsSuccessSaveColorsInterval(false),
				3000,
			);

			return () => clearTimeout(timeoutId);
		}
	}, [isSuccess, data_saveColorInterval]);
};
