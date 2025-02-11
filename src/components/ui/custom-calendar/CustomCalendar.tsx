import Image from 'next/image';
import { FC, useState } from 'react';

import { ICustomCalendar } from '@/types/props.types';

import { useCalendar } from '@/hooks/useCalendar';

import styles from './CustomCalendar.module.scss';
import { weeksArr } from '@/data/calendar.data';

const CustomCalendar: FC<ICustomCalendar> = ({ callbackDate }) => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	const {
		formatDate,
		getDaysInMonth,
		getStartDayOfWeek,
		handleDateClick,
		setRange,
		isInRange,
	} = useCalendar(callbackDate);

	const renderDays = () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const daysInMonth = getDaysInMonth(year, month);
		const startDayOfWeek = getStartDayOfWeek(year, month) || 7; // Чтобы понедельник был первым
		const prevMonthDays = getDaysInMonth(year, month - 1 >= 0 ? month - 1 : 11);

		const rows = [];
		let cells = [];

		//HELP: Добавляем дни предыдущего месяца (если месяц не начинается с понедельника)
		for (let i = startDayOfWeek - 1; i > 0; i--) {
			const day = prevMonthDays - i + 1;
			const date =
				month - 1 < 0
					? formatDate(year - 1, 11, day)
					: formatDate(year, month - 1, day);

			cells.push(
				<div key={date} className={`${styles.day} ${styles.otherMonth}`}>
					{day}
				</div>,
			);
		}

		//HELP: Добавляем текущие дни месяца
		for (let day = 1; day <= daysInMonth; day++) {
			const date = formatDate(year, month, day);

			cells.push(
				<div
					key={date}
					className={`${styles.day} ${styles.currentMonth} ${isInRange(date) ? styles.inRange : ''}`}
					onClick={() => handleDateClick(date)}
				>
					{day}
				</div>,
			);

			//HELP: Если дошли до конца недели (воскресенье) – переносим на новую строку
			if (cells.length % 7 === 0) {
				rows.push(
					<div key={`week-${rows.length}`} className={styles.week}>
						{cells}
					</div>,
				);
				cells = [];
			}
		}

		//HELP: Добавляем дни следующего месяца, чтобы завершить последнюю неделю (если нужно)
		let nextMonthDay = 1;
		while (cells.length < 7) {
			const date =
				month + 1 > 11
					? formatDate(year + 1, 0, nextMonthDay)
					: formatDate(year, month + 1, nextMonthDay);

			cells.push(
				<div key={date} className={`${styles.day} ${styles.otherMonth}`}>
					{nextMonthDay}
				</div>,
			);

			nextMonthDay++;
		}

		//HELP: Добавляем последнюю строку в календарь
		if (cells.length > 0) {
			rows.push(
				<div key={`week-${rows.length}`} className={styles.week}>
					{cells}
				</div>,
			);
		}

		return rows;
	};

	return (
		<div className={styles.calendar}>
			<div className={styles.header}>
				<button
					onClick={() =>
						setCurrentDate(
							new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
						)
					}
					className={styles.navButton}
				>
					<Image
						src='/images/icons/arrow_calendar.svg'
						alt='arrow'
						width={12}
						height={12}
						className={styles.prevMonth}
					/>
				</button>
				<h2 className={styles.title}>
					{currentDate.toLocaleString('default', {
						month: 'long',
						year: 'numeric',
					})}
				</h2>
				<button
					onClick={() =>
						setCurrentDate(
							new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
						)
					}
					className={styles.navButton}
				>
					<Image
						src='/images/icons/arrow_calendar.svg'
						alt='arrow'
						width={12}
						height={12}
						className={styles.nextMonth}
					/>
				</button>
			</div>
			<div className={styles.weekDays}>
				{weeksArr.map(day => (
					<div key={day} className={styles.weekDay}>
						{day}
					</div>
				))}
			</div>
			{renderDays()}
			<div className={styles.footer}>
				<button
					className={styles.cancelButton}
					onClick={() => {
						setRange({ start: null, end: null });
						callbackDate({ start: null, end: null });
					}}
				>
					Отмена
				</button>
				<button className={styles.applyButton}>Применить</button>
			</div>
		</div>
	);
};

export default CustomCalendar;
