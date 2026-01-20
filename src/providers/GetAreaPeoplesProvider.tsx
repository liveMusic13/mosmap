import {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

import { IMarker } from '@/types/requestData.types';

import { useIdObjectInfoStore, useViewPeopleAreaStore } from '@/store/store';

import { useGetObjectInfo } from '@/hooks/useGetObjectInfo';

export const GetAreaPeoplesContext = createContext<{ areaCoords: number[] }>({
	areaCoords: [],
});

const GetAreaPeoplesProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);

	const { refetch, data, isSuccess, isLoading } = useGetObjectInfo(
		idObjectInfo || 0,
	);

	const [areaCoords, setAreaCords] = useState<number[]>([0, 0]);

	useEffect(() => {
		if (isSuccess) {
			setAreaCords((data as IMarker)?.crd ?? [0, 0]);
		}
	}, [data, isSuccess, idObjectInfo, isViewPeopleArea]);

	return (
		<GetAreaPeoplesContext.Provider value={{ areaCoords: areaCoords }}>
			{children}
		</GetAreaPeoplesContext.Provider>
	);
};

export default GetAreaPeoplesProvider;

export const useGetAreaPeoples = () => useContext(GetAreaPeoplesContext);
