'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';

const DynamicContent = dynamic(() => import('@/components/content/Content'), {
	ssr: false,
	loading: () => null,
});

const ClientWrapper: FC<any> = ({ dataMap }) => {
	return <DynamicContent dataMap={dataMap} />;
};

export default ClientWrapper;
