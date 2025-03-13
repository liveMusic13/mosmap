import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import Loader from '@/components/ui/loader/Loader';

export default function Loading() {
	return (
		<>
			<BackgroundOpacity />
			<Loader
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 'calc(150/1920*100vw)',
					height: 'calc(150/1920*100vw)',
				}}
			/>
		</>
	);
}
