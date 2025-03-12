import Link from 'next/link';
import { FC, memo } from 'react';

import { IInfoZone } from '@/types/props.types';

import styles from './InfoZone.module.scss';

const InfoZone: FC<IInfoZone> = memo(({ value_info }) => {
	return (
		<div className={styles.wrapper_info}>
			<h4 className={styles.title}>{value_info.name}</h4>
			{value_info.href ? (
				<p className={styles.description}>
					<Link href={value_info.href} target='_blank' className={styles.link}>
						{value_info.value}
					</Link>
				</p>
			) : (
				<p className={styles.description}>{value_info.value || 'Нет данных'}</p>
			)}
		</div>
	);
});

export default InfoZone;
