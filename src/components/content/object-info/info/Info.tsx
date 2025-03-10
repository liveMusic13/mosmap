import { FC, memo } from 'react';

import { IInfo } from '@/types/props.types';

import styles from './Info.module.scss';

const Info: FC<IInfo> = memo(({ value_info }) => {
	return (
		<div className={styles.wrapper_info}>
			<h4 className={styles.title}>{value_info.label}</h4>
			<p className={styles.description}>{value_info.value || 'Нет данных'}</p>
		</div>
	);
});

export default Info;
