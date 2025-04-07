import { notFound } from 'next/navigation';

import Export from '@/components/screens/export/Export';
import Import from '@/components/screens/import/Import';

// export default function DynamicPage({ params }: { params: { slug: string } }) {
export default async function DynamicPage({ params }: any) {
	const { slug } = await params;

	if (slug === 'export') {
		return <Export />;
	}

	if (slug === 'import') {
		return <Import />;
	}

	//HELP: Редирект на страницу 404
	return notFound();
}
