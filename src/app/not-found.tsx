import { cookies } from 'next/headers';

export default async function NotFoundPage() {
	const cookieStore = cookies();
	const mapParam = (await cookieStore).get('map')?.value || null;
	const link = `/?map=${mapParam}`;

	return (
		<div>
			<h1>Страница не найдена</h1>
			<p>
				Попробуйте вернуться <a href={link}>на главную</a>.
			</p>
		</div>
	);
}
