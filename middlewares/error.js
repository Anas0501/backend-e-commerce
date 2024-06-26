const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// mongodb id error
	if (err.name === "CastError") {
		const message = `Resource Not Found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	// mongoose duplicate key error
	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
		err = new ErrorHandler(message, 400);
	}

	// jwt error handling
	if (err.name === "JsonWebTokenError") {
		const message = 'JWT Error';
		err.statusCode = 400; // Set status code appropriately
		err = new ErrorHandler(message, err.statusCode);
	}

	// jwt expiration error handling
	if (err.name === "TokenExpiredError") {
		const message = 'JWT is Expired';
		err.statusCode = 401; // Set status code appropriately
		err = new ErrorHandler(message, err.statusCode);
	}

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message,
	});
};
