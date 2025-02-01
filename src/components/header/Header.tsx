'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { useMenuDropdown } from '@/hooks/useMenuDropdown';

import Button from '../ui/button/Button';
import Line from '../ui/line/Line';

import styles from './Header.module.scss';
import { colors } from '@/app.constants';
import { arrMenuHeader } from '@/data/header.data';

const Header: FC<any> = ({ dataMap }) => {
	const {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
		handleMenuEnter,
		handleMenuLeave,
	} = useMenuDropdown();

	return (
		<header className={styles.header}>
			<div className={styles.block__logo}>
				<Image
					src={'/images/icons/logo.svg'}
					alt='logo'
					width={178} //HELP: минимальный размер для оптимизации
					height={39} //HELP: должен быть в тех же пропорциях, что и изображение
					className={styles.image_logo}
					priority={true} //HELP: чтобы первым отрисовывалось
				/>
				<Line style={{ backgroundColor: colors.black_hard }} />
				<h1 className={styles.title}>геоаналитика</h1>
			</div>
			<div className={styles.block__menu}>
				{arrMenuHeader.map(el => {
					if (el.type === 'button') {
						return (
							<Button
								key={el.id}
								style={{
									width: 'calc(86/1920*100vw)',
									height: 'calc(39/1920*100vw)',
									border: `1px solid ${colors.green}`,
									color: colors.green,
									backgroundColor: 'transparent',
									fontWeight: '600',
									fontSize: '1.14rem',
								}}
							>
								{el.title}
							</Button>
						);
					} else if (el.type === 'link') {
						return (
							<Link
								key={el.id}
								href={el.link ? el.link : ''}
								className={styles.link}
							>
								{el.title}
							</Link>
						);
					} else {
						return (
							<div key={el.id} className={styles.block__menu_links}>
								<p
									className={styles.menu__links}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
								>
									{el.title}
								</p>
								<Image
									src={'/images/icons/arrow.svg'}
									alt='arrow'
									width={8}
									height={6}
									className={styles.image_arrow}
								/>
								<div
									className={styles.menu__options}
									onMouseEnter={handleMenuEnter}
									onMouseLeave={handleMenuLeave}
								>
									{isHovered &&
										el.options?.map(opt => (
											<Link
												key={opt.id}
												href={opt.href}
												className={styles.link_option}
											>
												{opt.title}
											</Link>
										))}
								</div>
							</div>
						);
					}
				})}
			</div>
		</header>
	);
};

export default Header;
