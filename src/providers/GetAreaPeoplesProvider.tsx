import {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

import { IMarker } from '@/types/requestData.types';

import {
	useDotInfoCoordsStore,
	useIdObjectInfoStore,
	useViewPeopleAreaStore,
} from '@/store/store';

import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';

export const GetAreaPeoplesContext = createContext<{
	areaCoords: number[];
	alternativeCoords: number[];
}>({
	areaCoords: [],
	alternativeCoords: [],
});

const GetAreaPeoplesProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const coordsArea = useDotInfoCoordsStore(store => store.coords);

	const { refetch, data, isSuccess, isLoading } = useGetObjectInfo(
		idObjectInfo || 0,
	);

	const [areaCoords, setAreaCords] = useState<number[]>([0, 0]);
	const [alternativeCoords, setAlternativeCoords] = useState<number[]>([0, 0]);

	useEffect(() => {
		if (isSuccess) {
			setAreaCords((data as IMarker)?.crd ?? [0, 0]);
		}
	}, [data, isSuccess, idObjectInfo, isViewPeopleArea]);

	useEffect(() => {
		setAlternativeCoords([coordsArea.lat, coordsArea.lng]);
	}, [coordsArea]);

	return (
		<GetAreaPeoplesContext.Provider
			value={{ areaCoords: areaCoords, alternativeCoords }}
		>
			{children}
		</GetAreaPeoplesContext.Provider>
	);
};

export default GetAreaPeoplesProvider;

// Хук принимает boolean флаг
export const useGetAreaPeoples = (isArea: boolean = false) => {
	const { areaCoords, alternativeCoords } = useContext(GetAreaPeoplesContext);
	// console.log(
	// 	isArea
	// 		? `alternativeCoords : ${alternativeCoords}`
	// 		: `areaCoords ${areaCoords}`,
	// );
	// Возвращаем нужные координаты в зависимости от флага
	return {
		areaCoords: isArea ? alternativeCoords : areaCoords,
	};
};
