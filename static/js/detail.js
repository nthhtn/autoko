$('#search-manufacturer').show(function () {
	let element = $(this);
	$.ajax({
		url: '/api/car_manufacturers',
		method: 'GET',
		success: (response) => {
			element.html('<option value="0">Any manufacturer</option>');
			for (let item of response.result) {
				element.append('<option value="' + item._id + '">' + item.name + '</option>');
			}
		}
	});
});

$('#search-manufacturer').change(function () {
	let manufacturer_id = $(this).val();
	let element = $('#search-model');
	element.html('<option value="0">Any model</option>');
	$(element).attr('disabled', true);
	if (manufacturer_id == 0) {
		return;
	}
	$.ajax({
		url: '/api/car_models',
		method: 'GET',
		data: { manufacturer_id: manufacturer_id },
		success: (response) => {
			$(element).attr('disabled', false);
			for (let item of response.result) {
				element.append('<option value="' + item._id + '">' + item.name + '</option>');
			}
		}
	});
});

$('#search-btn').on('click', () => {
	let data = {
		keyword: $('#search-keyword').val() || '',
		manufacturer_id: $('#search-manufacturer').val() == 0 ? undefined : $('#search-manufacturer').val(),
		model_id: $('#search-model').val() == 0 ? undefined : $('#search-model').val(),
		color: $('#search-color').val() == 0 ? undefined : $('#search-color').val(),
		transmission: $('#search-transmission').val() == 0 ? undefined : $('#search-transmission').val(),
		fuel: $('#search-fuel').val() == 0 ? undefined : $('#search-fuel').val(),
		price_from: $('#price_from').val() == '' ? undefined : $('#price_from').val(),
		price_to: $('#price_to').val() == '' ? undefined : $('#price_to').val(),
		engine_from: $('#engine_from').val() == '' ? undefined : $('#engine_from').val(),
		engine_to: $('#engine_to').val() == '' ? undefined : $('#engine_to').val(),
		power_from: $('#power_from').val() == '' ? undefined : $('#power_from').val(),
		power_to: $('#power_to').val() == '' ? undefined : $('#power_to').val(),
		cylinder_from: $('#cylinder_from').val() == '' ? undefined : $('#cylinder_from').val(),
		cylinder_to: $('#cylinder_to').val() == '' ? undefined : $('#cylinder_to').val()
	};
	let country = $('#search-country').val();
	let filter = encodeURI(JSON.stringify(data));
	window.location.href = '/search?filter=' + filter + '&country=' + country;
});

$('#buy-btn').on('click', () => {
	if (!user) {
		$('#signin-modal').modal('show');
		return;
	}
	$.ajax({
		url: '/api/car_stock/' + car._id + '?country=' + car.country,
		method: 'PUT',
		data: { buyer_id: user._id, purchase_status: 'sold' },
		success: (response) => {
			window.location.href = '/car/' + car._id + '?country=' + car.country;
		}
	});
});

function validate() {
	let isValid = true;
	$('#signin input').each(function () {
		let value = $(this).val().trim();
		if (!value) {
			isValid = false;
			return;
		}
	});
	return isValid;
};

$('#signin input').on('keyup', (e) => {
	if (e.which === 13) { $('#signin-btn').trigger('click'); }
});

$('#signin-btn').on('click', () => {
	if (!validate()) { return $('#signin .error').text('Missing field(s)'); }
	$('#signin .error').text('');
	let data = {
		email: $('#signin-email').val(),
		password: $('#signin-password').val()
	};
	$.ajax({
		url: '/signin',
		method: 'POST',
		data: data,
		success: (response) => {
			window.location.href = '/car/' + car._id + '?country=' + car.country;
		},
		error: (error) => {
			$('#signin .error').html(error.responseJSON.error);
		}
	});
});