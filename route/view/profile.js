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
			let buys_FI = await StockFI.readAsBuyer(req.session.user._id);
			let buys_SE = await StockSE.readAsBuyer(req.session.user._id);
			let buys_NO = await StockNO.readAsBuyer(req.session.user._id);
			const sales = sales_FI.concat(sales_SE).concat(sales_NO)
			const buys = buys_FI.concat(buys_SE).concat(buys_NO);
			return res.render('profile', {
				user: req.session.user,
				sales, buys
			});
		})
		.put(async (req, res) => {
			let { password, confirm } = req.body;
			if (crypto.createHash('md5').update(confirm).digest('hex') !== req.session.user.password) {
				return res.status(400).json({ success: false, error: 'Wrong password' });
			}
			password = password == '' ? req.session.user.password : crypto.createHash('md5').update(password).digest('hex');
			const data = Object.assign({}, req.body, { password });
			const result = await UserFI.update(req.session.user._id, data);
			await UserSE.update(req.session.user._id, data);
			await UserNO.update(req.session.user._id, data);
			req.session.user = result;
			return res.json({ success: true });
		});

	app.use(router);

};
