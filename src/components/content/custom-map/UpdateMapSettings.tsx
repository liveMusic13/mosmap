import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { IDataMap } from '@/types/requestData.types';

// 🔹 Компонент для обновления zoom/bounds при изменении data
const UpdateMapSettings: FC<{ data?: IDataMap }> = ({ data }) => {
	const map = useMap();

	useEffect(() => {
		if (!map || !data) return;

		if (data.zoom_min) map.setMinZoom(data.zoom_min);
		if (data.zoom_max) map.setMaxZoom(data.zoom_max);

		if (data.bounds && data.bounds !== '[[null, null], [null, null]]') {
			map.setMaxBounds(JSON.parse(data.bounds));
		}
	}, [map, data]);

	return null;
};

export default UpdateMapSettings;
