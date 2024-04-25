const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');
const axios = require('axios');
const cheerio = require('cheerio');

exports.fetchAmazonProduct = asyncErrorHandler(async (req, res, next) => {
	const { asin } = req.body;

	try {
		const amazonLocale = 'in';

		const url = `https://www.amazon.${amazonLocale}/dp/${asin}`;
		console.log(url);

		const response = await axios.get(url);

		const $ = cheerio.load(response.data);

		const title = $('#productTitle').text().trim();
		const priceMatch = $('.a-price-whole').first().text().trim().match(/\d{1,3}(,\d{3})*(\.\d+)?/);
const price = priceMatch ? priceMatch[0].replace(/,/g, '') : '';
		const imageUrl = $('#imgTagWrapperId img').attr('src');
		const brand = $('.po-brand .a-size-base.a-text-bold').text().trim();
		const cuttedPriceWithCurrency = $('.a-price.a-text-price').first().text().trim();
		const cuttedPriceMatch = cuttedPriceWithCurrency.match(/\d{1,3}(,\d{3})*(\.\d+)?/);
		const cuttedPrice = cuttedPriceMatch ? cuttedPriceMatch[0].replace(/,/g, '') : '';
		const brandImageUrl = $('#imgTagWrapperId img').attr('src');

		const amazonProductDetails = {
			title,
			price,
			imageUrl,
			brand,
			cuttedPrice,
			brandImageUrl
		};

		res.status(200).json({
			success: true,
			amazonProductDetails
		});
	} catch (error) {
		console.error('Error fetching product details:', error);
		res.status(500).json({ error: 'Failed to fetch product details.' });
	}
})