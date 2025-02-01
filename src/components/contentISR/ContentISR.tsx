import { FC } from 'react';

import { IContent } from '@/types/props.types';

import styles from './ContentISR.module.scss';

const ContentISR: FC<IContent> = ({ dataMap }) => {
	return (
		<div className={styles.wrapper_contentISR}>
			<div>
				{dataMap.points.map((el: any, ind: any) => (
					<p key={ind}>
						{el.name} <span>{el.color}</span>
					</p>
				))}
			</div>
		</div>
	);
};

export default ContentISR;
