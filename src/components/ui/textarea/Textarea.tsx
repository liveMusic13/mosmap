import { FC } from 'react';

import { ITextarea } from '@/types/props.types';

import styles from './Textarea.module.scss';

const Textarea: FC<ITextarea> = ({
	value,
	onChange = () => {},
	style,
	placeholder,
}) => {
	return (
		<textarea
			value={value}
			onChange={onChange}
			style={style}
			placeholder={placeholder}
			className={styles.textarea}
		/>
	);
};

export default Textarea;
