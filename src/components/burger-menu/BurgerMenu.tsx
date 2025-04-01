import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';

import styles from './BurgerMenu.module.scss';
import { arrMenuHeader } from '@/data/header.data';

const BurgerMenu: FC = () => {
	const [isViewOptions, setIsViewOptions] = useState(false);

	const onClick = () => setIsViewOptions(!isViewOptions);

	return (
		<div className={styles.wrapper_burgerMenu}>
			{arrMenuHeader.map(el => {
				if (el.type === 'button') {
					return null;
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
							<div className={styles.title__options}>
								<p className={styles.menu__links} onClick={onClick}>
									{el.title}
								</p>
								<Image
									src={'/images/icons/arrow.svg'}
									alt='arrow'
									width={8}
									height={6}
									className={styles.image_arrow}
								/>
							</div>
							<div className={styles.menu__options}>
								{isViewOptions &&
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
	);
};

export default BurgerMenu;
