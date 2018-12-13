$('#profile-btn').on('click', () => {
	let password = $('#password').val();
	let confirm = $('#confirm').val();
	if (!confirm) {
		return $('#info .error').text('Please confirm update with your password');
	}
	$('#info .error').text('');
	let data = {
		password: password,
		fullname: $('#fullname').val(),
		address: $('#address').val(),
		city: $('#city').val(),
		country: $('#country').val(),
		confirm: confirm
	};
	$.ajax({
		url: '/profile',
		method: 'PUT',
		data: data,
		success: (response) => {
			window.location.href = '/profile';
		},
		error: (error) => {
			$('#info .error').text(error.responseJSON.error);
		}
	});
});

$('#car_purchase table tr .view-btn').on('click', function () {
	let item_id = $(this).closest('tr').attr('id').split('-')[1];
	let item_country = $(this).closest('tr').find('td:nth-child(6)').text().trim();
	window.open('/car/' + item_id + '?country=' + item_country);
});

$('#car_sale table tr .view-btn').on('click', function () {
	let item_id = $(this).closest('tr').attr('id').split('-')[1];
	let item_country = $(this).closest('tr').find('td:nth-child(7)').text().trim();
	window.open('/car/' + item_id + '?country=' + item_country);
});
