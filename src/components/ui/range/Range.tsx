import { FC, useEffect } from 'react';

import { IRangeProps } from '@/types/props.types';

import { useRange } from '@/hooks/useRange';

import styles from './Range.module.scss';

const Range: FC<IRangeProps> = ({
	min = 0,
	max = 100,
	step = 1,
	values = { min: 25, max: 75 },
	onChange,
}) => {
	const {
		containerRef,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleTouchMove,
		handleTouchStart,
		localValues,
	} = useRange({ values, min, max, step, onChange });

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp, handleTouchMove]);

	const minPosition = ((localValues.min - min) / (max - min)) * 100;
	const maxPosition = ((localValues.max - min) / (max - min)) * 100;

	return (
		<div className={styles['range_wrapper']} ref={containerRef}>
			<span className={styles.label}>от</span>
			<div className={styles['range-container']}>
				<div className={styles['range-track']} />
				<div
					className={styles['range-active']}
					style={{
						left: `${minPosition}%`,
						right: `${100 - maxPosition}%`,
					}}
				/>
				<div
					className={`${styles['range-thumb']} ${styles['range-thumb--min']}`}
					style={{ left: `${minPosition}%` }}
					onMouseDown={handleMouseDown('min')}
					onTouchStart={handleTouchStart('min')}
				>
					<span className={styles['range-value']}>{localValues.min}</span>
				</div>
				<div
					className={`${styles['range-thumb']} ${styles['range-thumb--max']}`}
					style={{ left: `${maxPosition}%` }}
					onMouseDown={handleMouseDown('max')}
					onTouchStart={handleTouchStart('max')}
				>
					<span className={styles['range-value']}>{localValues.max}</span>
				</div>
			</div>
			<span className={styles.label}>до</span>
		</div>
	);
};

export default Range;
