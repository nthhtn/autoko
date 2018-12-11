import express from 'express';
import crypto from 'crypto';
import UserModel from '../../model/user';
import PreferenceModel from '../../model/user';
import ManufacturerModel from '../../model/car_manufacturer';
import ModelModel from '../../model/car_model';
import StockModel from '../../model/car_stock';
import ImageModel from '../../model/car_image';
import middleware from '../../lib/middleware';
import Promise from 'bluebird';

module.exports = (app) => {

	const router = express.Router();

	router.route('/')
		.get(async (req, res) => {
			const sort = { date_posted: -1 };
			const limit = 9;
			const page = req.query.page || 1;
			const Stock = new StockModel(req._db);
			const Image = new ImageModel(req._db);
			let cars = await Stock.queryByFields({}, sort, limit, limit * (page - 1));
			const count = await Stock.countByFields({});
			const has_more = count > limit * (page - 1) + cars.length;
			Promise.map(cars, async (car) => {
				const images = await Image.queryByFields({ car_id: car._id });
				car.avatar = images[0].filename;
			}).then(() => res.render('index', {
				user: req.session.user, cars, count, has_more, page,
				country: req.query.country || req.ipInfo.country
			}));
		});

	router.route('/signin')
		.get(async (req, res) => res.render('signin'))
		.post(async (req, res) => {
			const User = new UserModel(req._db);
			const Preference = new PreferenceModel(req._db);
			// kvine4@last.fm
			const { email, password } = req.body;
			const result = await User.queryByFields({ email });
			if (!result) {
				return res.status(400).json({ success: false, error: 'Non-registered user' });
			}
			if (result[0].password !== crypto.createHash('md5').update(password).digest('hex')) {
				return res.status(400).json({ success: false, error: 'Wrong password' });
			}
			req.session.user = result[0];
			return res.json({ success: true });
		});

	router.route('/signout')
		.get(middleware.isSignedIn, async (req, res, next) => {
			req.session.destroy((err) => {
				return res.redirect('/');
			});
		});

	router.route('/car/:id')
		.get(async (req, res, next) => {
			const Stock = new StockModel(req._db);
			const Manufacturer = new ManufacturerModel(req._db);
			const Model = new ModelModel(req._db);
			const Image = new ImageModel(req._db);
			const User = new UserModel(req._db);
			const car = await Stock.read(req.params.id);
			const images = await Image.queryByFields({ car_id: req.params.id });
			const manufacturer = await Manufacturer.read(car.manufacturer_id);
			const model = await Model.read(car.model_id);
			const seller = await User.read(car.seller_id);
			return res.render('detail', { user: req.session.user, car, images, manufacturer, model, seller });
		});

	app.use(router);

};
