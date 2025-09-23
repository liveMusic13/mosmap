// import { cookies } from 'next/headers';
// export default async function NotFoundPage() {
// 	const cookieStore = cookies();
// 	const mapParam = (await cookieStore).get('map')?.value || null;
// 	const link = `/?map=${mapParam}`;
// 	return (
// 		<div>
// 			<h1>Страница не найдена</h1>
// 			<p>
// 				Попробуйте вернуться <a href={link}>на главную</a>.
// 			</p>
// 		</div>
// 	);
// }
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<h2 className='text-2xl font-bold mb-4'>Страница не найдена</h2>
			<p className='mb-4'>К сожалению, запрашиваемая страница не существует.</p>
			<Link
				href='/'
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
			>
				Вернуться на главную
			</Link>
		</div>
	);
}
