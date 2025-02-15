'use client';

import Link from 'next/link';
import { ChangeEvent, FC, useState } from 'react';

import { IEntryBlock } from '@/types/props.types';
import { IRegistrationData } from '@/types/requestData.types';

import { useEntryAuth } from '@/hooks/useEntryAuth';

import Button from '../button/Button';
import Checkbox from '../checkbox/Checkbox';
import Input from '../input/Input';
import Textarea from '../textarea/Textarea';

import styles from './EntryBlock.module.scss';
import { colors } from '@/app.constants';

const EntryBlock: FC<IEntryBlock> = ({
	formData,
	title,
	title_link,
	title_bot,
	link_bot,
	title_block,
}) => {
	const isAuth = title_block === 'Авторизация';
	const isRegistr = title_block === 'Регистрация';

	const { handleAuth, onChange, valueFields, handleRegistr } =
		useEntryAuth(formData);

	const [viewPass, setViewPass] = useState(true);

	const dataRegistr: IRegistrationData = {
		login: valueFields['Логин']?.value,
		password: valueFields['Пароль']?.value,
		email: valueFields['Email']?.value,
		mapname: valueFields['Название карты']?.value,
		descr: valueFields['Описание карты..']?.value,
	};

	const handleChangeViewPass = (e: ChangeEvent<HTMLInputElement>) => {
		setViewPass(e.target.checked);
	};
	const handleViewPass = () => {
		setViewPass(!viewPass);
	};

	return (
		<div className={styles.wrapper_entryBlock}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>{title_block}</h2>
				<Link href={title_link} className={styles.link}>
					{title}
				</Link>
			</div>
			<div className={styles.line}></div>
			<div className={styles.form}>
				{formData.map(el => {
					const isPass = el.type === 'password';
					const controlType = viewPass ? 'password' : 'text';
					if (el.placeholder === 'Описание карты..') {
						return (
							<Textarea
								key={el.id}
								value={valueFields[el.placeholder].value}
								onChange={e =>
									onChange(e as ChangeEvent<HTMLInputElement>, el.placeholder)
								}
								placeholder={el.placeholder}
							/>
						);
					} else {
						return (
							<Input
								key={el.id}
								value={valueFields[el.placeholder].value}
								onChange={e => onChange(e, el.placeholder)}
								callback={isRegistr && isPass ? handleViewPass : undefined}
								type={isPass ? controlType : el.type}
								placeholder={el.placeholder}
								srcImage={
									isRegistr && isPass ? '/images/icons/eye.svg' : undefined
								}
								widthImage={25}
								heightImage={25}
								styleImage={{
									width: 'calc(25/1920*100vw)',
									height: 'calc(25/1920*100vw)',
								}}
								style={{
									height: 'calc(60/1920*100vw)',
									border: 'none',
									backgroundColor: colors.white,
								}}
								styleInput={{
									width: isRegistr && isPass ? '93%' : '100%',
									fontFamily: 'Ubuntu, serif',
									fontSize: '1.42rem',
								}}
							/>
						);
					}
				})}
				{isAuth && (
					<div className={styles.block__view_password}>
						<Checkbox
							value=''
							checked={viewPass}
							onChange={handleChangeViewPass}
							label='Показать пароль'
							styleLabel={{
								display: 'flex',
								alignItems: 'center',
							}}
						/>
						<Link href={link_bot} className={styles.link_bot}>
							{title_bot}
						</Link>
					</div>
				)}
				<Button
					style={{
						width: 'calc(450/1920*100vw)',
						height: 'calc(60/1920*100vw)',
						fontFamily: 'Open Sans',
						marginTop: isAuth ? 'calc(15/1920*100vw)' : '0px',
						boxShadow: `0px 0px 10px ${colors.green_light}`,
					}}
					onClick={() => (isAuth ? handleAuth() : handleRegistr(dataRegistr))}
				>
					{isAuth ? 'Войти' : 'Зарегистрироваться'}
				</Button>
				{isRegistr && (
					<>
						<p className={styles.isRegistr}>
							Уже зарегистрировались?{' '}
							<Link href={link_bot} className={styles.link}>
								{title_bot}
							</Link>
						</p>
						<p className={styles.description}>
							После регистрации на указанный вами Email придет письмо с
							подтверждением регистрации. Вам необходимо будет перейти по ссылке
							внутри письма
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default EntryBlock;
