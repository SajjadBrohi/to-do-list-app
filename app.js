const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const toDoActivities = [];
const workActivities = [];

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

	res.render('index', {
		currentDay: day,
		toDoActivity: toDoActivities,
		toDoType: 'home',
	});
	// Compiler reaches here first, sees that there
	// is no variable so gives error. So you will have
	// to define your variables here in order to not
	// get an error
});

app.get('/work', (req, res) => {
	res.render('index', {
		currentDay: 'Work',
		toDoActivity: workActivities,
		toDoType: 'work',
	});
});

app.post('/', (req, res) => {
	const toDoActivity = req.body.todo;

	if (req.body.button === 'home') {
		toDoActivities.push(toDoActivity);
		res.redirect('/');
	} else {
		workActivities.push(toDoActivity);
		res.redirect('/work');
	}
});

app.listen(3000, () => console.log('Server started on port 3000.'));
