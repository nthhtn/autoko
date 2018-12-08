import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressip from 'express-ip';

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

require('./lib/sample')();

app.use((req, res, next) => require('./lib/middleware').dbRouting(req, res, next));
require('./route/api/car_manufacturer')(app);
require('./route/api/car_model')(app);
require('./route/view/index')(app);
require('./route/view/search')(app);
require('./route/view/sell')(app);

app.listen(3000, () => console.log('Listening on port 3000'));
