import mongodb from 'mongodb';
import mongo_url from '../config/mongo';

const MongoClient = mongodb.MongoClient;

module.exports.dbRouting = async (req, res, next) => {
	const country = req.ipInfo.country;
	console.log(req.ipInfo);
	const db_name = mongo_url[country];
	const client = await MongoClient.connect(db_name, { useNewUrlParser: true });
	req._db = client.db(db_name.split('/')[3]);
	return next();
};

module.exports.isSignedIn = async (req, res, next) => {
	return req.session.user ? next() : res.redirect('/signin');
};
