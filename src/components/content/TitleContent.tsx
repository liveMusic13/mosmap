import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { useMapContext } from '@/providers/MapProvider';

import { useGetDataMap } from '@/hooks/useGetDataMap';

import { getQueryString } from '@/utils/url';

import styles from './Content.module.scss';

const TitleContent: FC = () => {
	// const map = Cookies.get(ACTUAL_MAP);
	const searchParams = useSearchParams();
	// const queryString = new URLSearchParams(searchParams.toString()).toString();
	// const map = searchParams.get('map');
	// const map = getMapId(searchParams);
	const { mapId: map, loading } = useMapContext();

	// const map = useMapId();

	// const { mapId: map } = useContext(MapContext);
	const queryString = getQueryString(searchParams, map); // включает map параметр

	// const resultQuery = map ? `?map=${map}${queryString}` : queryString;
	// const searchParams = useSearchParams();

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;

	const { data } = useGetDataMap(queryString, map);
	// const { data } = useGetDataMap(resultQuery);

	// const { data: data_test } = useTest();
	if (loading) {
		return <div>Loading map...</div>;
	}
	return <h1 className={styles.title}>{data?.title}</h1>;
};

export default TitleContent;
