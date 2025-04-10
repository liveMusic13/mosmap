import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { IRangeIntervalProps } from '@/types/props.types';

import { useSuccessSaveColorsIntervalStore } from '@/store/store';

import { useCheckSaveColorInterval } from '@/hooks/useCheckSaveColorInterval';
import { useRangeIntervalLogic } from '@/hooks/useRangeIntervalLogic';
import { useSaveColorInterval } from '@/hooks/useSaveColorInterval';

import Button from '../button/Button';

import styles from './RangeInterval.module.scss';
import InputGroup from './input-group/InputGroup';
import { TOKEN } from '@/app.constants';

const RangeInterval: FC<IRangeIntervalProps> = ({
	intervalsObject,
	isViewInputsInterval,
	isViewFieldSelect,
}) => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const { values: intervals, min_value, max_value } = intervalsObject;
	const token = Cookies.get(TOKEN);

	const setRanges_color_map = useSuccessSaveColorsIntervalStore(
		store => store.setRanges_color_map,
	);

	const {
		mutate,
		isSuccess,
		data: data_saveColorInterval,
	} = useSaveColorInterval();
	useCheckSaveColorInterval(isSuccess, data_saveColorInterval);

	const {
		rangeData,
		setRangeData,
		sliderPositions,
		handleSliderChange,
		handleInputBlur,
		handleAddNewInterval,
	} = useRangeIntervalLogic({
		intervals: intervals || [],
		min_value,
		max_value,
	});
	const trackRef = useRef<HTMLDivElement>(null);

	//HELP: Локальное состояние для хранения значений инпутов (в виде строк) для каждого интервала.
	const [inputValues, setInputValues] = useState<
		{ min: string; max: string }[]
	>([]);

	//HELP: Синхронизация значений инпутов с обновлёнными данными интервалов.
	useEffect(() => {
		const values = rangeData.map(interval => ({
			min: Math.round(interval.min).toString(),
			max: Math.round(interval.max).toString(),
		}));
		setInputValues(values);
	}, [rangeData]);

	useEffect(() => {
		//HELP: Для того чтобы при изменении данных в пропсах, менялись и данные в инпутах и range
		setRangeData(intervals || []);
	}, [intervals]);

	/**
	 * Обработчик начала перетаскивания ползунка.
	 * Вычисляет смещение относительно начальной позиции и обновляет значение ползунка.
	 */
	const onMouseDown = (
		index: number,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>, //HELP: Типизирую через React. а не прямой импорт потому что если прямо типизировать через MouseEvent<HTMLDivElement, MouseEvent> то начинает на типизацию ругаться, хотя вроде как разницы никакой не должно быть.
	) => {
		const startX = e.clientX;
		if (!trackRef.current) return;
		const trackRect = trackRef.current.getBoundingClientRect();
		const sliderStartValue = sliderPositions[index];

		const onMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX;
			const trackWidth = trackRect.width;
			//HELP: Расчет изменения значения на основе перемещения мыши относительно общего диапазона
			const valueDelta = (max_value - min_value) * (deltaX / trackWidth);
			const newValue = sliderStartValue + valueDelta;
			handleSliderChange(index, newValue);
		};

		const onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};

	/**
	 * Обработчик начала перетаскивания ползунка касанием (touch).
	 */
	const onTouchStart = (index: number, e: React.TouchEvent<HTMLDivElement>) => {
		const touch = e.touches[0];
		const startX = touch.clientX;
		if (!trackRef.current) return;
		const trackRect = trackRef.current.getBoundingClientRect();
		const sliderStartValue = sliderPositions[index];

		const onTouchMove = (moveEvent: TouchEvent) => {
			//HELP: Если нужно предотвратить прокрутку страницы, можно вызвать moveEvent.preventDefault();
			moveEvent.preventDefault();
			const moveTouch = moveEvent.touches[0];
			const deltaX = moveTouch.clientX - startX;
			const trackWidth = trackRect.width;
			const valueDelta = (max_value - min_value) * (deltaX / trackWidth);
			const newValue = sliderStartValue + valueDelta;
			handleSliderChange(index, newValue);
		};

		const onTouchEnd = () => {
			document.removeEventListener('touchmove', onTouchMove);
			document.removeEventListener('touchend', onTouchEnd);
		};

		document.addEventListener('touchmove', onTouchMove, { passive: false });
		document.addEventListener('touchend', onTouchEnd);
	};

	/**
	 * Обработчик изменения текста в инпутах.
	 */
	const handleInputChange = (
		index: number,
		field: 'min' | 'max',
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newInputValues = [...inputValues];
		newInputValues[index] = {
			...newInputValues[index],
			[field]: e.target.value,
		};
		setInputValues(newInputValues);
	};

	/**
	 * Обработчик ухода фокуса с инпута. Вызывает handleInputBlur для валидации и обновления данных.
	 */
	const handleInputBlurWrapper = (
		index: number,
		field: 'min' | 'max',
		e: React.FocusEvent<HTMLInputElement>,
	) => {
		handleInputBlur(index, field, e.target.value);
		//HELP: После обновления rangeData, useEffect синхронизирует inputValues.
	};

	const handleSaveData = useCallback(() => {
		console.log('rangeData', rangeData && rangeData.length > 0, rangeData);
		if (rangeData && rangeData.length > 0) {
			mutate({ map, data: { ...intervalsObject, values: rangeData } });
			setRanges_color_map(JSON.stringify(rangeData));
		} else {
			mutate({ map, data: intervalsObject });
		}
	}, [intervalsObject, rangeData]);

	return (
		<div className={styles['range_wrapper']}>
			{token && isViewFieldSelect && (
				<>
					<div className={styles['range-container']}>
						<div ref={trackRef} className={styles['range-track']}>
							{sliderPositions.map((sliderValue, index) => (
								<div
									key={index}
									className={styles['range-thumb']}
									//HELP: Вычисляем позицию в процентах относительно общего диапазона
									style={{
										left: `${((sliderValue - min_value) / (max_value - min_value)) * 100}%`,
									}}
									onMouseDown={e => {
										e.preventDefault();
										onMouseDown(index, e);
									}}
									onTouchStart={e => {
										e.preventDefault();
										onTouchStart(index, e);
									}}
								>
									<span className={styles['range-value']}>
										{Math.round(sliderValue)}
									</span>
								</div>
							))}
						</div>
					</div>
					{isViewInputsInterval && (
						<div className={styles['range-values-container']}>
							{rangeData.map((interval, index) => (
								<InputGroup
									key={index}
									index={index}
									inputValues={inputValues}
									handleInputChange={handleInputChange}
									handleInputBlurWrapper={handleInputBlurWrapper}
									interval={interval}
									disableMin={index === 0}
									disableMax={index === rangeData.length - 1}
									setRangeData={setRangeData}
									rangeData={rangeData}
								/>
							))}
						</div>
					)}
				</>
			)}
			<div className={styles.block__buttons}>
				{token && isViewFieldSelect && (
					<Button onClick={handleAddNewInterval}>Добавить</Button>
				)}
				<Button onClick={handleSaveData}>Применить</Button>
			</div>
		</div>
	);
};

export default RangeInterval;
