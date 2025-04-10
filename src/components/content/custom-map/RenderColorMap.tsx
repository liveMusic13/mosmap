import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Polygon } from 'react-leaflet';

import { IColorMapResponse } from '@/types/requestData.types';

import {
	useColorsIntervalStore,
	useSuccessSaveColorsIntervalStore,
} from '@/store/store';

import { useGetColorMap } from '@/hooks/useGetColorMap';

//TODO: Я сделал чтобы при переходе на главную колор мап отправлялся, теперь осталось придумать как будет отображаться. Т.к. в пк версии логика в том что пока активно окно закраски, отображается закраска районов, а при закрытии окна выключается. А на мобильной версии у меня отображается на отдельной странице окно закраски, поэтому надо придумать логику для мобильной версии по которой будет отображаться закраска районов

const RenderColorMap: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const sloiValue = searchParams.get('Слой карты');
	const modeValue = searchParams.get('Способ раскраски');
	const numFieldValue = searchParams.get('Числовое поле');

	const [queryParams, setQueryParams] = useState({
		sloi: sloiValue || '',
		mode: modeValue || '',
		field_id: numFieldValue || '',
	});

	const { isSuccessSaveColorsInterval, ranges_color_map } =
		useSuccessSaveColorsIntervalStore(store => store);
	const { isColorInterval, isColorIntervalMobile } = useColorsIntervalStore(
		store => store,
	);

	useEffect(() => {
		if (sloiValue && modeValue && numFieldValue) {
			setQueryParams({
				sloi: sloiValue,
				mode: modeValue,
				field_id: numFieldValue,
			});
		}
	}, []);

	useEffect(() => {
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
		(isColorInterval || isColorIntervalMobile) &&
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
