import Image from 'next/image';
import { FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';

import { IViewObjectInfoProps } from '@/types/props.types';

import {
	// useObjectInfoStore,
	// useViewDotInfoStore,
	useViewObjectAbdAreaInfoStore,
	useViewStore,
} from '@/store/store';

import styles from './ViewObjectInfo.module.scss';

const ViewObjectInfo: FC<IViewObjectInfoProps> = ({ area }) => {
	// const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	// const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);
	const openView = useViewStore(store => store.openView);

	const { setIsViewObjectInfo, setIsViewAreaInfo } =
		useViewObjectAbdAreaInfoStore(store => store);

	const handleClick = useCallback(() => {
		if (area) {
			// setViewDotInfo(true);
			setIsViewAreaInfo(false);
			openView('zoneInfo');
		} else {
			// setIsObjectInfo(true);
			openView('objectInfo');
			setIsViewObjectInfo(false);
		}
	}, []);

	return (
		<div className={styles.block__viewObjectInfo}>
			<span>Просмотр объекта</span>
			<Button onClick={handleClick}>
				<Image
					src={'/images/icons/arrow_viewObject_mobile.svg'}
					alt='arrow'
					width={19}
					height={19}
				/>
			</Button>
		</div>
	);
};

export default ViewObjectInfo;
