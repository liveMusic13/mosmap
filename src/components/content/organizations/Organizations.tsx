'use client';

import Image from 'next/image';
import { FC, Fragment } from 'react';

import Button from '@/components/ui/button/Button';

import {
	useCenterMapStore,
	useIdPeopleAreaStore,
	useViewOrganizationAreaStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';

import styles from './Organizations.module.scss';

const titlesTable = [
	{
		id: 0,
		title: 'Название',
	},
	{
		id: 1,
		title: 'Расстояние (м)',
	},
];

const Organizations: FC = () => {
	const { setIsViewOrganizationArea }: any = useViewOrganizationAreaStore();
	const { idPeopleArea, setIdPeopleArea }: any = useIdPeopleAreaStore(
		store => store,
	);
	const centerMap = useCenterMapStore(store => store.centerMap);
	const { data: data_area, isSuccess } = useGetObjectArea(
		(centerMap as any)[0],
		(centerMap as any)[1],
	);

	const organizations: any[] = [];

	if (data_area?.data?.orgs) {
		for (const org of Object.values(data_area.data.orgs)) {
			const hasOrganization = idPeopleArea.includes((org as any).group_id);
			if (hasOrganization) {
				(org as any).org.forEach((elem: any) => {
					organizations.push(elem);
				});
			}
		}
	}

	const handleClick = () => setIsViewOrganizationArea(false);
	return (
		<div className={styles.wrapper_organizations}>
			<Button onClick={handleClick} style={{ backgroundColor: 'transparent' }}>
				<Image
					src={'/images/icons/arrow_viewObject_mobile.svg'}
					alt='arrow'
					width={9}
					height={9}
					className={styles.image_arrow}
				/>
			</Button>
			<div className={styles.table}>
				{titlesTable.map(el => (
					<h2 key={el.id} className={styles.title}>
						{el.title}
					</h2>
				))}
				{organizations.map((org: any, ind) => (
					<Fragment key={ind}>
						<p>{org.name}</p>
						<p>{org.distance}</p>
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default Organizations;
