import { useCallback, useEffect, useRef, useState } from 'react';

import { IUseRange } from '@/types/hooks.types';

import { useClearAllFiltersStore } from '@/store/store';

export const useRange = ({
	min = 0,
	max = 100,
	step = 1, //HELP: на сколько изменяется значение
	values = { min: 25, max: 75 },
	onChange,
	filter,
	updateUrlParams,
}: IUseRange) => {
	const isClear = useClearAllFiltersStore(store => store.isClear);

	//HELP: Границы диапазона, которые можно выбрать (из filter)
	const rangeBoundaries = {
		min: Number(filter?.min_value) || 0,
		max: Number(filter?.max_value) || 100,
	};

	const [inSearchParams, setInSearchParams] = useState<boolean>(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
	// const [localValues, setLocalValues] = useState(values);
	const [localValues, setLocalValues] = useState({
		min: rangeBoundaries.min,
		max: rangeBoundaries.max,
	});
	const searchParams = new URLSearchParams(window.location.search);

	const calculateValue = useCallback(
		(clientX: number) => {
			if (!containerRef.current) return 0;
			const rect = containerRef.current.getBoundingClientRect();
			const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
			const percentage = x / rect.width;
			const value = min + percentage * (max - min);
			return Math.round(value / step) * step;
		},
		[min, max, step],
	);
	const updateValue = useCallback(
		(type: 'min' | 'max', value: number) => {
			setLocalValues(prev => {
				const newValues = { ...prev };
				if (type === 'min') {
					newValues.min = Math.min(value, prev.max - step);
				} else {
					newValues.max = Math.max(value, prev.min + step);
				}
				// if (onChange) onChange(newValues);
				return newValues;
			});
		},
		[setLocalValues],
	);
	const handleMouseDown = useCallback(
		(type: 'min' | 'max') => (e: React.MouseEvent) => {
			e.preventDefault();
			setDragging(type);
			const value = calculateValue(e.clientX);
			updateValue(type, value);

			console.log('before in func', inSearchParams);
			if (inSearchParams) {
				console.log('ok func');
				setInSearchParams(false);
			}
		},
		[
			setDragging,
			setInSearchParams,
			inSearchParams,
			updateValue,
			calculateValue,
		],
	);
	const handleTouchStart = useCallback(
		(type: 'min' | 'max') => (e: React.TouchEvent) => {
			setDragging(type);
			const touch = e.touches[0];
			const value = calculateValue(touch.clientX);
			updateValue(type, value);

			console.log('before in func', inSearchParams);
			if (inSearchParams) {
				console.log('ok func');
				setInSearchParams(false);
			}
		},
		[
			setDragging,
			calculateValue,
			updateValue,
			inSearchParams,
			setInSearchParams,
		],
	);

	const handleMove = useCallback(
		(clientX: number) => {
			if (!dragging) return;
			const value = calculateValue(clientX);
			updateValue(dragging, value);
		},
		[dragging, calculateValue, updateValue],
	);
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			handleMove(e.clientX);
		},
		[handleMove],
	);
	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			handleMove(e.touches[0].clientX);
		},
		[handleMove],
	);

	//HELP: При завершении перетаскивания вызываем onChange один раз с окончательными значениями
	const handleMouseUp = useCallback(() => {
		setDragging(null);
		if (onChange) {
			onChange(localValues);
		}
	}, [localValues, onChange]);

	//HELP: Текущие значения ползунков (приоритет: значение из URL, если его нет – можно задать дефолтные значения)
	const sliderValues = {
		min:
			rangeBoundaries.min ||
			Number(searchParams.get(`num_from[${filter?.id}]`)),
		max:
			rangeBoundaries.max || Number(searchParams.get(`num_to[${filter?.id}]`)),
	};

	useEffect(() => {
		//HELP: При сбросе настроек откатываем range к стандартным значениям здесь и в самом компоненте Range, т.к. там почему-то предыдущее значение оставалось
		if (isClear && filter?.min_value) {
			setLocalValues({
				min: rangeBoundaries.min,
				max: rangeBoundaries.max,
			});
			setInSearchParams(true);
		}
	}, [isClear, rangeBoundaries, filter?.min_value]);

	// //HELP: Эта функция вызывается, когда пользователь отпустил ползунок.
	// //HELP: Обновляем URL с новыми значениями.
	const handleRangeChange = useCallback(
		(values: { min: number; max: number }) => {
			const currentMin = searchParams.get(`num_from[${filter?.id}]`);
			const currentMax = searchParams.get(`num_to[${filter?.id}]`);

			if (
				currentMin === null &&
				values.min === rangeBoundaries.min &&
				currentMax === null &&
				values.max === rangeBoundaries.max
			) {
				return; //HELP: Не обновляем URL, если он еще не содержит значений и они дефолтные
			}

			if (
				values.min !== Number(currentMin) ||
				values.max !== Number(currentMax)
			) {
				if (updateUrlParams)
					updateUrlParams({
						[`num_from[${filter?.id}]`]: values.min.toString(),
						[`num_to[${filter?.id}]`]: values.max.toString(),
					});
			}
		},
		[rangeBoundaries, updateUrlParams, searchParams],
	);

	useEffect(() => {
		// console.log('in effect', inSearchParams);
		if (updateUrlParams && !inSearchParams)
			updateUrlParams({
				[`num_from[${filter?.id}]`]: localValues.min.toString(),
				[`num_to[${filter?.id}]`]: localValues.max.toString(),
			});
	}, [localValues, inSearchParams]);

	return {
		containerRef,
		localValues,
		handleMouseDown,
		handleTouchStart,
		handleMouseMove,
		handleTouchMove,
		handleMouseUp,
		rangeBoundaries,
		sliderValues,
		handleRangeChange,
		setLocalValues,
	};
};

