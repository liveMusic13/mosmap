import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Polygon } from 'react-leaflet';

import { IColorMapResponse } from '@/types/requestData.types';

import {
	useColorsIntervalStore,
	useSuccessSaveColorsIntervalStore,
} from '@/store/store';

import { useGetColorMap } from '@/hooks/useGetColorMap';

const RenderColorMap: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const [queryParams, setQueryParams] = useState({
		sloi: '',
		mode: '',
		field_id: '',
	});

	const { isSuccessSaveColorsInterval, ranges_color_map } =
		useSuccessSaveColorsIntervalStore(store => store);
	const isColorInterval = useColorsIntervalStore(
		store => store.isColorInterval,
	);

	useEffect(() => {
		const sloiValue = searchParams.get('Слой карты');
		const modeValue = searchParams.get('Способ раскраски');
		const numFieldValue = searchParams.get('Числовое поле');
		if (sloiValue && modeValue && numFieldValue) {
			setQueryParams({
				sloi: sloiValue,
				mode: modeValue,
				field_id: numFieldValue,
			});
		}
	}, []);

	useEffect(() => {
		console.log('isSuccessSaveColorsInterval', isSuccessSaveColorsInterval);
		if (isSuccessSaveColorsInterval) {
			refetch();
		}
	}, [isSuccessSaveColorsInterval]);

	const { isSuccess, data, refetch } = useGetColorMap(
		map,
		queryParams.sloi,
		queryParams.mode,
		queryParams.field_id,
		ranges_color_map,
	);

	return (
		isColorInterval &&
		isSuccess &&
		(data as IColorMapResponse[]).length > 0 &&
		(data as IColorMapResponse[]).map((el, ind) => (
			<Polygon
				key={ind}
				positions={el.polygon}
				color={el.color}
				fillOpacity={0.4}
			/>
		))
	);
};

export default RenderColorMap;
