module.exports.isSignedIn = async (req, res, next) => {
	return req.session.user ? next() : res.redirect('/signin');
};
