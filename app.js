const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
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
	const day = daysArray[date.getDay()];

	res.render('index', { currentDay: day });
});

app.listen(3000, () => console.log('Server started on port 3000.'));
