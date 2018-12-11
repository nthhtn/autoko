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
			const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
			let fields = Object.assign({});
			if (filter.price_to != undefined || filter.price_from != undefined) {
				fields.price = {};
				if (filter.price_to != undefined) { fields.price['$lte'] = parseFloat(filter.price_to) }
				if (filter.price_from != undefined) { fields.price['$gte'] = parseFloat(filter.price_from) }
			};
			const Stock = new StockModel(req._db);
			const Image = new ImageModel(req._db);
			let cars = await Stock.lookup(fields, filter.keyword);
			Promise.map(cars, async (car) => {
				const images = await Image.queryByFields({ car_id: car._id });
				car.avatar = images[0].filename;
			}).then(() => res.render('search', { user: req.session.user, cars }));
		});

	app.use(router);

};
