/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 */

const $doc = $(document);

$doc.on('click', '[data-action="add-to-cart"] ', function(e) {
	var _this8 = $(this).closest('.ProductItem');

	event.preventDefault(); // Prevent form to be submitted

	var addToCartButton = _this8.find('.ProductForm__AddToCart');

	// First, we switch the status of the button
	addToCartButton.prop('disabled', true);
	document.dispatchEvent(new CustomEvent('theme:loading:start'));

	// Then we add the product in Ajax
	var formElement = _this8.find('form[action^="/cart/add"]');

	var serializeData = formElement.serialize();

	$.ajax({
		url: formElement.attr('action'),
		data: serializeData,
		dataType: 'json',
		method: 'POST'
	})
		.done(function(response) {
			document.dispatchEvent(new CustomEvent('theme:loading:end'));
			addToCartButton.prop('disabled', false);
			// We simply trigger an event so the mini-cart can re-render

			$.ajax({
				url: '/',
				dataType: 'html'
			}).done(function(data) {
				let drawerNew;

				$(data).each(function() {
					if ($(this).attr('id') == 'sidebar-cart') {
						const $this = $(this);
						drawerNew = $(this).html();
					}
				});

				$('#sidebar-cart').html(drawerNew);

				$('.Header__CartCount').text(
					$(data)
						.find('.Header__CartCount')
						.html()
				);
				console.log($('[data-action="open-drawer"][data-drawer-id="sidebar-cart"]'));

				$('.Header__SecondaryNav [data-action="open-drawer"][data-drawer-id="sidebar-cart"]')[0].click();
			});
		})
		.fail(function(content) {
			document.dispatchEvent(new CustomEvent('theme:loading:end'));

			var errorMessageElement = document.createElement('span');
			errorMessageElement.className = 'ProductForm__Error Alert Alert--error';
			errorMessageElement.innerHTML = content.responseJSON.errors;
			addToCartButton.prop('disabled', false);
			addToCartButton.after(errorMessageElement);
			setTimeout(function() {
				errorMessageElement.remove();
			}, 2500);

			console.log(content.responseJSON);
		});
});


document.body.addEventListener("afterAddItem.imageMapper", function (lineItem) {
	console.log('Product added to cart');
	$.ajax({
		url: '/',
		dataType: 'html'
	}).done(function (data) {
		let drawerNew;

		$(data).each(function () {
			if ($(this).attr('id') == 'sidebar-cart') {
				const $this = $(this);
				drawerNew = $(this).html();
			}
		});

		$('#sidebar-cart').html(drawerNew);

		$('.Header__CartCount').text(
			$(data)
				.find('.Header__CartCount')
				.html()
		);
		console.log($('[data-action="open-drawer"][data-drawer-id="sidebar-cart"]'));

		// $('.Header__SecondaryNav [data-action="open-drawer"][data-drawer-id="sidebar-cart"]')[0].click();
		$('[data-action="open-drawer"]')[1].click()
	});

});
