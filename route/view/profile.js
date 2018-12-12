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
	const UserFI = new UserModel(app.db_FI);
	const UserSE = new UserModel(app.db_SE);
	const UserNO = new UserModel(app.db_NO);
	const StockFI = new StockModel(app.db_FI);
	const StockSE = new StockModel(app.db_SE);
	const StockNO = new StockModel(app.db_NO);
	const ImageFI = new ImageModel(app.db_FI);
	const ImageSE = new ImageModel(app.db_SE);
	const ImageNO = new ImageModel(app.db_NO);

	router.use(middleware.isSignedIn);

	router.route('/profile')
		.get(async (req, res) => {
			let sales_FI = await StockFI.readAsSeller(req.session.user._id);
			let sales_SE = await StockSE.readAsSeller(req.session.user._id);
			let sales_NO = await StockNO.readAsSeller(req.session.user._id);
			console.log(sales_FI);
			return res.render('profile', {
				user: req.session.user,
				sales_FI, sales_SE, sales_NO
			});
		})
		.put(async (req, res) => {
			let { password } = req.body;
			password = crypto.createHash('md5').update(password).digest('hex');
			const data = Object.assign({}, req.body, { password });
			const result = await UserFI.update(req.session.user._id, data);
			await UserSE.update(req.session.user._id, data);
			await UserNO.update(req.session.user._id, data);
			req.session.user = result;
			return res.json({ success: true });
		});

	app.use(router);

};
