import Image from 'next/image';
import { FC } from 'react';

import { IInput } from '@/types/props.types';

import styles from './Input.module.scss';

const Input: FC<IInput> = ({
	type,
	value,
	onChange,
	placeholder,
	styleInput,
	styleImage,
	widthImage,
	heightImage,
	srcImage,
	style,
	callback,
	disabled,
}) => {
	return (
		<div
			className={`${styles.block__input} ${disabled ? styles.disabled : ''}`}
			style={style}
		>
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				style={styleInput}
				className={styles.input}
				disabled={disabled}
			/>
			{srcImage && (
				<Image
					src={srcImage || ''}
					alt='image'
					width={widthImage}
					height={heightImage}
					style={styleImage}
					className={styles.image}
					onClick={callback}
				/>
			)}
		</div>
	);
};

export default Input;
