import { FC } from 'react';

import { IPopup } from '@/types/props.types';

import Button from '../button/Button';

import styles from './Popup.module.scss';
import { colors } from '@/app.constants';

const Popup: FC<IPopup> = ({ message, onClick, isHtmlMessage }) => {
	return (
		<div className={styles.block__popup}>
			{isHtmlMessage ? (
				<p dangerouslySetInnerHTML={{ __html: message }}></p>
			) : (
				<p>{message}</p>
			)}
			<Button
				style={{
					width: 'calc(170/1920*100vw)',
					height: 'calc(40/1920*100vw)',
					boxShadow: `0px 0px 10px ${colors.green_light}`,
					backgroundColor: colors.white,
					color: colors.green,
					fontSize: '1.14rem',
				}}
				onClick={onClick}
			>
				Закрыть
			</Button>
		</div>
	);
};

export default Popup;
