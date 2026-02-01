import { FC, useMemo } from 'react';
import { CircleMarker, Polygon, Popup } from 'react-leaflet';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';

import {
	useIdPeopleAreaStore,
	useTargetMarkerInAreaStore,
	useViewPeopleAreaStore,
	useViewStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';

import { colors } from '@/app.constants';

const RenderPeopleArea: FC = () => {
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const { marker, setMarker: setMarkerArea } = useTargetMarkerInAreaStore(
		store => store,
	);
	const view = useViewStore(store => store.view);

	const { areaCoords } = useGetAreaPeoples(view === 'zoneInfo');

	const { data: data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		isViewPeopleArea,
	);
	const { idPeopleArea }: any = useIdPeopleAreaStore(store => store);

	// Вычисляем маркеры через useMemo - они будут пересчитываться
	// только при изменении зависимостей
	const markers = useMemo(() => {
		if (
			!isViewPeopleArea ||
			idPeopleArea.length === 0 ||
			!data_area?.data?.orgs
		) {
			return [];
		}

		const newMarkers: any[] = [];

		idPeopleArea.forEach((id: string) => {
			const orgs = data_area?.data?.orgs.find((el: any) => el.group_id === id);

			if (orgs?.org?.length > 0) {
				orgs.org.forEach((org: any) => {
					if (org.lat && org.lng) {
						newMarkers.push(org);
					} else {
						console.log('Организация без координат:', id, org);
					}
				});
			}
		});

		return newMarkers;
	}, [data_area, idPeopleArea, isViewPeopleArea]);

	return (
		<>
			{data_area?.data?.area && isViewPeopleArea && (
				<Polygon
					positions={data_area?.data?.area}
					color='red'
					fillOpacity={0.2}
					interactive={false}
				/>
			)}
			{isViewPeopleArea &&
				markers.map((org, ind) => {
					const markerId = `${org.name}${org.distance}`;
					const isSelected = marker === markerId;
					return (
						<CircleMarker
							key={`${markerId}-${ind}-${isSelected}`}
							center={[Number(org.lat), Number(org.lng)]}
							radius={10}
							fillColor={
								marker === `${org.name}${org.distance}` ? colors.green : '#000'
							}
							color='#fff'
							weight={6}
							fillOpacity={0.7}
							eventHandlers={{
								click: e => {
									const L = (window as any).L;
									if (L && L.DomEvent) {
										L.DomEvent.stopPropagation(e);
									}
									setMarkerArea(`${org.name}${org.distance}`);
								},
							}}
						>
							<Popup>
								{org.name || org.distance ? (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											fontSize: '1.3rem !important',
										}}
									>
										<div>{org.name}</div>
										<div className='text-sm text-gray-600'>
											Расстояние {org.distance} м.
										</div>
									</div>
								) : (
									'Нету данных'
								)}
							</Popup>
						</CircleMarker>
					);
				})}
		</>
	);
};

export default RenderPeopleArea;
