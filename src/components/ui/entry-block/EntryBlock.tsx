'use client';

import Link from 'next/link';
import { ChangeEvent, FC, useEffect, useState } from 'react';

import { IEntryBlock } from '@/types/props.types';
import {
	INewpassData,
	IRegistrationData,
	IRestoreData,
} from '@/types/requestData.types';

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
	handleCallback,
	setIsLoading,
	mobile_link,
	mobile_title,
}) => {
	const isAuth = title_block === 'Авторизация';
	const isRegistr = title_block === 'Регистрация';
	const isRestore = title_block === 'Восстановление пароля';
	const isNewpass = title_block === 'Восстановление пароля '; //HELP: Ставлю пробел, т.к. тайтлы одинаковы, чтобы не менять способы сравнения у всех, добавлю просто пробел для различия строк с страницей /restore

	const {
		handleAuth,
		onChange,
		valueFields,
		handleRegistr,
		handleRestore,
		handleNewpass,
	} = useEntryAuth(formData);

	const isDisabledButton = isRegistr
		? valueFields['Логин'].value === '' ||
			valueFields['Пароль'].value === '' ||
			valueFields['Email'].value === ''
		: isRestore
			? valueFields['Логин'].value === '' || valueFields['Email'].value === ''
			: isNewpass
				? valueFields['Подтверждение пароля'].value === '' ||
					valueFields['Пароль'].value === '' ||
					valueFields['Пароль'].value !==
						valueFields['Подтверждение пароля'].value
				: valueFields['Логин'].value === '' ||
					valueFields['Пароль'].value === '';

	const [viewPass, setViewPass] = useState<boolean>(true);
	const [token, setToken] = useState<string>('');

	useEffect(() => {
		//HELP: Получаем полную строку запроса из URL
		const queryString = window.location.search;

		//HELP: Удаляем символ "?" в начале строки
		const token = queryString.startsWith('?')
			? queryString.slice(1)
			: queryString;

		if (token) {
			console.log('Токен:', token);
			//HELP: Здесь можно отправить токен на сервер или выполнить другие действия
			setToken(token);
		} else {
			console.log('Токен не найден в адресной строке');
		}
	}, []);

	const dataRegistr: IRegistrationData = {
		login: valueFields['Логин']?.value,
		password: valueFields['Пароль']?.value,
		email: valueFields['Email']?.value,
		mapname: valueFields['Название карты']?.value,
		descr: valueFields['Описание карты..']?.value,
	};
	const dataRestore = (): IRestoreData => {
		const result: IRestoreData = {};

		if (valueFields['Логин'].value) {
			result.login = valueFields['Логин'].value;
		}
		if (valueFields['Email'].value) {
			result.email = valueFields['Email'].value;
		}

		return result;
	};
	const dataNewPass: INewpassData = {
		password: valueFields['Пароль']?.value || '',
		token,
	};

	const handleChangeViewPass = (e: ChangeEvent<HTMLInputElement>) => {
		setViewPass(e.target.checked);
	};
	const handleViewPass = () => {
		setViewPass(!viewPass);
	};
	const onClickButton = async () => {
		try {
			if (setIsLoading) setIsLoading(true);
			if (isAuth) {
				const response = await handleAuth();
				if (handleCallback) handleCallback(response);
			} else if (isRestore) {
				const response = await handleRestore(dataRestore());
				if (handleCallback) handleCallback(response);
			} else if (isNewpass) {
				const response = await handleNewpass(dataNewPass);
				if (handleCallback) handleCallback(response);
			} else {
				const response = await handleRegistr(dataRegistr);
				if (handleCallback) handleCallback(response);
			}
		} catch (error) {
			console.error('Ошибка', error);
		} finally {
			if (setIsLoading) setIsLoading(false);
		}
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
								callback={
									(isRegistr || isNewpass) && isPass
										? handleViewPass
										: undefined
								}
								type={isPass ? controlType : el.type}
								placeholder={el.placeholder}
								srcImage={
									(isRegistr || isNewpass) && isPass
										? '/images/icons/eye.svg'
										: undefined
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
					disabled={isDisabledButton}
					style={{
						width: 'calc(450/1920*100vw)',
						height: 'calc(60/1920*100vw)',
						fontFamily: 'Open Sans',
						marginTop: isAuth ? 'calc(15/1920*100vw)' : '0px',
						boxShadow: `0px 0px 10px ${colors.green_light}`,
					}}
					onClick={onClickButton}
				>
					{isAuth
						? 'Войти'
						: isRestore
							? 'Восстановить'
							: isNewpass
								? 'Сменить пароль'
								: 'Зарегистрироваться'}
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
				{isRestore && (
					<>
						<p className={styles.isRegistr}>
							Уже зарегистрировались?{' '}
							<Link href={link_bot} className={styles.link}>
								{title_bot}
							</Link>
						</p>
						<p className={styles.description}>
							Укажите логин и Email, с которого вы регистрировались. На этот
							адрес придет письмо с ссылкой на сброс пароля
						</p>
					</>
				)}
			</div>
			<Link
				href={mobile_link}
				className={`${styles.link} ${styles.link_mobile}`}
			>
				{mobile_title}
			</Link>
		</div>
	);
};

export default EntryBlock;
