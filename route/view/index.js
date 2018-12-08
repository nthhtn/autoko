import express from 'express';
import crypto from 'crypto';
import UserModel from '../../model/user';
import UserPreferenceModel from '../../model/user';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();

	router.route('/')
		.get(async (req, res) => res.render('index', { user: req.session.user }));

	router.route('/signin')
		.get(async (req, res) => res.render('signin'))
		.post(async (req, res) => {
			const User = new UserModel(req._db);
			const UserPreference = new UserPreferenceModel(req._db);
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

	router.route('/car')
		.get(async (req, res, next) => {
			return res.render('detail', { user: req.session.user });
		});

	app.use(router);

};
