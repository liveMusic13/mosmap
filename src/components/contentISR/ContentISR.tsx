import { FC } from 'react';

import { IContent } from '@/types/props.types';

import styles from './ContentISR.module.scss';

const ContentISR: FC<IContent> = ({ dataMap }) => {
	return (
		<div className={styles.wrapper_contentISR}>
			<div>
				{dataMap &&
					dataMap?.points?.map((el: any, ind: any) => (
						<p key={ind}>{el.name}</p>
					))}
			</div>
		</div>
	);
};

export default ContentISR;
