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

$('#image-btn').on('click', () => $('#car-images').trigger('click'));

$('#car-images').on('change', function () {
	let files = $(this)[0].files;
	$('#selected-count').text(files.length + ' files selected');
});

$('#sell-btn').on('click', () => {
	let formdata = new FormData();
	let file = $('#car-images')[0].files[0];
	formdata.append('car-images', file);
	$.ajax({
		url: '/sell',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		success: function () {
			console.log('success');
		},
		error: function () {
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
