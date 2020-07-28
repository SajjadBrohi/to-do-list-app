exports.getDay = () => {
	const daysArray = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];

	const date = new Date();
	return daysArray[date.getDay()];
};
