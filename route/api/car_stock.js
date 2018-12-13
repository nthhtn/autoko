import express from 'express';
import crypto from 'crypto';
import StockModel from '../../model/car_stock';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();

	router.route('/car_stock/:id')
		.put(async (req, res) => {
			const Stock = new StockModel(req._db);
			await Stock.update(req.params.id, req.body);
			return res.json({ success: true });
		});

	app.use('/api', router);

};
