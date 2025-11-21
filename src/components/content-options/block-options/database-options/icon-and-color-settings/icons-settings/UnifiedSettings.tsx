import Image from 'next/image';
import { ChangeEvent, FC, useState } from 'react';

import Button from '@/components/ui/button/Button';
import ColorPicker from '@/components/ui/color-picker/ColorPicker';
import Input from '@/components/ui/input/Input';

import { IIconsSettingsProps } from '@/types/props.types';
import { IListItemsResponse } from '@/types/requestData.types';

import { useCheckWidth } from '@/hooks/useCheckWidth';

import styles from './IconsSettings.module.scss';
import ChoiceIcon from './choice-icon/ChoiceIcon';
// можно оставить общий файл стилей
import { colors } from '@/app.constants';
import { arrColumnPopup } from '@/data/database.data';

interface IUnifiedSettingsProps extends IIconsSettingsProps {
	showIcon?: boolean;
	showColor?: boolean;
}
const UnifiedSettings: FC<IUnifiedSettingsProps> = ({
	editListData,
	onUpdate,
	handleDelete,
	isOnlyList,
	showIcon = true,
	showColor = true,
}) => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const [viewIcon, setViewIcon] = useState<{
		id: number | null;
		isView: boolean;
	}>({
		id: null,
		isView: false,
	});
	const [viewColor, setViewColor] = useState<{
		id: number | null;
		isView: boolean;
	}>({
		id: null,
		isView: false,
	});
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		el: IListItemsResponse,
	) => {
		onUpdate(el.id, 'name', e.target.value);
	};
	const handleCloseChoiceIcon = () => setViewIcon({ id: null, isView: false });
	const handleOpenChoiceIcon = (el: IListItemsResponse) =>
		setViewIcon({ id: el.id, isView: true });
	const handleCloseChoiceColor = () =>
		setViewColor({ id: null, isView: false });
	const handleOpenChoiceColor = (el: IListItemsResponse) =>
		setViewColor({ id: el.id, isView: true });
	return (
		<div
			className={`${styles.block__iconsSettings} ${isOnlyList ? styles.isOnlyList : ''} ${showIcon && showColor ? styles.fiveColumns : showIcon || showColor ? styles.gridFour : styles.threeColumns}`}
		>
			<div
				className={`${styles.block__titles_table} ${showIcon && showColor ? styles.fiveColumns : showIcon || showColor ? styles.gridFour : styles.threeColumns}`}
			>
				{arrColumnPopup.map(el => {
					if (
						el.name === '#' ||
						el.name === 'Название' ||
						el.name === 'Действие'
					) {
						return (
							<h2
								key={el.id}
								className={`${styles.title_table}`}
								style={
									el.name !== 'Название' && el.name !== '#'
										? { textAlign: 'center' }
										: {}
								}
							>
								{el.name}
							</h2>
						);
					} else if (el.name === 'Цвет' && showColor) {
						return (
							<h2
								key={el.id}
								className={`${styles.title_table}`}
								style={{ display: 'flex', justifyContent: 'center' }}
							>
								{el.name}
							</h2>
						);
					} else if (el.name === 'Иконка' && showIcon) {
						return (
							<h2
								key={el.id}
								className={`${styles.title_table}`}
								style={{ display: 'flex', justifyContent: 'center' }}
							>
								{el.name}
							</h2>
						);
					} else {
						return null;
					}
				})}
			</div>
			{/* Строки таблицы */}
			{editListData?.map((el, index) => (
				<div key={index} className={`${styles.table__body}`}>
					{arrColumnPopup.map(col => {
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
									value={el.name || ''}
									onChange={e => handleInputChange(e, el)}
									type='text'
									style={{
										width: isMobile ? undefined : 'calc(377/1920*100vw)',
										backgroundColor: colors.white,
										overflow: 'hidden',
									}}
									styleInput={{ fontSize: '1rem' }}
								/>
							);
						} else if (col.name === 'Иконка' && showIcon) {
							return (
								<div
									key={col.id}
									className={styles.block__icons}
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<svg
										className={styles.icon_svg}
										style={{ color: colors.grey }}
										onClick={() => handleOpenChoiceIcon(el)}
									>
										<use
											xlinkHref={`/images/icons/sprite.svg#${el.icon_name}`}
										></use>
									</svg>
									{viewIcon.id === el.id && viewIcon.isView && (
										<ChoiceIcon
											handleClose={handleCloseChoiceIcon}
											idListItem={el.id}
											onUpdate={onUpdate}
										/>
									)}
								</div>
							);
						} else if (col.name === 'Цвет' && showColor) {
							return (
								<div
									key={col.id}
									className={styles.block__icons}
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<div
										className={styles.color}
										style={{
											backgroundColor: el.color,
											border: `1px solid ${colors.grey}`,
										}}
										onClick={() => handleOpenChoiceColor(el)}
									></div>
									{viewColor.id === el.id && viewColor.isView && (
										<ColorPicker
											color={el.color || colors.grey}
											onClick={handleCloseChoiceColor}
											handleColorChange={color =>
												onUpdate(el.id, 'color', color)
											}
										/>
									)}
								</div>
							);
						} else if (col.name === 'Действие') {
							// кнопка удалить
							return (
								<Button
									key={col.id}
									style={{ backgroundColor: 'transparent' }}
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
						} else {
							return null;
						}
					})}
				</div>
			))}
		</div>
	);
};
export default UnifiedSettings;
// import Image from 'next/image';
// import { ChangeEvent, FC, useState } from 'react';

