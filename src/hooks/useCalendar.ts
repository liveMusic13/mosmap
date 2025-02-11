import { useState } from 'react';

import { ICalendarState } from '@/types/localState.types';

export const useCalendar = (callbackDate: (date: ICalendarState) => void) => {
	const [range, setRange] = useState<ICalendarState>({
		start: null,
		end: null,
	});

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	};

	const getStartDayOfWeek = (year: number, month: number) => {
		return new Date(year, month, 1).getDay();
	};

	const formatDate = (year: number, month: number, day: number) => {
		return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	};

	const handleDateClick = (date: string) => {
		if (!range.start || (range.start && range.end)) {
			setRange({ start: date, end: null });
			callbackDate({ start: date, end: null }); //HELP:использую колбэк чтобы записать в родительский компонент дату
		} else {
			const start = new Date(range.start);
			const end = new Date(date);

			if (end < start) {
				setRange({ start: date, end: range.start });
				callbackDate({ start: date, end: range.start });
			} else {
				setRange({ start: range.start, end: date });
				callbackDate({ start: range.start, end: date });
			}
		}
	};

	const isInRange = (date: string) => {
		const { start, end } = range;
		if (!start) return false;

		const d = new Date(date);

		//HELP: Первая дата в диапазоне тоже считается "выбранной"
		if (date === start) return true;

		return end ? d >= new Date(start) && d <= new Date(end) : false;
	};

	return {
		setRange,
		getDaysInMonth,
		getStartDayOfWeek,
		formatDate,
		handleDateClick,
		isInRange,
	};
};
