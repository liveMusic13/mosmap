import { FC, memo } from 'react';

import { useBurgerMenuStore } from '@/store/store';

import styles from './Burger.module.scss';

const Burger: FC = memo(() => {
	const { isBurgerMenu, setIsBurgerMenu } = useBurgerMenuStore(store => store);

	const onClick = () => setIsBurgerMenu(!isBurgerMenu);

	return (
		<div
			className={`${styles.burger} ${isBurgerMenu ? styles.active : ''}`}
			onClick={onClick}
		>
			<span className={styles.line}></span>
			<span className={styles.line}></span>
			<span className={styles.line}></span>
		</div>
	);
});

export default Burger;
