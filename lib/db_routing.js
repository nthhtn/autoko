module.exports = (app) => {

	app.use((req, res, next) => {
		const country = req.ipInfo.country;
		req._db = app[`db_${country}`];
		return next();
	});

};
