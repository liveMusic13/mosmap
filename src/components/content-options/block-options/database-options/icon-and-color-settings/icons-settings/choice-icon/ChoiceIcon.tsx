import Image from 'next/image';
import { FC, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/loader/Loader';

import { IChoiceIconProps } from '@/types/props.types';

import { useGetDatabaseSettings } from '@/hooks/useGetDatabaseSettings';

import styles from './ChoiceIcon.module.scss';
import { colors } from '@/app.constants';

const ChoiceIcon: FC<IChoiceIconProps> = ({
	handleClose,
	idListItem,
	onUpdate,
}) => {
	const [choiceIcon, setChoiceIcon] = useState<string>('');
	const { query_icons } = useGetDatabaseSettings();

	const addIcon = (el: string) => setChoiceIcon(el);
	const saveIcon = () => {
		handleClose();
		if (choiceIcon) onUpdate(idListItem, 'icon_name', choiceIcon);
	};

	return (
		<div className={styles.block__choiceIcon}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>Иконка</h2>
				<Button
					onClick={handleClose}
					style={{ backgroundColor: 'transparent' }}
				>
					<Image
						src='/images/icons/exit.svg'
						alt='exit'
						width={14}
						height={14}
					/>
				</Button>
			</div>
			<div className={styles.block__icons}>
				{query_icons.isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
				{query_icons.isSuccess &&
					(query_icons.data as string[]).map((el, ind) => (
						<svg
							key={ind}
							className={styles.icon_svg}
							style={{
								color: colors.black,
							}}
							onClick={() => addIcon(el)}
						>
							<use xlinkHref={`/images/icons/sprite.svg#${el}`}></use>
						</svg>
					))}
			</div>
			<Button onClick={saveIcon}>Сохранить</Button>
		</div>
	);
};

export default ChoiceIcon;
