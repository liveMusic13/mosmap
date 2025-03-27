import { FC, useCallback, useState } from 'react';

import { IInputGroup } from '@/types/props.types';

import Button from '../../button/Button';
import ColorPicker from '../../color-picker/ColorPicker';

import styles from './InputGroup.module.scss';

const InputGroup: FC<IInputGroup> = ({
	handleInputBlurWrapper,
	handleInputChange,
	index,
	inputValues,
	interval,
	disableMin = false,
	disableMax = false,
	setRangeData,
	rangeData,
}) => {
	const [isColorPicker, setIsColorPicker] = useState<boolean>(false);

	const isLastObject = index === rangeData.length - 1;

	const handleColorPicker = () => setIsColorPicker(!isColorPicker);
	const handleCloseColorPicker = () => setIsColorPicker(false);
	const handleColorChange = useCallback((color: string) => {
		setRangeData(prev =>
			prev.map((el, ind) => (index === ind ? { ...el, color: color } : el)),
		);
	}, []);
	const handleDeleteObjectInterval = useCallback(() => {
		setRangeData(prev => prev.filter((el, ind) => ind !== index));
	}, []);

	return (
		<div className={styles['wrapper__input-group']}>
			<span>от</span>
			<input
				type='text'
				value={inputValues[index]?.min || ''}
				onChange={e => handleInputChange(index, 'min', e)}
				onBlur={e => handleInputBlurWrapper(index, 'min', e)}
				readOnly={disableMin}
			/>
			<span>до</span>
			<input
				type='text'
				value={inputValues[index]?.max || ''}
				onChange={e => handleInputChange(index, 'max', e)}
				onBlur={e => handleInputBlurWrapper(index, 'max', e)}
				readOnly={disableMax}
			/>
			<span>-</span>
			<div className={styles['color-placeholder']}>
				<div
					className={styles.color}
					style={{ backgroundColor: interval.color || 'grey' }}
					onClick={handleColorPicker}
				/>
				{isColorPicker && (
					<ColorPicker
						onClick={handleCloseColorPicker}
						color={interval.color || ''}
						handleColorChange={handleColorChange}
					/>
				)}
			</div>

			<Button disabled={isLastObject} onClick={handleDeleteObjectInterval}>
				X
			</Button>
		</div>
	);
};

export default InputGroup;