// import Button from '@/components/ui/button/Button';
// import ColorPicker from '@/components/ui/color-picker/ColorPicker';
// import Input from '@/components/ui/input/Input';

// import { IIconsSettingsProps } from '@/types/props.types';
// import { IListItemsResponse } from '@/types/requestData.types';

// import { useCheckWidth } from '@/hooks/useCheckWidth';

// import styles from './IconsSettings.module.scss';
// import ChoiceIcon from './choice-icon/ChoiceIcon';
// import { colors } from '@/app.constants';
// import { arrColumnPopup } from '@/data/database.data';

// interface IUnifiedSettingsProps extends IIconsSettingsProps {
// 	showIcon?: boolean;
// 	showColor?: boolean;
// }

// const UnifiedSettings: FC<IUnifiedSettingsProps> = ({
// 	editListData,
// 	onUpdate,
// 	handleDelete,
// 	isOnlyList,
// 	showIcon = true,
// 	showColor = true,
// }) => {
// 	const windowSize = useCheckWidth();
// 	const isMobile = windowSize <= 767;

// 	const [viewIcon, setViewIcon] = useState<{
// 		id: number | null;
// 		isView: boolean;
// 	}>({
// 		id: null,
// 		isView: false,
// 	});
// 	const [viewColor, setViewColor] = useState<{
// 		id: number | null;
// 		isView: boolean;
// 	}>({
// 		id: null,
// 		isView: false,
// 	});

// 	const handleInputChange = (
// 		e: ChangeEvent<HTMLInputElement>,
// 		el: IListItemsResponse,
// 	) => {
// 		onUpdate(el.id, 'name', e.target.value);
// 	};

// 	const handleCloseChoiceIcon = () => setViewIcon({ id: null, isView: false });
// 	const handleOpenChoiceIcon = (el: IListItemsResponse) =>
// 		setViewIcon({ id: el.id, isView: true });

// 	const handleCloseChoiceColor = () =>
// 		setViewColor({ id: null, isView: false });
// 	const handleOpenChoiceColor = (el: IListItemsResponse) =>
// 		setViewColor({ id: el.id, isView: true });

// 	// Определяем классы для колонок
// 	const columnClass =
// 		showIcon && showColor
// 			? styles.fiveColumns
// 			: showIcon || showColor
// 				? styles.gridFour
// 				: styles.threeColumns;

