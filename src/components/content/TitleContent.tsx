import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { useGetDataMap } from '@/hooks/useGetDataMap';

import styles from './Content.module.scss';

const TitleContent: FC = () => {
	const searchParams = useSearchParams();
	const queryString = new URLSearchParams(searchParams.toString()).toString();

	const { data } = useGetDataMap(queryString);

	return <h1 className={styles.title}>{data?.title}</h1>;
};

export default TitleContent;
