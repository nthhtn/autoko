import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { ObjectID } from 'mongodb';
import middleware from '../../lib/middleware';
import ModelModel from '../../model/car_model';
import StockModel from '../../model/car_stock';
import ImageModel from '../../model/car_image';

module.exports = (app) => {

	const router = express.Router();
	const storage = multer.diskStorage({
		destination: (req, file, callback) => callback(null, 'static/uploads/'),
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
		.get(async (req, res) => res.render('sell', { user: req.session.user, country: req.session.country }))
		.post(upload, async (req, res) => {
			let { manufacturer_id, model_id, name, color, price, address, city, country, registration_year, description,
				model_name, fuel, engine, power, year, transmission, cylinder } = req.body;
			if (!model_id) {
				model_id = new ObjectID().toString();
				const newmodel = Object.assign({}, {
					_id: model_id,
					name: model_name,
					power: parseInt(power),
					engine: parseInt(engine),
					cylinder: parseInt(cylinder),
					year: parseInt(year),
					fuel, transmission, manufacturer_id
				});
				await ModelFI.create(newmodel);
				await ModelSE.create(newmodel);
				await ModelNO.create(newmodel);
			}
			let item_id = new ObjectID().toString();
			let data = Object.assign({}, {
				_id: item_id,
				name, manufacturer_id, model_id, color, address, city, country, description,
				price: parseFloat(price),
				registration_year: parseInt(registration_year),
				seller_id: req.session.user._id,
				purchase_status: false,
				date_posted: Date.now()
			});
			const Stock = new StockModel(req._db);
			await Stock.create(data);
			const Image = new ImageModel(req._db);
			const image_list = req.files.map((file) => ({
				_id: new ObjectID().toString(),
				car_id: item_id,
				filename: file.filename
			}));
			await Image.createMany(image_list);
			res.json({ success: true, result: data });
		});

	app.use(router);

};
