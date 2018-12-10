import express from 'express';
import UserModel from '../../model/user';
import PreferenceModel from '../../model/user';
import ManufacturerModel from '../../model/car_manufacturer';
import ModelModel from '../../model/car_model';
import StockModel from '../../model/car_stock';
import ImageModel from '../../model/car_image';
import Promise from 'bluebird';

module.exports = (app) => {

	const router = express.Router();

	router.route('/search')
		.get(async (req, res) => {
			return res.render('search', { user: req.session.user });
		});

	app.use(router);

};
