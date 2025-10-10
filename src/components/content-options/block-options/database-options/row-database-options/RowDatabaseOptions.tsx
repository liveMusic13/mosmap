import Image from 'next/image';
import { ChangeEvent, FC, useMemo } from 'react';

import Button from '@/components/ui/button/Button';
import CheckboxCircle from '@/components/ui/checkbox-circle/CheckboxCircle';
import Input from '@/components/ui/input/Input';
import Select from '@/components/ui/select/Select';

import { IEditableData } from '@/types/localState.types';
import { IRowDatabaseOptions } from '@/types/props.types';
import { IItemFilter } from '@/types/requestData.types';

import { getCheckboxField, getDisabledState, getType } from '@/utils/database';

import styles from './RowDatabaseOptions.module.scss';
import { colors } from '@/app.constants';
import { arrColumn } from '@/data/database.data';

const RowDatabaseOptions: FC<IRowDatabaseOptions> = ({
	data,
	position,
	onUpdate,
	editableData,
	handleDelete,
	targetIdObject,
	handleViewSettings,
	handleMovePriority,
}) => {
	const optionsSelect: IItemFilter[] = [
		{
			item_id: 0,
			item_name: 'Строка',
		},
		{
			item_id: 1,
			item_name: 'Число',
		},
		{
			item_id: 2,
			item_name: 'Текст',
		},
		{
			item_id: 3,
			item_name: 'Список',
		},
	];
	const isTarget = targetIdObject === Number(data.id);

	//HELP: Выделим элементы, удовлетворяющие условию
	const generalOptions = useMemo(
		() =>
			arrColumn.filter(
				el =>
					el.name === '#' ||
					el.name === 'Наименование столбца' ||
					el.name === '',
			),
		[],
	);

	//HELP: Также можно получить массив остальных элементов
	const restOptions = useMemo(
		() =>
			arrColumn.filter(
				el =>
					el.name !== '#' &&
					el.name !== 'Наименование столбца' &&
					el.name !== '',
			),
		[],
	);

	//HELP: Определяем тип текущего элемента
	const type = getType(data);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		onUpdate(Number(data.id), 'name', e.target.value);
	};

	//HELP: Для чекбоксов - принимаем событие, извлекаем checked
	const handleCheckboxChange =
		(field: keyof IEditableData) => (e: ChangeEvent<HTMLInputElement>) => {
			onUpdate(Number(data.id), field, e.target.checked ? 1 : 0);
		};

	//HELP: Для селекта - принимаем IItemFilter, извлекаем значение
	const handleSelectChange = (selectedItem: IItemFilter | null) => {
		if (!selectedItem) return;
		onUpdate(Number(data.id), 'type_object', selectedItem.item_name);
		onUpdate(
			Number(data.id),
			'type',
			// String(
			// 	selectedItem.item_id === 0 ? 1 : selectedItem.item_id === 1 ? 2 : 5,
			// ),
			selectedItem.item_id === 2
				? 5
				: selectedItem.item_id === 3
					? 6
					: selectedItem.item_id,
		);
		console.log(
			'selectedItem',
			selectedItem,
			String(
				selectedItem.item_id === 2
					? 5
					: selectedItem.item_id === 3
						? 6
						: selectedItem.item_id,
			),
		);
	};

	return (
		<>
			<div className={styles.wrapper_rowDatabaseOptions}>
				{arrColumn.map(el => {
					const isDisabled = getDisabledState(type, el.name);

					if (el.name === '#') {
						return (
							<p
								key={el.id}
								className={styles.position}
								style={
									isTarget
										? {
												color: colors.green,
												fontSize: '2rem',
												// textShadow: `0px 0px  10px ${colors.black}`,
											}
										: {}
								}
							>
								{position + 1}
							</p>
						);
					} else if (el.name === 'Наименование столбца') {
						return (
							<Input
								key={el.id}
								value={editableData?.name || ''}
								onChange={handleInputChange}
								type='text'
								style={{
									width: 'calc(227/1920*100vw)',
									backgroundColor: colors.white,
								}}
								styleInput={{
									fontSize: '1rem',
								}}
								disabled={isDisabled}
							/>
						);
					} else if (el.name === 'Тип') {
						return (
							<Select
								key={el.id}
								forInfo={{
									isInfo: true,
									value:
										editableData?.type || editableData?.type === 0
											? optionsSelect[
													editableData.type === 5
														? 2
														: editableData.type === 6
															? 3
															: editableData.type
												]?.item_name
											: ' ',
								}}
								handleClick={handleSelectChange}
								items={optionsSelect}
								disabled={isDisabled}
							/>
						);
					} else if (el.name === '') {
						const isDisabled =
							data.name === 'Районы Москвы' ||
							data.name === 'Округа' ||
							data.name === 'Районы области';

						return (
							<div key={el.id} className={styles.end__buttons}>
								<button
									onClick={() =>
										handleMovePriority(
											Number(data.id),
											Number(data.priority) + 1,
										)
									}
								>
									&uArr;
								</button>
								<button
									className={styles.last_button}
									onClick={() =>
										handleMovePriority(
											Number(data.id),
											Number(data.priority) - 1,
										)
									}
								>
									&dArr;
								</button>
								<Button
									// key={el.id}
									style={{
										backgroundColor: 'transparent',
									}}
									onClick={() =>
										handleDelete ? handleDelete(Number(data.id)) : undefined
									}
									disabled={isDisabled}
								>
									<Image
										src='/images/icons/exit.svg'
										alt='exit'
										width={8}
										height={8}
									/>
								</Button>
							</div>
						);
					} else {
						return (
							<CheckboxCircle
								key={el.id}
								value=''
								checked={!!editableData?.[getCheckboxField(el.name)]}
								onChange={handleCheckboxChange(getCheckboxField(el.name))}
								disabled={isDisabled}
								styleLabel={{
									alignSelf: 'center',
									justifySelf: 'center',
								}}
							/>
						);
					}
				})}
			</div>

			<div className={styles.wrapper_rowDatabaseOptions_mobile}>
				{generalOptions.length > 0 && (
					<div className={styles.wrapper__generalOptions}>
						<div className={styles.block__generalOptions}>
							<p
								className={styles.position}
								style={
									isTarget
										? {
												color: colors.green,
												fontSize: '2rem',
											}
										: {}
								}
							>
								{position + 1}
							</p>
							<Input
								value={editableData?.name || ''}
								onChange={handleInputChange}
								type='text'
								style={{
									width: 'calc(310/480*100vw)',
									backgroundColor: colors.white,
								}}
								styleInput={{
									fontSize: '1rem',
								}}
								disabled={getDisabledState(type, generalOptions[0].name)}
							/>
							<Button
								style={{
									backgroundColor: 'transparent',
								}}
								onClick={() =>
									handleDelete ? handleDelete(Number(data.id)) : undefined
								}
								disabled={
									data.name === 'Районы Москвы' ||
									data.name === 'Округа' ||
									data.name === 'Районы области'
								}
							>
								<Image
									src='/images/icons/exit.svg'
									alt='exit'
									width={14}
									height={14}
								/>
							</Button>
						</div>
						<div>
							<button
								onClick={() =>
									handleMovePriority(Number(data.id), Number(data.priority) + 1)
								}
							>
								&uArr;
							</button>
							<button
								onClick={() =>
									handleMovePriority(Number(data.id), Number(data.priority) - 1)
								}
							>
								&dArr;
							</button>
						</div>
					</div>
				)}

				{restOptions.map(el => {
					const isActive =
						(el.name === 'Иконка' || el.name === 'Цвет') &&
						editableData?.id === targetIdObject &&
						type === 'list';

					if (el.name === 'Тип') {
						return (
							<div key={el.id} className={styles.block__elem}>
								<h2 className={styles.title__elem}>{el.name}</h2>
								<Select
									forInfo={{
										isInfo: true,
										value: editableData?.type
											? optionsSelect[
													editableData.type === 5 ? 2 : editableData.type
												]?.item_name
											: ' ',
									}}
									handleClick={handleSelectChange}
									items={optionsSelect}
									disabled={getDisabledState(type, el.name)}
								/>
							</div>
						);
					} else {
						return (
							<div key={el.id} className={styles.block__elem}>
								<h2
									className={styles.title__elem}
									style={{
										textShadow: isActive
											? `0px 0px 20px ${colors.green_shadow}`
											: 'none',
									}}
								>
									{el.name}
									{(el.id === 9 || el.id === 8) && (
										<svg
											className={styles.icon_svg}
											style={{ color: colors.green }}
											onClick={() =>
												isActive ? handleViewSettings(el) : undefined
											}
										>
											<use xlinkHref={`/images/icons/sprite.svg#gear`}></use>
										</svg>
									)}
								</h2>
								<CheckboxCircle
									value=''
									checked={!!editableData?.[getCheckboxField(el.name)]}
									onChange={handleCheckboxChange(getCheckboxField(el.name))}
									disabled={getDisabledState(type, el.name)}
									styleLabel={{
										alignSelf: 'center',
										justifySelf: 'center',
									}}
								/>
							</div>
						);
					}
				})}
			</div>
		</>
	);
};

export default RowDatabaseOptions;
