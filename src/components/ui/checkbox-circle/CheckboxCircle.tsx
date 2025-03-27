import { FC } from 'react';

import { ICheckboxCircle } from '@/types/props.types';

import styles from './CheckboxCircle.module.scss';

const CheckboxCircle: FC<ICheckboxCircle> = ({
	label,
	value,
	onChange,
	styleLabel,
	styleCheckbox,
	checked,
	disabled,
}) => {
	return (
		<label style={styleLabel} className={styles.label}>
			<input
				className={styles.checkbox__input}
				type='checkbox'
				value={value}
				onChange={onChange}
				style={styleCheckbox}
				checked={checked}
				disabled={disabled}
			/>
			<div
				className={`${styles.checkbox__custom} ${disabled ? styles.disabled : ''}`}
			>
				{checked && !disabled && <div className={styles.circle}></div>}
			</div>
			{label}
		</label>
	);
};

export default CheckboxCircle;
