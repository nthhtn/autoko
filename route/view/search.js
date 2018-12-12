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
				if (filter.price_to != undefined) { fields.price['$lte'] = parseFloat(filter.price_to); }
				if (filter.price_from != undefined) { fields.price['$gte'] = parseFloat(filter.price_from); }
			};
			if (filter.engine_to != undefined || filter.engine_from != undefined) {
				fields.engine = {};
				if (filter.engine_to != undefined) { fields.engine['$lte'] = parseInt(filter.engine_to); }
				if (filter.engine_from != undefined) { fields.engine['$gte'] = parseInt(filter.engine_from); }
			};
			if (filter.cylinder_to != undefined || filter.cylinder_from != undefined) {
				fields.cylinder = {};
				if (filter.cylinder_to != undefined) { fields.cylinder['$lte'] = parseInt(filter.cylinder_to); }
				if (filter.cylinder_from != undefined) { fields.cylinder['$gte'] = parseInt(filter.cylinder_from); }
			};
			if (filter.power_to != undefined || filter.power_from != undefined) {
				fields.power = {};
				if (filter.power_to != undefined) { fields.power['$lte'] = parseInt(filter.power_to); }
				if (filter.power_from != undefined) { fields.power['$gte'] = parseInt(filter.power_from); }
			};
			if (filter.color) { fields.color = filter.color; }
			fields.purchase_status = 'available';
			const Stock = new StockModel(req._db);
			const Image = new ImageModel(req._db);
			let cars = await Stock.lookup(fields, filter.keyword);
			Promise.map(cars, async (car) => {
				const images = await Image.queryByFields({ car_id: car._id });
				car.avatar = images[0].filename;
			}).then(() => res.render('search', {
				user: req.session.user, cars,
				country: req.query.country || req.ipInfo.country
			}));
		});

	app.use(router);

};
