import express from 'express';
import mongodb from 'mongodb';
import mongo_url from '../../config/mongo';

module.exports = (app) => {

	const router = express.Router();

	router.route('/search')
		.get(async (req, res) => {
			return res.render('search', {});
		});

	app.use(router);

};
