import { FC, useCallback, useState } from 'react';

import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';

import { ICalendarState } from '@/types/localState.types';

import { formatDateForDisplay } from '@/utils/date';

import styles from './FilterCalendar.module.scss';

const FilterCalendar: FC = () => {
	const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
	const [date, setDate] = useState<ICalendarState>({ start: null, end: null });

	//HELP: Функция для получения даты из календаря. Помещаю в колбэк т.к. прокидываю пропсом в дочерний компонент и хук
	const callbackDate = useCallback((date: ICalendarState) => {
		setDate(date);
	}, []);

	const startDate = date.start
		? formatDateForDisplay(date.start)
		: 'MM.DD.YYYY';
	const endDate = date.end ? formatDateForDisplay(date.end) : 'MM.DD.YYYY';

	return (
		<div className={styles.filter__calendar}>
			<h2 className={styles.title}>Выберите дату</h2>
			<div className={styles.line}></div>

			<div
				className={styles.block__result}
				onClick={() => setIsOpenCalendar(!isOpenCalendar)}
			>
				<div className={styles.block__date}>
					<span className={styles.text}>от</span>
					<p className={styles.date}>{startDate}</p>
				</div>
				<div className={styles.block__date}>
					<span className={styles.text}>до</span>
					<p className={styles.date}>{endDate}</p>
				</div>
			</div>
			{isOpenCalendar && <CustomCalendar callbackDate={callbackDate} />}
		</div>
	);
};

export default FilterCalendar;
