'use client';

import Image from 'next/image';
import { FC, memo } from 'react';

import { ICheckbox } from '@/types/props.types';

import styles from './Checkbox.module.scss';

const Checkbox: FC<ICheckbox> = memo(
	({ label, value, onChange, styleLabel, styleCheckbox, checked }) => {
		return (
			<label style={styleLabel} className={styles.label}>
				<input
					className={styles.checkbox__input}
					type='checkbox'
					value={value}
					onChange={onChange}
					style={styleCheckbox}
					checked={checked}
				/>
				<div
					className={`${styles.checkbox__custom} ${checked ? styles.active : ''}`}
				>
					{checked && (
						<Image
							src='/images/icons/checkbox.svg'
							alt='checkbox'
							width={11}
							height={8}
							className={styles.checkbox__img}
						/>
					)}
				</div>
				{label}
			</label>
		);
	},
);

export default Checkbox;
