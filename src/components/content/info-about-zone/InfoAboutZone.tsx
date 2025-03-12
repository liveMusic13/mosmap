import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IDotInfoData } from '@/types/requestData.types';

import {
	useActiveAddObjectStore,
	useDotInfoCoordsStore,
	useViewDotInfoStore,
} from '@/store/store';

import { useDotInfo } from '@/hooks/useDotInfo';

import styles from './InfoAboutZone.module.scss';
import InfoZone from './info-zone/InfoZone';
import { TOKEN, colors } from '@/app.constants';

const InfoAboutZone: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const token = Cookies.get(TOKEN);

	const coords = useDotInfoCoordsStore(store => store.coords);
	const setIsActiveAddObject = useActiveAddObjectStore(
		store => store.setIsActiveAddObject,
	);
	const setViewDotInfo = useViewDotInfoStore(store => store.setViewDotInfo);

	const { data, isSuccess, isLoading } = useDotInfo(coords);

	const handleClose = () => setViewDotInfo(false);
	const handleActiveAddObject = () => {
		if (map && token) {
			setIsActiveAddObject(true);
		} else {
			router.push('/registr');
		}
	};

	return (
		<div className={styles.wrapper__infoAboutZone}>
			<div className={styles.block__objectInfo}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>Просмотр объекта</h2>
					<Button
						style={{
							backgroundColor: 'transparent',
							color: colors.green,
							display: 'flex',
							alignItems: 'center',
						}}
						onClick={handleClose}
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
			</div>
			<div className={styles.block__info}>
				{isLoading && (
					<Loader
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
				{isSuccess &&
					data &&
					(data as IDotInfoData[]).map((el, ind) => (
						<InfoZone key={ind} value_info={el} />
					))}
			</div>
			<div className={styles.block__buttons}>
				<Button onClick={handleActiveAddObject}>Добавить объект</Button>
			</div>
		</div>
	);
};

export default InfoAboutZone;
