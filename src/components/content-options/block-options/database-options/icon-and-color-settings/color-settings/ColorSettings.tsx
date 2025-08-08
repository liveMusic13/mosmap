import Image from 'next/image';
import { ChangeEvent, FC, useState } from 'react';

import Button from '@/components/ui/button/Button';
import ColorPicker from '@/components/ui/color-picker/ColorPicker';
import Input from '@/components/ui/input/Input';

import { IColorSettingsProps } from '@/types/props.types';
import { IListItemsResponse } from '@/types/requestData.types';

import { useCheckWidth } from '@/hooks/useCheckWidth';

import styles from './ColorSettings.module.scss';
import { colors } from '@/app.constants';
import { arrColumnPopupColor } from '@/data/database.data';

const ColorSettings: FC<IColorSettingsProps> = ({
	editListData,
	onUpdate,
	handleDelete,
}) => {
	if (
		!editListData ||
		editListData.length === 0 ||
		!Array.isArray(editListData)
	)
		return null;

	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const [viewColor, setViewColor] = useState<{
		id: number | null;
		isView: boolean;
	}>({ id: null, isView: false });

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		el: IListItemsResponse,
	) => {
		onUpdate(el.id, 'name', e.target.value);
	};
	const handleCloseChoiceIcon = () => setViewColor({ id: null, isView: false });
	const handleOpenChoiceIcon = (el: IListItemsResponse) =>
		setViewColor({ id: el.id, isView: true });

	console.log('editListData', editListData);

	return (
		<div className={styles.wrapper_colorSettings}>
			<div className={styles.block__titles_table}>
				{arrColumnPopupColor.map(el => (
					<h2
						key={el.id}
						className={styles.title_table}
						style={
							el.name !== 'Название' && el.name !== '#'
								? {
										textAlign: 'center',
									}
								: {}
						}
					>
						{el.name}
					</h2>
				))}
			</div>
			{editListData?.map((el, index) => (
				<div key={index} className={styles.table__body}>
					{arrColumnPopupColor.map(col => {
						if (col.name === '#') {
							return (
								<p key={col.id} className={styles.position}>
									{index + 1}
								</p>
							);
						} else if (col.name === 'Название') {
							return (
								<Input
									key={col.id}
									value={editListData[index].name || ''}
									onChange={e => handleInputChange(e, el)}
									type='text'
									style={{
										width: isMobile ? undefined : 'calc(377/1920*100vw)',
										backgroundColor: colors.white,
										overflow: 'hidden',
									}}
									styleInput={{
										fontSize: '1rem',
									}}
								/>
							);
						} else if (col.name === 'Цвет') {
							return (
								<div key={col.id} className={styles.block__icons}>
									<div
										className={styles.color}
										style={{
											backgroundColor: editListData[index].color,
											border: `1px solid ${colors.grey}`,
										}}
										onClick={() => handleOpenChoiceIcon(el)}
									></div>
									{viewColor.id === el.id && viewColor.isView && (
										<ColorPicker
											color={editListData[index].color || colors.grey}
											onClick={handleCloseChoiceIcon}
											handleColorChange={(color: string) =>
												onUpdate(el.id, 'color', color)
											}
										/>
									)}
								</div>
							);
						} else {
							return (
								<Button
									key={col.id}
									style={{
										backgroundColor: 'transparent',
									}}
									onClick={() => handleDelete(el.id)}
								>
									<Image
										src='/images/icons/exit.svg'
										alt='exit'
										width={isMobile ? 14 : 8}
										height={isMobile ? 14 : 8}
									/>
								</Button>
							);
						}
					})}
				</div>
			))}
		</div>
	);
};

export default ColorSettings;
