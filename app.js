import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressip from 'express-ip';
import { MongoClient } from 'mongodb';
import mongo_url from './config/mongo';

const app = express();

app.use(session({
	secret: 'autoko',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressip().getIpInfoMiddleware);

app.use(express.static(`${__dirname}/static`));

app.set('view engine', 'ejs');
app.set('views', './view');

app.use(morgan('dev'));

// require('./lib/sample')();

MongoClient.connect(mongo_url.FI, { useNewUrlParser: true }, async (err, client_FI) => {
	const db_FI = await client_FI.db(mongo_url.FI.split('/')[3]);
	const client_SE = await MongoClient.connect(mongo_url.SE, { useNewUrlParser: true });
	const db_SE = await client_SE.db(mongo_url.SE.split('/')[3]);
	const client_NO = await MongoClient.connect(mongo_url.NO, { useNewUrlParser: true });
	const db_NO = await client_NO.db(mongo_url.NO.split('/')[3]);
	app.db_FI = db_FI;
	app.db_SE = db_SE;
	app.db_NO = db_NO;
	require('./lib/db_routing')(app);
	require('./route/api/car_manufacturer')(app);
	require('./route/api/car_model')(app);
	require('./route/view/index')(app);
	require('./route/view/search')(app);
	require('./route/view/sell')(app);
	require('./route/view/profile')(app);
});

app.listen(3000, () => console.log('Listening on port 3000'));
