$('#profile-btn').on('click', () => {
	let data = {
		password: $('#password').val(),
		fullname: $('#fullname').val(),
		address: $('#address').val(),
		city: $('#city').val(),
		country: $('#country').val()
	};
	$.ajax({
		url: '/profile',
		method: 'PUT',
		data: data,
		success: (response) => {
			window.location.href = '/profile';
		},
		error: (error) => {
			console.log(error);
		}
	});
});
