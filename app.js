const express = require('express');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost/todolistDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Initialising the array constants to be used in storing the activities
const toDoActivities = [];
const workActivities = [];

// Creating 'items' collection in mongodb through mongoose
const itemsSchema = { name: String };
const Item = mongoose.model('Item', itemsSchema);

// Finding all existing 'items' from mongodb
Item.find((err, items) => {
	if (err) {
		console.log("Couldn't extract items");
	} else {
		items.forEach((item) => toDoActivities.push(item));
	}
});

// Routing request to the root directory
app.get('/', (req, res) => {
	res.render('index', {
		currentDay: date.getDay(),
		toDoActivity: toDoActivities,
		toDoType: 'home',
	});
});

// Routing request to '/work'
app.get('/work', (req, res) => {
	res.render('index', {
		currentDay: date.getDay() + '; Gotta work!',
		toDoActivity: workActivities,
		toDoType: 'work',
	});
});

// Using data from the form and saving to mongodb
app.post('/', (req, res) => {
	const toDoActivity = new Item({ name: req.body.todo });
	toDoActivity.save();

	if (req.body.button === 'home') {
		toDoActivities.push(toDoActivity);
		res.redirect('/');
	} else {
		workActivities.push(toDoActivity);
		res.redirect('/work');
	}
});

// Using data from the checkbox form to delete data
app.post('/delete', (req, res) => {
	const item = Object.keys(req.body)[0];
	Item.deleteOne({ name: item }, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Successfully deleted');
		}
	});

	toDoActivities.forEach((activity, index) => {
		if (activity.name === item) {
			toDoActivities.splice(index, 1);
		}
	});

	res.redirect('/');
});

// Listening to port 3000
app.listen(3000, () => console.log('Server started on port 3000.'));
