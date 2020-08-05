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
const toDoActivities = {
	home: [],
};
const homeActivities = toDoActivities['home'];

// Creating 'items' collection in mongodb through mongoose
const itemsSchema = { name: String, route: String };
const Item = mongoose.model('Item', itemsSchema);

// Finding all existing 'items' for each route from mongodb
Item.find((err, items) => {
	if (err) {
		console.log("Couldn't extract items");
	} else {
		items.forEach((item) => {
			if (item.route === 'home') {
				homeActivities.push(item);
			} else {
				toDoActivities[item.route] = [];
				toDoActivities[item.route].push(item);
			}
		});
	}
});

// Routing request to the root route
app.get('/', (req, res) => {
	res.render('index', {
		currentDay: date.getDay(),
		toDoActivity: homeActivities,
		toDoType: 'home',
	});
});

// Routing request to '/:url'
app.get('/:url', (req, res) => {
	const url = req.params.url;
	if (!toDoActivities.hasOwnProperty(url)) {
		toDoActivities[req.params.url] = [];
		console.log('not present');
	}

	res.render('index', {
		currentDay: date.getDay(),
		toDoActivity: toDoActivities[req.params.url],
		toDoType: url,
	});
});

// Using data from the form and saving to mongodb
app.post('/', (req, res) => {
	const toDoActivity = new Item({
		name: req.body.todo,
		route: req.body.button,
	});
	toDoActivity.save();

	if (toDoActivity.route === 'home') {
		homeActivities.push(toDoActivity);
		res.redirect('/');
	} else {
		toDoActivities[toDoActivity.route].push(toDoActivity);
		res.redirect(`/${toDoActivity.route}`);
	}
});

// Using data from the checkbox form to delete data
app.post('/delete', (req, res) => {
	const route = Object.keys(req.body)[0];
	const id = req.body[route];
	Item.deleteOne({ _id: id }, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Successfully deleted');
		}
	});

	for (let key in toDoActivities) {
		if (key === route) {
			toDoActivities[key].forEach((activity, index) => {
				if (activity['_id'] == id) {
					toDoActivities[key].splice(index, 1);
				}
			});
		}
	}

	res.redirect(`/${route}`);
});

// Listening to port 3000
app.listen(3000, () => console.log('Server started on port 3000.'));
