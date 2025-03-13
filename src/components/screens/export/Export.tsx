import { FC } from 'react';

import ContentOptions from '@/components/content-options/ContentOptions';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

const Export: FC = () => {
	return (
		<Layout>
			<Header />
			<ContentOptions title='Выгрузка данных' />
			<Footer />
		</Layout>
	);
};

export default Export;
