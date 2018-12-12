import express from 'express';
import crypto from 'crypto';
import StockModel from '../../model/car_manufacturer';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();

	router.route('/car_stocks')
		.get(async (req, res) => {
			const Stock = new StockModel(req._db);
			const list = await Stock.queryByFields({});
			return res.json({ success: true, result: list });
		});

	app.use('/api', router);

};
