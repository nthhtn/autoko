import express from 'express';
import crypto from 'crypto';
import ModelModel from '../../model/car_model';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();

	router.route('/car_models')
		.get(async (req, res) => {
			const Model = new ModelModel(req._db);
			const list = await Model.queryByFields(req.query);
			return res.json({ success: true, result: list });
		});

	router.route('/car_model/:id')
		.get(async (req, res) => {
			const Model = new ModelModel(req._db);
			const item = await Model.read(req.params.id);
			return res.json({ success: true, result: item });
		});

	app.use('/api', router);

};