// const sliderValues = {
// 	min:
// 		Number(searchParams.get(`num_from[${filter?.id}]`)) ||
// 		rangeBoundaries.min,
// 	max:
// 		Number(searchParams.get(`num_to[${filter?.id}]`)) || rangeBoundaries.max,
// };

// const handleRangeChange = (values: { min: number; max: number }) => {
// 	const currentMin = searchParams.get(`num_from[${filter?.id}]`);
// 	const currentMax = searchParams.get(`num_to[${filter?.id}]`);

// 	const isDefaultMin = values.min === rangeBoundaries.min;
// 	const isDefaultMax = values.max === rangeBoundaries.max;

// 	// Если текущие значения совпадают с дефолтными и в URL уже нет параметров — ничего не делаем
// 	if (
// 		currentMin === null &&
// 		currentMax === null &&
// 		isDefaultMin &&
// 		isDefaultMax
// 	) {
// 		return;
// 	}

// 	// Если выбраны граничные значения — удаляем параметры из URL
// 	if (isDefaultMin && isDefaultMax) {
// 		if (updateUrlParams)
// 			updateUrlParams({
// 				[`num_from[${filter?.id}]`]: null,
// 				[`num_to[${filter?.id}]`]: null,
// 			});
// 		return;
// 	}

// 	// Если хотя бы одно значение отличается — обновляем соответствующие параметры
// 	const newParams: Record<string, string | null> = {};
// 	if (!isDefaultMin) {
// 		newParams[`num_from[${filter?.id}]`] = values.min.toString();
// 	} else {
// 		newParams[`num_from[${filter?.id}]`] = null;
// 	}
// 	if (!isDefaultMax) {
// 		newParams[`num_to[${filter?.id}]`] = values.max.toString();
// 	} else {
// 		newParams[`num_to[${filter?.id}]`] = null;
// 	}

// 	if (updateUrlParams) {
// 		updateUrlParams(newParams);
// 	}
// };

// console.log('localValues', localValues, inSearchParams);
