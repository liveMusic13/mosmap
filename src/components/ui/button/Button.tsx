import { FC } from 'react';

import { IButton } from '@/types/props.types';

import styles from './Button.module.scss';

const Button: FC<IButton> = ({ onClick, children, style, disabled }) => {
	return (
		<button
			onClick={onClick}
			style={style}
			className={styles.button}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
