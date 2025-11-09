import Image from 'next/image';
import { ChangeEvent, FC, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';

import { IIconsSettingsProps } from '@/types/props.types';
import { IListItemsResponse } from '@/types/requestData.types';

import { useCheckWidth } from '@/hooks/useCheckWidth';

import styles from './IconsSettings.module.scss';
import ChoiceIcon from './choice-icon/ChoiceIcon';
import { colors } from '@/app.constants';
import { arrColumnPopup } from '@/data/database.data';

const IconsSettings: FC<IIconsSettingsProps> = ({
	isOnlyList,
	editListData,
	onUpdate,
	handleDelete,
}) => {
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const [viewIcon, setViewIcon] = useState<{
		id: number | null;
		isView: boolean;
	}>({ id: null, isView: false });

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		el: IListItemsResponse,
	) => {
		onUpdate(el.id, 'name', e.target.value);
	};
	const handleCloseChoiceIcon = () => setViewIcon({ id: null, isView: false });
	const handleOpenChoiceIcon = (el: IListItemsResponse) =>
		setViewIcon({ id: el.id, isView: true });

	console.log('editListData', editListData);

	const arrColumn = isOnlyList
		? arrColumnPopup.filter(el => el.name !== 'Иконка')
		: arrColumnPopup;

	return (
		<div
			className={`${styles.block__iconsSettings} ${isOnlyList ? styles.isOnlyList : ''}`}
		>
			<div className={styles.block__titles_table}>
				{arrColumn.map(el => (
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

			{editListData &&
				Array.isArray(editListData) &&
				editListData?.map((el, index) => (
					<div key={index} className={styles.table__body}>
						{arrColumn.map(col => {
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
											overflow: 'hidden',
											backgroundColor: colors.white,
										}}
										styleInput={{
											fontSize: '1rem',
										}}
									/>
								);
							} else if (col.name === 'Иконка') {
								return (
									<div key={col.id} className={styles.block__icons}>
										<svg
											className={styles.icon_svg}
											style={{
												color: colors.grey,
											}}
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

export default IconsSettings;
