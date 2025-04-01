import { FC } from 'react';

import { ILine } from '@/types/props.types';

import styles from './Line.module.scss';

const Line: FC<ILine> = ({ style, className }) => {
	return (
		<div
			className={
				className ? `${styles.line} ${styles[className]}` : `${styles.line}`
			}
			style={style}
		></div>
	);
};

export default Line;
