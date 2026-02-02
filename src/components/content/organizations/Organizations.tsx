'use client';

import { FC, Fragment } from 'react';

import { useCenterMapStore, useTargetMarkerInAreaStore } from '@/store/store';

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

const Organizations: FC<{
	group_id: string;
	isArea: boolean;
	data_area: any;
	checked: boolean;
}> = ({ group_id, isArea, data_area, checked }) => {
	if (!data_area) return null;
	const { setMarker: setMarkerArea, triggerPopupOpen } =
		useTargetMarkerInAreaStore(store => store);
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);

	const organizations: any[] = [];

	if (data_area?.data?.orgs) {
		const org = data_area?.data?.orgs.find(
			(el: any) => el.group_id === group_id,
		);

		// const hasOrganization = idPeopleArea.includes((org as any).group_id);
		// if (hasOrganization) {
		org.org.forEach((element: any) => {
			organizations.push(element);
		});
		// }
	}

	return (
		<div className={styles.wrapper_organizations}>
			<div className={styles.table}>
				{titlesTable.map(el => (
					<h2 key={el.id} className={styles.title}>
						{el.title}
					</h2>
				))}
				{organizations.map((org: any, ind) => (
					<Fragment key={`${ind}-${org.name}`}>
						<p
							onClick={() => {
								console.log('[org?.lat, org?.lng]', [org?.lat, org?.lng], org);
								if (org && org.lat && org.lng && checked) {
									setCenterMap([Number(org.lat), Number(org.lng)]);
								}
								setMarkerArea(`${org.name}${org.distance}`);
								triggerPopupOpen(`${org.name}${org.distance}`);
							}}
							className={styles.name}
						>
							{org.name}
						</p>
						<p>{org.distance}</p>
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default Organizations;