// 	return (
// 		<div
// 			className={`${styles.block__iconsSettings} ${isOnlyList ? styles.isOnlyList : ''} ${columnClass}`}
// 		>
// 			{/* Шапка таблицы - фиксированная */}
// 			<div className={`${styles.block__titles_table} ${columnClass}`}>
// 				{arrColumnPopup.map(el => {
// 					if (
// 						el.name === '#' ||
// 						el.name === 'Название' ||
// 						el.name === 'Действие'
// 					) {
// 						return (
// 							<h2
// 								key={el.id}
// 								className={`${styles.title_table}`}
// 								style={
// 									el.name !== 'Название' && el.name !== '#'
// 										? { textAlign: 'center' }
// 										: {}
// 								}
// 							>
// 								{el.name}
// 							</h2>
// 						);
// 					} else if (el.name === 'Цвет' && showColor) {
// 						return (
// 							<h2
// 								key={el.id}
// 								className={`${styles.title_table}`}
// 								style={{ display: 'flex', justifyContent: 'center' }}
// 							>
// 								{el.name}
// 							</h2>
// 						);
// 					} else if (el.name === 'Иконка' && showIcon) {
// 						return (
// 							<h2
// 								key={el.id}
// 								className={`${styles.title_table}`}
// 								style={{ display: 'flex', justifyContent: 'center' }}
// 							>
// 								{el.name}
// 							</h2>
// 						);
// 					} else {
// 						return null;
// 					}
// 				})}
// 			</div>

// 			{/* Обёртка для скролла */}
// 			<div className={styles.table__wrapper}>
// 				{/* Строки таблицы */}
// 				{editListData?.map((el, index) => (
// 					<div key={index} className={`${styles.table__body}`}>
// 						{arrColumnPopup.map(col => {
// 							if (col.name === '#') {
// 								return (
// 									<p key={col.id} className={styles.position}>
// 										{index + 1}
// 									</p>
// 								);
// 							} else if (col.name === 'Название') {
// 								return (
// 									<Input
// 										key={col.id}
// 										value={el.name || ''}
// 										onChange={e => handleInputChange(e, el)}
// 										type='text'
// 										style={{
// 											width: isMobile ? undefined : 'calc(377/1920*100vw)',
// 											backgroundColor: colors.white,
// 											overflow: 'hidden',
// 										}}
// 										styleInput={{ fontSize: '1rem' }}
// 									/>
// 								);
// 							} else if (col.name === 'Иконка' && showIcon) {
// 								return (
// 									<div
// 										key={col.id}
// 										className={styles.block__icons}
// 										style={{
// 											display: 'flex',
// 											justifyContent: 'center',
// 										}}
// 									>
// 										<svg
// 											className={styles.icon_svg}
// 											style={{ color: colors.grey }}
// 											onClick={() => handleOpenChoiceIcon(el)}
// 										>
// 											<use
// 												xlinkHref={`/images/icons/sprite.svg#${el.icon_name}`}
// 											></use>
// 										</svg>
// 										{viewIcon.id === el.id && viewIcon.isView && (
// 											<ChoiceIcon
// 												handleClose={handleCloseChoiceIcon}
// 												idListItem={el.id}
// 												onUpdate={onUpdate}
// 											/>
// 										)}
// 									</div>
// 								);
// 							} else if (col.name === 'Цвет' && showColor) {
// 								return (
// 									<div
// 										key={col.id}
// 										className={styles.block__icons}
// 										style={{
// 											display: 'flex',
// 											justifyContent: 'center',
// 										}}
// 									>
// 										<div
// 											className={styles.color}
// 											style={{
// 												backgroundColor: el.color,
// 												border: `1px solid ${colors.grey}`,
// 											}}
// 											onClick={() => handleOpenChoiceColor(el)}
// 										></div>
// 										{viewColor.id === el.id && viewColor.isView && (
// 											<ColorPicker
// 												color={el.color || colors.grey}
// 												onClick={handleCloseChoiceColor}
// 												handleColorChange={color =>
// 													onUpdate(el.id, 'color', color)
// 												}
// 											/>
// 										)}
// 									</div>
// 								);
// 							} else if (col.name === 'Действие') {
// 								return (
// 									<Button
// 										key={col.id}
// 										style={{ backgroundColor: 'transparent' }}
// 										onClick={() => handleDelete(el.id)}
// 									>
// 										<Image
// 											src='/images/icons/exit.svg'
// 											alt='exit'
// 											width={isMobile ? 14 : 8}
// 											height={isMobile ? 14 : 8}
// 										/>
// 									</Button>
// 								);
// 							} else {
// 								return null;
// 							}
// 						})}
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default UnifiedSettings;
