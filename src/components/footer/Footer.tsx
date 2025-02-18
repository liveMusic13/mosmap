import Link from 'next/link';
import { FC } from 'react';

import { IFooter } from '@/types/props.types';

import Line from '../ui/line/Line';

import styles from './Footer.module.scss';
import { colors } from '@/app.constants';
import { arrMenuFooter } from '@/data/footer.data';

const Footer: FC<IFooter> = ({ style }) => {
	return (
		<footer className={styles.footer} style={style}>
			<div className={styles.block__one}>
				<div className={styles.block__title}>
					<h2 className={styles.title}>mosmap</h2>
					<Line style={{ backgroundColor: colors.white }} />
					<h2 className={styles.title__two}>геоаналитика</h2>
				</div>
				<div className={styles.block__menu}>
					{arrMenuFooter.map(el => (
						<Link
							key={el.id}
							href={el.link ? el.link : ''}
							className={styles.link}
						>
							{el.title}
						</Link>
					))}
				</div>
				<div className={styles.block__contacts}>
					<a href='tel:+74955326373' className={styles.contact}>
						+7(495)532-6373
					</a>
					<a href='mailto:mosmap@mosmap.ru' className={styles.contact}>
						mosmap@mosmap.ru
					</a>
				</div>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__two}>
				<p className={styles.paragraph}>Copyright © 2023 - ООО "МСМП"</p>
				<p className={styles.paragraph}>Политика конфиденциальности</p>
			</div>
		</footer>
	);
};

export default Footer;
