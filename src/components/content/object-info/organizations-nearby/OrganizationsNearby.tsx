import Image from 'next/image';
import { FC, Fragment, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import { useGetAreaPeoples } from '@/providers/GetAreaPeoplesProvider';

import {
	useIdPeopleAreaStore,
	useViewOrganizationAreaStore,
	useViewPeopleAreaStore,
} from '@/store/store';

import { useGetObjectArea } from '@/hooks/requests/useGetObjectArea';

import Organizations from '../../organizations/Organizations';

import styles from './OrganizationsNearby.module.scss';

const OrganizationsNearby: FC<any> = ({ orgs, isArea }) => {
	const { setIsViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const { idPeopleArea, setIdPeopleArea, setAllIdPeopleArea }: any =
		useIdPeopleAreaStore(store => store);
	const { setIsViewOrganizationArea }: any = useViewOrganizationAreaStore();
	const [openedIds, setOpenedIds] = useState<number[]>([]);

	const { areaCoords } = useGetAreaPeoples(isArea);
	const { isViewPeopleArea }: any = useViewPeopleAreaStore(store => store);
	const { data: data_area } = useGetObjectArea(
		areaCoords[0],
		areaCoords[1],
		isViewPeopleArea,
	);

	const toggleOpen = (id: number) => {
		setOpenedIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
		);
	};

	// useEffect(() => {
	// 	if (orgs) {
	// 		// Собираем все group_id в массив
	// 		const allGroupIds = Object.values(orgs || {})
	// 			.map((el: any) => el?.group_id)
	// 			.filter((id): id is number => id !== undefined && id !== null);

	// 		// Устанавливаем весь массив за один раз
	// 		setAllIdPeopleArea(allGroupIds);
	// 	}
	// }, [orgs]);

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
			{(Object.values(orgs || {}) || []).map((org: any, ind) => {
				const isOpen = openedIds.includes(org.group_id);

				return (
					<Fragment key={org?.group_id || ind}>
						<div
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
							<div
								className={styles.block_name}
								onClick={() => {
									setIdPeopleArea(org?.group_id);
									toggleOpen(org.group_id);
								}}
							>
								<p className={styles.org_name}>{org.group_name}</p>
								<Image
									src={'/images/icons/arrow_viewObject_mobile.svg'}
									alt='arrow'
									width={9}
									height={9}
									style={{
										transform: isOpen ? '' : 'rotate(-90deg)',
									}}
								/>
							</div>
							<p className={styles.org_count}>{org.org.length}</p>
						</div>
						{isOpen && (
							<Organizations
								data_area={data_area}
								group_id={org?.group_id}
								isArea={true}
							/>
						)}
					</Fragment>
				);
			})}
		</div>
	);
};

export default OrganizationsNearby;
