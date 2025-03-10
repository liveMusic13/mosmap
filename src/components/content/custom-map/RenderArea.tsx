import { FC } from 'react';
import { Polygon } from 'react-leaflet';

import { useTargetObjectStore, useToggleViewAreaStore } from '@/store/store';

const RenderArea: FC = () => {
	const isViewArea = useToggleViewAreaStore(store => store.isViewArea);
	const marker = useTargetObjectStore(store => store.marker);

	// return dataMap.points
	// 	.filter(el => el.id === idObjectInfo) //HELP:Находим по глобальному id объект в таргете. Из полученного массива благодаря filter, с помощью map рендерим пешеходную зону при включенном режиме и наличии у него координат
	// 	.map(mark => {
	// 		console.log('render area', mark);
	// 		if (mark && mark.area && isViewArea) {
	// 			return (
	// 				<Polygon
	// 					key={mark.id}
	// 					positions={mark.area}
	// 					color='red'
	// 					fillOpacity={0.4}
	// 				/>
	// 			);
	// 		}
	// 	});
	return (
		marker &&
		marker.area &&
		isViewArea && (
			<Polygon positions={marker.area} color='red' fillOpacity={0.4} />
		)
	);
};

export default RenderArea;
