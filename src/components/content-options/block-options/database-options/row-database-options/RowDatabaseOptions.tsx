import Image from 'next/image';
import { ChangeEvent, FC } from 'react';

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
	];

	//HELP: Определяем тип текущего элемента
	const type = getType(data);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		onUpdate(data.id, 'name', e.target.value);
	};

	//HELP: Для чекбоксов - принимаем событие, извлекаем checked
	const handleCheckboxChange =
		(field: keyof IEditableData) => (e: ChangeEvent<HTMLInputElement>) => {
			onUpdate(data.id, field, e.target.checked ? 1 : 0);
		};

	//HELP: Для селекта - принимаем IItemFilter, извлекаем значение
	const handleSelectChange = (selectedItem: IItemFilter) => {
		onUpdate(data.id, 'type_object', selectedItem.item_name);
		onUpdate(data.id, 'type', String(selectedItem.item_id ? 2 : 5));
	};

	return (
		<div className={styles.wrapper_rowDatabaseOptions}>
			{arrColumn.map(el => {
				const isDisabled = getDisabledState(type, el.name);

				if (el.name === '#') {
					return (
						<p key={el.id} className={styles.position}>
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
					// console.log('select', el, editableData);
					return (
						<Select
							key={el.id}
							forInfo={{
								isInfo: true,
								value: editableData?.type
									? optionsSelect[
											editableData.type === '5' ? 2 : Number(editableData.type)
										]?.item_name
									: ' ',
							}}
							handleClick={handleSelectChange}
							items={optionsSelect}
							disabled={isDisabled}
							// absoluteOptions={true}
						/>
					);
				} else if (el.name === '') {
					return (
						<Button
							key={el.id}
							style={{
								backgroundColor: 'transparent',
							}}
						>
							<Image
								src='/images/icons/exit.svg'
								alt='exit'
								width={8}
								height={8}
							/>
						</Button>
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
	);
};

export default RowDatabaseOptions;
