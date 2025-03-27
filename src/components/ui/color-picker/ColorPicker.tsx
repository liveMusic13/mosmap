import { FC } from 'react';
import { HexColorPicker } from 'react-colorful';

import { IColorPicker } from '@/types/props.types';

import Button from '../button/Button';

import styles from './ColorPicker.module.scss';

const ColorPicker: FC<IColorPicker> = ({
	color,
	onClick,
	handleColorChange,
}) => {
	return (
		<div className={styles.block__colorPicker}>
			<HexColorPicker
				color={color}
				onChange={newColor => handleColorChange(newColor)}
			/>
			<Button onClick={onClick}>Закрыть</Button>
		</div>
	);
};

export default ColorPicker;
