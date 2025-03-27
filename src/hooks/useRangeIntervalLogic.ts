import { useCallback, useEffect, useState } from 'react';

import {
	IIntervals,
	IUseRangeIntervalLogicProps,
	IUseRangeIntervalLogicReturn,
} from '@/types/props.types';

export const useRangeIntervalLogic = ({
	intervals,
	min_value,
	max_value,
}: IUseRangeIntervalLogicProps): IUseRangeIntervalLogicReturn => {
	const [rangeData, setRangeData] = useState<IIntervals[]>(intervals);
	const [sliderPositions, setSliderPositions] = useState<number[]>([]);

	useEffect(() => {
		if (rangeData.length > 1) {
			const positions: number[] = [];
			//HELP: Инициализируем ползунки: для каждого разрыва между интервалами устанавливаем значение равное max предыдущего интервала
			for (let i = 0; i < rangeData.length - 1; i++) {
				positions.push(rangeData[i].max);
			}
			setSliderPositions(positions);
		}
	}, [rangeData, min_value, max_value]);

	/**
	 * Обновляет позицию ползунка, ограничивая значение глобальными границами (min_value, max_value)
	 * и значениями соседних интервалов.
	 */
	const handleSliderChange = (index: number, newValue: number) => {
		//HELP: Локальные границы: нижняя граница – максимум из локального min и глобального min_value,
		//HELP: верхняя граница – минимум из локального max следующего интервала и глобального max_value.
		const lowerBound = Math.max(rangeData[index].min, min_value);
		const upperBound = Math.min(rangeData[index + 1].max, max_value);
		const clampedValue = Math.min(Math.max(newValue, lowerBound), upperBound);

		//HELP: Обновляем интервалы: значение ползунка является границей между интервалами
		const newRangeData = [...rangeData];
		newRangeData[index] = { ...newRangeData[index], max: clampedValue };
		newRangeData[index + 1] = { ...newRangeData[index + 1], min: clampedValue };
		setRangeData(newRangeData);

		//HELP: Обновляем локальное состояние ползунков
		const newSliderPositions = [...sliderPositions];
		newSliderPositions[index] = clampedValue;
		setSliderPositions(newSliderPositions);
	};

	/**
	 * Обработка onBlur в инпутах.
	 * При уходе фокуса значение парсится, валидируется и, если корректное,
	 * обновляет данные интервала (а также соответствующие границы для соседних интервалов).
	 */
	const handleInputBlur = (
		index: number,
		field: 'min' | 'max',
		value: string,
	) => {
		const parsed = parseFloat(value);
		if (isNaN(parsed)) {
			//HELP: Если значение не число, не обновляем.
			return;
		}
		const newRangeData = [...rangeData];
		if (field === 'min') {
			if (index === 0) {
				if (parsed < min_value || parsed > newRangeData[0].max) return;
				newRangeData[0].min = parsed;
			} else {
				//HELP: Для остальных: значение должно быть не меньше минимального предыдущего интервала
				//HELP: и не больше текущего максимума.
				const lowerBoundary = newRangeData[index - 1].min;
				if (parsed < lowerBoundary || parsed > newRangeData[index].max) return;
				newRangeData[index - 1].max = parsed;
				newRangeData[index].min = parsed;
			}
		} else if (field === 'max') {
			if (index === newRangeData.length - 1) {
				if (parsed < newRangeData[index].min || parsed > max_value) return;
				newRangeData[index].max = parsed;
			} else {
				if (
					parsed < newRangeData[index].min ||
					parsed > newRangeData[index + 1].max
				)
					return;
				newRangeData[index].max = parsed;
				newRangeData[index + 1].min = parsed;
			}
		}
		setRangeData(newRangeData);
		const newSliderPositions: number[] = [];
		for (let i = 0; i < newRangeData.length - 1; i++) {
			newSliderPositions.push(newRangeData[i].max);
		}
		setSliderPositions(newSliderPositions);
	};

	const handleAddNewInterval = useCallback(() => {
		setRangeData(prev => [
			...prev,
			{
				min: prev[prev.length - 1]?.min || min_value,
				max: max_value,
				color: 'grey',
			},
		]);
	}, [max_value, min_value, rangeData]);

	return {
		rangeData,
		sliderPositions,
		handleSliderChange,
		handleInputBlur,
		setRangeData,
		handleAddNewInterval,
	};
};
