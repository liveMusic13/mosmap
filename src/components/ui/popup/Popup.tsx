import { FC } from 'react';

import { IPopup } from '@/types/props.types';

import Button from '../button/Button';

import styles from './Popup.module.scss';
import { colors } from '@/app.constants';

const Popup: FC<IPopup> = ({
	message,
	functions,
	isHtmlMessage,
	isConfirm,
	soloButtonText = 'Закрыть',
	confirmButtonText = 'Подтвердить',
	cancelButtonText = 'Отменить',
}) => {
	console.log('isConfirm', isConfirm);
	return (
		<div className={styles.block__popup}>
			{isHtmlMessage ? (
				<p dangerouslySetInnerHTML={{ __html: message }}></p>
			) : (
				<p>{message}</p>
			)}
			{isConfirm ? (
				<div className={styles.block__buttons}>
					<Button
						style={{
							width: 'calc(170/1920*100vw)',
							height: 'calc(40/1920*100vw)',
							boxShadow: `0px 0px 10px ${colors.green_light}`,
							color: colors.white,
							fontSize: '1.14rem',
						}}
						onClick={functions?.confirm}
					>
						{confirmButtonText}
					</Button>
					<Button
						style={{
							width: 'calc(170/1920*100vw)',
							height: 'calc(40/1920*100vw)',
							boxShadow: `0px 0px 10px ${colors.green_light}`,
							backgroundColor: 'transparent',
							color: colors.red,
							fontSize: '1.14rem',
						}}
						onClick={functions?.cancel}
					>
						{cancelButtonText}
					</Button>
				</div>
			) : (
				<Button
					style={{
						width: 'calc(170/1920*100vw)',
						height: 'calc(40/1920*100vw)',
						boxShadow: `0px 0px 10px ${colors.green_light}`,
						backgroundColor: colors.white,
						color: colors.green,
						fontSize: '1.14rem',
					}}
					onClick={functions?.onClick}
				>
					{soloButtonText}
				</Button>
			)}
		</div>
	);
};

export default Popup;
