const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore');

const app = express();
app.use(morgan('common'));
app.use(cors());

app.get('/apps', (req, res) => {
	const { search = '', sort, genres } = req.query;
	const options = {
		sort: ['Rating', 'App'],
		genres: ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
	};

	if (sort)
		if (!options.sort.includes(sort))
			res.status(400).send(`Sort must be one of ${options.sort.join(' or ')}`);
	if (genres)
		if (!options.genres.includes(genres))
			res
				.status(400)
				.send(`Genres must be one of ${options.genres.join(', ')}`);

	let results = playstore.filter(app =>
		app.App.toLowerCase().includes(search.toLowerCase())
	);

	if (sort) {
		results.sort((a, b) => {
			return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
		});
	}
	if (genres) {
		results = results.filter(app => app.Genres.includes(genres));
	}

	res.json(results);
});

module.exports = app;
