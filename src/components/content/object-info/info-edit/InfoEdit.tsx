import { ChangeEvent, FC } from 'react';

import { IInfoEdit } from '@/types/props.types';

import styles from './InfoEdit.module.scss';

const InfoEdit: FC<IInfoEdit> = ({ value_info, callback }) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		callback({ label: value_info.label, value: e.target.value });
	};

	return (
		<div className={styles.wrapper_infoEdit}>
			<h4 className={styles.title}>{value_info.label}</h4>
			<input
				type='text'
				className={styles.description}
				value={value_info.value || ''}
				onChange={onChange}
			/>
		</div>
	);
};

export default InfoEdit;
