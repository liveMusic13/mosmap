import { useEffect, useState } from 'react';

import { ISaveSettingsMapResponse } from '@/types/requestData.types';

import { useSaveSettingsMap } from './useSaveSettingsMap';

export const useGetSizeMarker = () => {
	const [size, setSize] = useState<[number, number]>([22, 22]);
	const { data, isSuccess } = useSaveSettingsMap();

	useEffect(() => {
		if (isSuccess && data) {
			const sizeData = (data as ISaveSettingsMapResponse).iconsize;
			const arrSize: [number, number] = [Number(sizeData), Number(sizeData)];

			setSize(arrSize);
		}
	}, [data, isSuccess]);

	return size;
};
