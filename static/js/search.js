$('.product-item .product-view').on('click', function () {
	window.location.href = $(this).closest('.product-info').find('.product-name a').attr('href');
});
