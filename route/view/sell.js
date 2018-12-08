import express from 'express';
import multer from 'multer';
import mongodb from 'mongodb';
import mongo_url from '../../config/mongo';
import middleware from '../../lib/middleware';

module.exports = (app) => {

	const router = express.Router();
	const upload = multer({
		dest: 'uploads/',
		limits: { fileSize: '50mb' }
	});
	const MongoClient = mongodb.MongoClient;

	router.use(middleware.isSignedIn);

	router.route('/sell')
		.get(async (req, res) => res.render('sell', { user: req.session.user }))
		.post(upload.array('car-images'), async (req, res) => {
			console.log(req.files);
			res.json({ success: true });
		});

	app.use(router);

};
