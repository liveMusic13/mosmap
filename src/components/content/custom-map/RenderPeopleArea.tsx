import { FC, useEffect, useState } from 'react';
import { CircleMarker, Polygon, Popup } from 'react-leaflet';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';

import {
	useIdObjectInfoStore,
	useIdPeopleAreaStore,
	useViewPeopleAreaStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';

const RenderPeopleArea: FC = () => {
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);

	const { areaCoords } = useGetAreaPeoples();

	const { data: data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		idObjectInfo,
		isViewPeopleArea,
	);
	const { idPeopleArea }: any = useIdPeopleAreaStore(store => store);

	const [markers, setMarkers] = useState<any[]>([]);

	useEffect(() => {
		if (idPeopleArea.length > 0 && data_area?.data?.orgs) {
			idPeopleArea.forEach((id: string) => {
				const orgs = data_area?.data?.orgs[id];
				if (orgs?.org.length > 0) {
					orgs?.org.forEach((org: any) => {
						// Проверяем что организация существует И у неё есть координаты
						if (!org.lat || !org.lng) {
							console.log('Организация без координат:', id, org);
							return;
						}
						setMarkers((prev: any) => [...prev, org]);
					});
				}
			});
		}
	}, [data_area, idPeopleArea]);

	return (
		<>
			{data_area?.data?.area && isViewPeopleArea && (
				<Polygon
					positions={data_area?.data?.area}
					color='red'
					fillOpacity={0.2}
				/>
			)}
			{markers.map((org, ind) => (
				<CircleMarker
					key={ind}
					center={[Number(org.lat), Number(org.lng)]}
					radius={8} // в пикселях
					fillColor='#000'
					color='#fff' // обводка
					weight={2} // толщина обводки
					fillOpacity={0.7}
				>
					<Popup>{org.name ?? 'Нету данных'}</Popup>
				</CircleMarker>
			))}
		</>
	);
};

export default RenderPeopleArea;
