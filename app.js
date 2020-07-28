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
	// Compiler reaches here first, sees that there
	// is no variable so gives error. So you will have
	// to define your variables here in order to not
	// get an error
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

	// We set an ejs variable on the button which is passed whenever we do
	// res.render in the above app.get methods. So here we use that value
	// to find where the request is coming from, and then process it accordingly
	if (req.body.button === 'home') {
		toDoActivities.push(toDoActivity);
		res.redirect('/');
	} else {
		workActivities.push(toDoActivity);
		res.redirect('/work');
	}
});

app.listen(3000, () => console.log('Server started on port 3000.'));
