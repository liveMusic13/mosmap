import { cookies } from 'next/headers';
import { FC } from 'react';

import ContentMobile from '@/components/content/ContentMobile';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import NotFound from '@/app/not-found/page';
import { mapService } from '@/services/map.service';

export const revalidate = 200;

const MobileFilters: FC = async () => {
	//HELP: Доступ к параметрам search через headers или cookies
	const cookieStore = cookies();
	const mapParam = (await cookieStore).get('map')?.value || null;

	//HELP: Получение данных на сервере
	const { data: dataMap, status } = await mapService.getObjectISR(mapParam);

	if (status > 400) {
		return NotFound(status);
	}
	return (
		<Layout>
			<Header />
			<ContentMobile dataMap={dataMap} />
			<Footer />
		</Layout>
	);
};

export default MobileFilters;
