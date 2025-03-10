import { FC } from 'react';

import { ILayout } from '@/types/props.types';

import styles from './Layout.module.scss';

const Layout: FC<ILayout> = ({ children, style }) => {
	return (
		<div className={styles.wrapper} style={style}>
			{children}
		</div>
	);
};

export default Layout;
