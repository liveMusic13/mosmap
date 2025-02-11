//HELP: форматирование даты из формата YYYYMMDD в DDMMYYYY
export const formatDateForDisplay = (dateString: string) => {
	const [year, month, day] = dateString.split('-');
	return `${day}-${month}-${year}`;
};
