const express = require('express');
const date = require(__dirname + '/date.js');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const toDoActivities = [];
const workActivities = [];

app.get('/', (req, res) => {
	res.render('index', {
		currentDay: date.getDay(),
		toDoActivity: toDoActivities,
		toDoType: 'home',
	});
});

app.get('/work', (req, res) => {
	res.render('index', {
		currentDay: date.getDay() + '; Gotta work!',
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
