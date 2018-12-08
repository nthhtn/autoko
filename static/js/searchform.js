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
