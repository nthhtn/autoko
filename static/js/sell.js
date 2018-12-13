$('.datetimepicker').datetimepicker({
	icons: {
		time: "fa fa-clock-o",
		date: "fa fa-calendar",
		up: "fa fa-chevron-up",
		down: "fa fa-chevron-down",
		previous: 'fa fa-chevron-left',
		next: 'fa fa-chevron-right',
		today: 'fa fa-screenshot',
		clear: 'fa fa-trash',
		close: 'fa fa-remove'
	}
});

$('#image-btn').on('click', () => $('#car_images').trigger('click'));

$('#car_images').on('change', function () {
	let files = $(this)[0].files;
	$('#selected-count').text(files.length + ' files selected');
});

$('#sell-btn').on('click', () => {
	let formdata = new FormData();
	let name = $('#name').val();
	if (!name) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('name', name);
	let manufacturer = $('#manufacturer').val();
	if (manufacturer === 0) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('manufacturer_id', manufacturer);
	let model_id = $('#model').val();
	if (model_id == 0) {
		return $('.error').text('Missing field(s)');
	}
	if (model_id == 1) {
		formdata.append('model_name', $('#input-model').val());
		formdata.append('engine', $('#engine').val());
		formdata.append('fuel', $('#fuel').val());
		formdata.append('transmission', $('#transmission').val());
		formdata.append('cylinder', $('#cylinder').val());
		formdata.append('power', $('#power').val());
		formdata.append('year', $('#year').val());
	} else {
		formdata.append('model_id', model_id);
	}
	let color = $('#color').val();
	if (color == 0) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('color', color);
	let registration_year = $('#registration_year').val();
	if (!registration_year) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('registration_year', registration_year);
	let price = $('#price').val();
	if (!price) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('price', price);
	let address = $('#address').val();
	if (!address) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('address', address);
	let city = $('#city').val();
	if (!city) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('city', city);
	let country = $('#country').val();
	if (!country) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('country', country);
	let description = $('#description').val();
	if (!description) {
		return $('.error').text('Missing field(s)');
	}
	formdata.append('description', description);
	let files = $('#car_images')[0].files;
	if (files.length === 0) {
		return $('.error').text('Missing field(s)');
	}
	$.each(files, (i, file) => {
		formdata.append('car_images', file);
	});
	$('.error').text('');
	$.ajax({
		url: '/sell?country=' + country,
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		success: (response) => {
			window.location.href = '/car/' + response.result._id + '?country=' + country;
		},
		error: (error) => {
			console.log('error');
		}
	});
});

$('#manufacturer').show(function () {
	let element = $(this);
	$.ajax({
		url: '/api/car_manufacturers',
		method: 'GET',
		success: (response) => {
			element.html('<option value="0">Choose manufacturer</option>');
			for (let item of response.result) {
				element.append('<option value="' + item._id + '">' + item.name + '</option>');
			}
		}
	});
});

$('#manufacturer').change(function () {
	let manufacturer_id = $(this).val();
	let element = $('#model');
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
			element.html('<option value="0">Choose model of manufacturer</option>');
			for (let item of response.result) {
				element.append('<option value="' + item._id + '">' + item.name + '</option>');
			}
			element.append('<option value="1">Enter another model</option>');
		}
	});
});

$('#model').change(function () {
	let val = $(this).val();
	if (val == 1) {
		$('#input-model').attr('disabled', false);
		$('#power').attr('disabled', false);
		$('#engine').attr('disabled', false);
		$('#fuel').attr('disabled', false);
		$('#transmission').attr('disabled', false);
		$('#cylinder').attr('disabled', false);
		$('#year').attr('disabled', false);
		$('#power').val(0);
		$('#engine').val(0);
		$('#fuel').val(0);
		$('#transmission').val(0);
		$('#cylinder').val(-1);
		return;
	}
	$('#input-model').attr('disabled', true);
	$('#power').attr('disabled', true);
	$('#engine').attr('disabled', true);
	$('#fuel').attr('disabled', true);
	$('#transmission').attr('disabled', true);
	$('#cylinder').attr('disabled', true);
	$('#year').attr('disabled', true);
	if (val == 0) {
		return;
	}
	$.ajax({
		url: '/api/car_model/' + val,
		method: 'GET',
		success: (response) => {
			let item = response.result;
			$('#power').val(item.power);
			$('#engine').val(item.engine);
			$('#fuel').val(item.fuel);
			$('#transmission').val(item.transmission);
			$('#cylinder').val(item.cylinder);
			$('#year').val(item.year);
		}
	});
});
