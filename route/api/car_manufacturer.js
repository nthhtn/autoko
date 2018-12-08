import express from 'express';
import crypto from 'crypto';
import ManufacturerModel from '../../model/car_manufacturer';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();

	router.route('/car_manufacturers')
		.get(async (req, res) => {
			const Manufacturer = new ManufacturerModel(req._db);
			const list = await Manufacturer.queryByFields({});
			return res.json({ success: true, result: list });
		});

	app.use('/api', router);

};
