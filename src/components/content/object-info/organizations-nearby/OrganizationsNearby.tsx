import Image from 'next/image';
import { FC } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import {
	useIdPeopleAreaStore,
	useViewOrganizationAreaStore,
	useViewPeopleAreaStore,
} from '@/store/store';

import styles from './OrganizationsNearby.module.scss';

const OrganizationsNearby: FC<any> = ({ orgs }) => {
	const { setIsViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const { idPeopleArea, setIdPeopleArea }: any = useIdPeopleAreaStore(
		store => store,
	);
	const { setIsViewOrganizationArea }: any = useViewOrganizationAreaStore();

	return (
		<div className={styles.wrapper_organizationsNearby}>
			<div className={styles.title_orgs}>
				<h2 className={styles.title}>Организации рядом</h2>
				<Button
					style={{ backgroundColor: 'transparent' }}
					onClick={() => setIsViewPeopleArea(false)}
				>
					<Image
						src='/images/icons/exit.svg'
						alt='exit'
						width={9}
						height={9}
						className={styles.image_title}
					/>
				</Button>
			</div>
			{(Object.values(orgs || {}) || []).map((org: any, ind) => (
				<div
					key={org?.group_id || ind}
					className={`${styles.block__organization} ${ind === 0 ? styles.first_org : ''}`}
					onClick={() => setIsViewOrganizationArea(true)}
				>
					<Checkbox
						value=''
						onChange={() => {
							setIdPeopleArea(org?.group_id);
						}}
						checked={idPeopleArea?.includes(org?.group_id)}
					/>
					<p className={styles.org_name}>{org.group_name}</p>
					<p className={styles.org_count}>{org.org.length}</p>
				</div>
			))}
		</div>
	);
};

export default OrganizationsNearby;
