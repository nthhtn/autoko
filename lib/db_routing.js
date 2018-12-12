module.exports = (app) => {

	app.use((req, res, next) => {
		const country = req.query.country || req.ipInfo.country || 'FI';
		req._db = app[`db_${country}`];
		req.session.country = country;
		return next();
	});

};
