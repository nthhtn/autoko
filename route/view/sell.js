import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { ObjectID } from 'mongodb';
import middleware from '../../lib/middleware';
import ModelModel from '../../model/car_model';
import StockModel from '../../model/car_stock';

module.exports = (app) => {

	const router = express.Router();
	const storage = multer.diskStorage({
		destination: (req, file, callback) => callback(null, 'uploads/'),
		filename: (req, file, callback) => {
			const name = `${file.originalname}_${Date.now}`;
			const newname = `${crypto.createHash('md5').update(name).digest('hex')}.${file.mimetype.split('/')[1]}`;
			return callback(null, newname);
		}
	});
	const upload = multer({
		storage,
		limits: { fileSize: '50mb' }
	}).array('car_images');
	const ModelFI = new ModelModel(app.db_FI);
	const ModelSE = new ModelModel(app.db_SE);
	const ModelNO = new ModelModel(app.db_NO);

	router.use(middleware.isSignedIn);

	router.route('/sell')
		.get(async (req, res) => res.render('sell', { user: req.session.user }))
		.post(upload, async (req, res) => {
			console.log(req.files);
			console.log(req.body);
			let { manufacturer_id, model_id, color, price, address, city, country, registration_year, description,
				model_name, fuel, engine, power, year, transmission, cylinder } = req.body;
			if (!req.body.model_id) {
				model_id = new ObjectID().toString();
				const model = Object.assign({
					_id: model_id,
					name: model_name,
					power: parseInt(power),
					engine: parseInt(engine),
					cylinder: paseInt(cylinder),
					year: parseInt(year),
					fuel, transmission, manufacturer_id
				});
				await ModelFI.create(model);
				await ModelSE.create(model);
				await ModelNO.create(model);
			}
			let item_id = new ObjectID().toString();
			let data = Object.assign({}, {
				_id: item_id,
				manufacturer_id, model_id, color, price, address, city, country, description,
				registration_year: parseInt(registration_year),
				seller_id: req.session.user._id,
				purchase_status: false,
				date_posted: Date.now()
			});
			const Stock = new StockModel(req._db);
			await Stock.create(data);
			res.json({ success: true, result: data });
		});

	app.use(router);

};
