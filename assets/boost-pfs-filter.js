// Fix the confict suggestion search in Debut theme
if (typeof theme !== 'undefined' && theme.hasOwnProperty('settings')) theme.settings.predictiveSearchEnabled = false;
// Override Settings
var boostPFSFilterConfig = {
	general: {
		limit: boostPFSThemeConfig.custom.products_per_page,
		// Optional
		loadProductFirst: true,
		styleScrollToTop: 'style2',
		filterTreeMobileStyle: "style1",
		defaultDisplay: boostPFSThemeConfig.custom.layout,
		showPlaceholderProductList: true,
		breakpointMobile: "1024",
        breakpointTablet: "1024",
        capitalizeFilterOptionValues:false
	},
};
var showSize = false;
(function() {
	BoostPFS.inject(this);

	ProductGridItem.prototype.compileTemplate = function(data) {
		if (!data) data = this.data;
		/*** Prepare data ***/
		var images = data.images_info;
		// Displaying price base on the policy of Shopify, have to multiple by 100
		var soldOut = !data.available; // Check a product is out of stock
		var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
		var priceVaries = data.price_min != data.price_max; // Check a product has many prices
		// Get First Variant (selected_or_first_available_variant)
		var firstVariant = data['variants'][0];
		var variantSelected = '';
		var hasFirstVariant = false;
		if (Utils.getParam('variant') !== null && Utils.getParam('variant') != '') {
			var paramVariant = data.variants.filter(function(e) {
				return e.id == Utils.getParam('variant');
			});
			if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
		} else {
			for (var i = 0; i < data['variants'].length; i++) {
				var variant = data['variants'][i];
				var merge_options = variant.merged_options;
				var isVariant = false;
				merge_options.forEach(function(option){
					if(Utils.getParam('pf_opt_band_size') != null){
		                var bandSize = 'band_size:'+ Utils.getParam('pf_opt_band_size')
		                if(option == bandSize) 
		                	isVariant = true
		            }
		            if(Utils.getParam('pf_opt_cup_size') != null){
		                var cupSize = 'cup_size:' + Utils.getParam('pf_opt_cup_size');
		                if(option == cupSize) 
		                	isVariant = true
		            }
		            if(Utils.getParam('pf_opt_letter_size') != null){
		                var letterSize = 'letter_size:' + Utils.getParam('pf_opt_letter_size')
		                if(option == letterSize) 
		                	isVariant = true
		            }
					
				})
				
				if(isVariant == true && variantSelected == '' ){
					variantSelected = variant;
				}

				if (data['variants'][i].available && hasFirstVariant == false) {
					firstVariant = data['variants'][i];
					hasFirstVariant = true;
				}
			}
		}
		/*** End Prepare data ***/

		// Get Template
		var itemHtml = boostPFSTemplate.productGridItemHtml;
		// Add a specific class for grid item
		var itemGridWidthClass = boostPFSThemeConfig.custom.product_grid_class ;
		
		itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

		// Add soldOut class
		var itemSoldOutClass = soldOut ? boostPFSTemplate.soldOutClass : '';
		itemHtml = itemHtml.replace(/{{itemSoldOutClass}}/g, itemSoldOutClass);

		// Add soldOut label
		var itemSoldOutLabel = soldOut ? boostPFSTemplate.soldOutLabelGridHtml : '';
		itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

		var imgId = 'ProductCardImage-' + data.id;
		var wrapperId = 'ProductCardImageWrapper-' + data.id;

		// Build Image style
		var imageStyle = buildImageStyle(data);
		itemHtml = itemHtml.replace(/{{imageStyle}}/g, '');
		var img_hover_url = Utils.getFeaturedImage(images, '315x396_crop_center');
		if(images.length > 1){
			let img_hover = images[1];
			img_hover_url = Utils.optimizeImage(img_hover.src, '315x396_crop_center')
		}
		// Add Images
		var aspect_ratio = '';
		var itemImagesHtml = '<div id="' + wrapperId + '" class="grid-view-item__image-wrapper js">';
		itemImagesHtml += '<div class="img-main">';
		itemImagesHtml += '<img id="' + imgId + '" ' +
			'class="grid-view-item__image lazyload" ' +
			'src="' + Utils.getFeaturedImage(images, '1x1') + '" ' +
			'data-src="' + Utils.getFeaturedImage(images, '315x396_crop_center') + '" ' +
			'alt="{{itemTitle}}">';
		itemImagesHtml += '</div>';
		itemImagesHtml += '<div class="img-hover">';
        itemImagesHtml += '<img ';
        itemImagesHtml += 'class="grid-view-item__image lazyload" ';
        itemImagesHtml += 'alt=""';
        itemImagesHtml += 'src="' + Utils.getFeaturedImage(images, '1x1') + '"';
        itemImagesHtml += 'data-src="' + img_hover_url + '" >';
        itemImagesHtml += '</div>';
		itemImagesHtml += '</div>';

		var image_size = boostPFSConfig.custom.max_height + 'x' + boostPFSConfig.custom.max_height;
		var max_width = images.length > 0 ? boostPFSConfig.custom.max_height * aspect_ratio : 0;
		itemImagesHtml += '<noscript><img class="grid-view-item__image" src="' + Utils.getFeaturedImage(images, image_size + '@2x') + '" alt="{{itemTitle}}" style="max-width: ' + max_width + 'px;"></noscript>';
		itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

		// Add Vendor
		var itemVendorHtml = boostPFSConfig.custom.vendor_enable ? boostPFSTemplate.vendorGridHtml : '';
		itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

		// Add Price
		var itemPriceHtml = buildPrice(data, onSale, priceVaries);
		itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);
		itemHtml = itemHtml.replace(/{{itemPriceNumber}}/g, data.price_min );

		// Add Reviews
		if (typeof Integration === 'undefined' || !Integration.hascompileTemplate('reviews')) {
			itemHtml = itemHtml.replace(/{{itemReviews}}/g, '');
		}
		var itemFlairHtml = '<div data-flair-product-id="' + data.id + '"></div>';
    	itemHtml = itemHtml.replace(/{{itemFlairHtml}}/g, itemFlairHtml);

		itemHtml = itemHtml.replace(/{{itemColors}}/g, buildColorSwatch(data));
		// Add main attribute
		itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
		itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
		itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
		itemHtml = itemHtml.replace(/{{firstVaiantId}}/g, firstVariant.id);
		var productUrl = Utils.buildProductItemUrl(data);
		if(variantSelected != '')
			productUrl = productUrl + '?variant=' + variantSelected.id
		itemHtml = itemHtml.replace(/{{itemUrl}}/g, productUrl);
		return itemHtml;
	}

	ProductListItem.prototype.compileTemplate = function(data) {
		if (!data) data = this.data;
		/*** Prepare data ***/
		var images = data.images_info;
		// Displaying price base on the policy of Shopify, have to multiple by 100
		var soldOut = !data.available; // Check a product is out of stock
		var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
		var priceVaries = data.price_min != data.price_max; // Check a product has many prices
		// Get First Variant (selected_or_first_available_variant)
		var firstVariant = data['variants'][0];
		if (Utils.getParam('variant') !== null && Utils.getParam('variant') != '') {
			var paramVariant = data.variants.filter(function(e) {
				return e.id == Utils.getParam('variant');
			});
			if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
		} else {
			for (var i = 0; i < data['variants'].length; i++) {
				if (data['variants'][i].available) {
					firstVariant = data['variants'][i];
					break;
				}
			}
		}
		/*** End Prepare data ***/

		// Get Template
		var itemHtml = boostPFSTemplate.productListItemHtml;

		// Add onSale label
		var itemSaleLabel = onSale ? boostPFSTemplate.saleLabelListHtml : '';
		itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

		// Add soldOut label
		var itemSoldOutLabel = soldOut ? boostPFSTemplate.soldOutLabelListHtml : '';
		itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

		// Add Thumbnail
		var itemThumbUrl = images.length > 0 ? Utils.optimizeImage(images[0]['src'], '600x600') : boostPFSConfig.general.no_image_url;
		itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

		// Add Vendor
		var itemSmallVendorHtml = boostPFSConfig.custom.vendor_enable ? boostPFSTemplate.vendorSmallListHtml : '';
		itemHtml = itemHtml.replace(/{{itemSmallVendor}}/g, itemSmallVendorHtml);
		var itemMediumVendorHtml = boostPFSConfig.custom.vendor_enable ? boostPFSTemplate.vendorMediumListHtml : '';
		itemHtml = itemHtml.replace(/{{itemMediumVendor}}/g, itemMediumVendorHtml);

		// Add Price
		var itemPriceHtml = buildPrice(data, onSale, priceVaries);
		itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

		// Add Reviews
		if (typeof Integration === 'undefined' || !Integration.hascompileTemplate('reviews')) {
			itemHtml = itemHtml.replace(/{{itemReviews}}/g, '');
		}

		// Add main attribute
		itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
		itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
		itemHtml = itemHtml.replace(/{{itemUrl}}/g, Utils.buildProductItemUrl(data));

		return itemHtml;
	}
	// build colorSwatch 
	function buildColorSwatch( data ) {
		var tags = data.tags; 
		var colours = '';
		var swatchHTML = '';
		if(tags.length > 0){
			for(i in tags){
				var tag = tags[i];
				if( tag.indexOf('colour:') != -1){
					colours = tag.split('colour:');
					if(colours.length > 1){
						colours = colours[1].split(';');
					}
				}
				
			}
		}
		if(colours.length > 0){
			var handleProduct = data.handle.split('_');
			handleProduct =  handleProduct[handleProduct.length - 1];
			var colour_current = ''
			swatchHTML += '<div class="swatch">';
			
			var  contentItem = '<div class="grid-colour grid-option-items">';
					for(j in colours){
						var colour =  colours[j];
						var value_colour_lower = colour.toLowerCase().replace(/ /g,'-');
						contentItem += '<div class="option-item" >';
						contentItem += '<a  title="';
						contentItem += colour + '" ';
						if( handleProduct == value_colour_lower){
							colour_current = colour;
						}
						var productUrl =   Utils.buildProductItemUrl(data);
						productUrl = productUrl.replace(handleProduct,value_colour_lower);
						if( handleProduct == value_colour_lower){
							contentItem += ' href="' + productUrl +'" class= "checked '+ value_colour_lower.replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '')+'">';
						}else{
							contentItem += ' href="' + productUrl +'" class=" '+ value_colour_lower.replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '')+'">';
						}
						
						contentItem += colour;
						contentItem += '</a>';
						contentItem += '</div>';
					}
			contentItem += '</div>';		
			swatchHTML += contentItem;
			swatchHTML += '</div>';
		}
		return swatchHTML;
		
	}
	// Build Image style
	function buildImageStyle(data) {
		var images = data.images_info;
		var imgId = 'ProductCardImage-' + data.id;
		var wrapperId = 'ProductCardImageWrapper-' + data.id;
		var imageStyle = '';
		if (images.length > 0) {
			var image = images[0];
			var width = boostPFSConfig.custom.max_height;
			var height = boostPFSConfig.custom.max_height;
			var aspect_ratio = image.width / image.height;
			var small_style = true;
			var container_aspect_ratio = width * 1.0 / height;

			if (image.aspect_ratio < 1.0) {
				var maximum_width = height * aspect_ratio;
				if (image.height <= height) {
					var maximum_height = image.height;
					maximum_width = image.width;
				} else {
					var maximum_height = height;
				}
			} else if (aspect_ratio < container_aspect_ratio) {
				var maximum_height = height / aspect_ratio;
				if (image.height <= height) {
					var maximum_height = image.height;
					var maximum_width = image.width;
				} else {
					var maximum_height = height;
					var maximum_width = height * aspect_ratio;
				}
			} else {
				var maximum_height = height / aspect_ratio;
				if (image.width <= width) {
					maximum_height = image.height;
					var maximum_width = image.width
				} else {
					var maximum_width = width;
					maximum_height = maximum_width / aspect_ratio;
				}
			}

			imageStyle += '<style>';
			if (small_style) imageStyle += '@media screen and (min-width: 750px) {';
			imageStyle += '#' + imgId + ' {' +
				'max-width: ' + maximum_width + 'px;' +
				'max-height: ' + maximum_height + 'px;' +
				'}' +
				'#' + wrapperId + ' {' +
				'max-width: ' + maximum_width + 'px;' +
				'max-height: ' + maximum_height + 'px;' +
				'}';
			if (small_style) imageStyle += '}';

			if (small_style) {
				if (aspect_ratio < 1) {
					maximum_width = 750 * aspect_ratio;
				} else {
					if (image.width < 750) {
						maximum_width = image.width;
					} else {
						maximum_width = 750;
					}
				}
				imageStyle += '@media screen and (max-width: 749px) {'
				imageStyle += '#' + imgId + ' {' +
					'max-width: ' + maximum_width + 'px;' +
					'max-height: 750px;' +
					'}' +
					'#' + wrapperId + ' {' +
					'max-width: ' + maximum_width + 'px;' +
					'}';
				imageStyle += '}';
			}
			imageStyle += '</style>';
		}
		return imageStyle;
	}

	function buildPrice(data, onSale, priceVaries) {
		var priceHtml = '',
			onSaleClass = onSale ? ' price--on-sale' : '';
		var soldOutClass = data.available ? '' : ' price--sold-out';
		var comparePriceVaries = data.compare_at_price_min != data.compare_at_price_max;
		var priceVariesClass = !priceVaries && comparePriceVaries ? ' ' : '',
			variant = data.variants[0],
			unitPriceMeasurementClass = '',
			unitPriceSeparatorHtml = '',
			unitPirceBaseUnitHtml = '';

		if (variant.hasOwnProperty('unit_price_measurement')) {
			unitPriceMeasurementClass = ' price--unit-available';
		}

		priceHtml += '<dl class="price price--listing h8' + onSaleClass + soldOutClass + priceVariesClass + unitPriceMeasurementClass + '" data-price>';
		if (boostPFSConfig.custom.hasOwnProperty('vendor_enable') && boostPFSConfig.custom.vendor_enable == true) {
			priceHtml += '<div class="price__vendor price__vendor--listing"><dt>';
			priceHtml += '<span class="visually-hidden">' + boostPFSConfig.label.vendor + '</span>';
			priceHtml += '</dt><dd>';
			priceHtml += data.vendor;
			priceHtml += '</dd></div>';
		}

		priceHtml += '<div class="price__regular">';
		priceHtml += '<dt><span class="visually-hidden visually-hidden--inline">' + boostPFSConfig.label.regular_price + '</span>';
		priceHtml += '</dt><dd>';
		priceHtml += '<span class="price-item price-item--regular" data-regular-price>';
		if (priceVaries) {
			priceHtml += boostPFSConfig.label.from_lowest_price_html.replace(/{{ lowest_price }}/, Utils.formatMoney(data.price_min).replace('.00',''));
		} else {
			priceHtml += Utils.formatMoney(data.price_min).replace('.00','');
		}
		priceHtml += '</span></dd></div>';

		priceHtml += '<div class="price__sale"> <dt> <span class="visually-hidden visually-hidden--inline">';
		priceHtml += boostPFSConfig.label.sale_price +
			'</span></dt>';
		priceHtml += '<dd> <span class="price-item price-item--sale">';
		if (priceVaries) {
			priceHtml += boostPFSConfig.label.from_lowest_price_html.replace(/{{ lowest_price }}/, Utils.formatMoney(data.price_min).replace('.00',''));
		} else {
			priceHtml += Utils.formatMoney(data.price_min).replace('.00','');
		}
		priceHtml += '</span></dd>';
		priceHtml += '<div class="price__compare"> <dt> <span class="visually-hidden visually-hidden--inline">';
		priceHtml += boostPFSConfig.label.regular_price;
		priceHtml += '</span></dt>';
		priceHtml += '<dd> <s class="price-item price-item--regular">';
		priceHtml += Utils.formatMoney(data.compare_at_price_min).replace('.00','');
		priceHtml += '</s></dd></div>';
		priceHtml += '</div>';

		priceHtml += '<div class="price__unit"> <dt> <span class="visually-hidden visually-hidden--inline">';
		priceHtml += boostPFSConfig.label.unit_price_label;
		priceHtml += '</span></dt>';
		priceHtml += '<dd class="price-unit-price">';

		unitPriceSeparatorHtml += '<span aria-hidden="true">/</span><span class="visually-hidden">';
		unitPriceSeparatorHtml += boostPFSConfig.label.unit_price_separator + '&nbsp;</span>';

		if (variant.hasOwnProperty('unit_price_measurement') && variant.unit_price_measurement) {
			unitPirceBaseUnitHtml += '<span>';
			if (variant.hasOwnProperty('reference_value') && variant.unit_price_measurement.reference_value != 1) {
				unitPirceBaseUnitHtml += variant.unit_price_measurement.reference_value;
			}
			if (variant.hasOwnProperty('reference_unit')) {
				unitPirceBaseUnitHtml += variant.unit_price_measurement.reference_unit;
			}
			unitPirceBaseUnitHtml += '</span>';
		}

		if (variant.hasOwnProperty('unit_price')) {
			priceHtml += '<span>' + Utils.formatMoney(variant.unit_price).replace('.00','') + '</span>';
		}

		priceHtml += unitPriceSeparatorHtml + unitPirceBaseUnitHtml;
		priceHtml += '</dd></div>';
		var pricePercent = 0;
		if (onSale) {
	        pricePercent = Math.round( ((data.compare_at_price_min - data.price_min) * 100)/ data.compare_at_price_min) + '% off' ; 

	    }
		priceHtml += '<div class="price__badges price__badges--listing">';
		if(pricePercent !=0)
			priceHtml +='<span class="price__badge price__badge--sale-off h7" aria-hidden="true"> <span>' + pricePercent + ' </span></span>';
		priceHtml +='<span class="price__badge price__badge--sale" aria-hidden="true"> <span>';
		priceHtml += boostPFSConfig.label.sale + '</span></span>';
		priceHtml += '<span class="price__badge price__badge--sold-out">' +
			boostPFSConfig.label.sold_out +
			'</span></span></div>';

		priceHtml += '</dl>';

		return priceHtml;
	}

	/// Build Pagination
	ProductPaginationDefault.prototype.compileTemplate = function(totalProduct) {
		if (!totalProduct) totalProduct = this.totalProduct;
		// Get page info
		var currentPage = parseInt(Globals.queryParams.page);
		var totalPage = Math.ceil(totalProduct / Globals.queryParams.limit);

		// If it has only one page, clear Pagination
		if (totalPage <= 1) {
			return '';
		}

		var paginationHtml = boostPFSTemplate.paginateHtml;

		// Build Previous
		var previousHtml = (currentPage > 1) ? boostPFSTemplate.previousActiveHtml : boostPFSTemplate.previousDisabledHtml;
		previousHtml = previousHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage - 1));
		paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

		// Build Next
		var nextHtml = (currentPage < totalPage) ? boostPFSTemplate.nextActiveHtml : boostPFSTemplate.nextDisabledHtml;
		nextHtml = nextHtml.replace(/{{itemUrl}}/g, Utils.buildToolbarLink('page', currentPage, currentPage + 1));
		paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

		// Build page items
		var currentPage = boostPFSConfig.label.current_page.replace(/{{ current }}/g, currentPage).replace(/{{ total }}/g, totalPage);
		paginationHtml = paginationHtml.replace(/{{pageItems}}/g, currentPage);

		return paginationHtml;
	};

	// Build Sorting
	ProductSorting.prototype.compileTemplate = function() {
		var html = '';
		if (boostPFSTemplate.hasOwnProperty('sortingHtml')) {
			var sortingArr = Utils.getSortingList();

			if (sortingArr) {
				// Build content
				var paramSort = Globals.queryParams.sort || '';
				var sortingItemsHtml = '';
				var sortingCurrent = '';
				var sortingItemsSelectHml = '';
				for (var k in sortingArr) {
				
					var activeClass = '';
                    if(paramSort == k) {
                    	sortingCurrent = sortingArr[k];
                        activeClass = 'boost-pfs-filter-sort-item-active';
                        sortingItemsSelectHml += '<option selected value="'+ k +'">' +  sortingArr[k] + '</option>';
                        sortingItemsHtml += '<li><a href="#" data-sort="' + k + '" class="' + activeClass + '">' + sortingArr[k] + ' <span class="icon-tick"></span></a></li>';
                    }else{
                    	sortingItemsHtml += '<li><a href="#" data-sort="' + k + '">' + sortingArr[k] + ' </a></li>';
                    	sortingItemsSelectHml += '<option value="'+ k +'">' +  sortingArr[k] + '</option>';
                    }
                    
				}
				html = boostPFSTemplate.sortingHtml.replace(/{{sortingLabel}}/g, sortingCurrent);
				html = html.replace(/{{sortingItems}}/g, sortingItemsHtml);
				html = html.replace(/{{sortingItemsSelect}}/g, sortingItemsSelectHml);
			}
		}
		return html;
	};
	ProductSorting.prototype.render = function() {
        jQ(Selector.topSorting).html(this.compileTemplate());

        if (jQ('.boost-pfs-filter-top-sorting').hasClass('boost-pfs-filter-sort-active')) {
            jQ('.boost-pfs-filter-top-sorting').toggleClass('boost-pfs-filter-sort-active');
        }

        var labelSort = '';
        var paramSort = Globals.queryParams.sort || '';
        if (paramSort.length > 0) {
            var labelHandle = 'sorting_' + paramSort.replace(/\-/g, '_');
            labelSort = Labels[labelHandle];
        } else {
            labelSort = Labels.sorting_heading;
        }

        jQ('.boost-pfs-filter-top-sorting .btn-sort-label').text(labelSort);
    }
	 // Build Sorting event
    ProductSorting.prototype.bindEvents = function() {
        var _this = this;
        jQ('.boost-pfs-filter-filter-dropdown a').click(function(e){
            e.preventDefault();
            FilterApi.setParam('sort', jQ(this).data('sort'));
            FilterApi.setParam('page', 1);
            FilterApi.applyFilter('sort');
        });

        jQ(".boost-pfs-filter-top-sorting> button").click(function(){
            if (!jQ('.boost-pfs-filter-filter-dropdown').is(':animated')) {
                jQ('.boost-pfs-filter-filter-dropdown').toggle().parent().toggleClass('boost-pfs-filter-sort-active');
            }
        });
        $('#sort-collection').on('change',function(){
        	var valSort = $(this).val();
        	FilterApi.setParam('sort', valSort);
            FilterApi.setParam('page', 1);
            FilterApi.applyFilter('sort');

        })
        // jQ(Selector.filterTreeMobileButton).click(function(){
        //     jQ('.boost-pfs-filter-top-sorting-mobile .boost-pfs-filter-filter-dropdown').hide();
        // });
    };
	// Build Display type
	ProductDisplayType.prototype.compileTemplate = function() {
		var itemHtml = '<span>View As </span>';
		itemHtml += '<a href="' + Utils.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="{{class.productDisplayType}}-item {{class.productDisplayType}}-grid" data-view="grid"><span class="icon-fallback-text"><span class="fallback-text">Grid view</span></span></a>';
		itemHtml += '<a href="' + Utils.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="{{class.productDisplayType}}-item {{class.productDisplayType}}-list" data-view="list"><span class="icon-fallback-text"><span class="fallback-text">List view</span></span></a>';
		itemHtml = itemHtml.replace(/{{class.productDisplayType}}/g, Class.productDisplayType);

		return itemHtml;
	};

	// Add additional feature for product list, used commonly in customizing product list
	ProductList.prototype.afterRender = function(data) {

		if (!data) data = this.data;
		if(data.length == 0)
			$('.template-search').addClass('empty_cart')
		var productSelector = jQ(Selector.products);
		if (Globals.queryParams.display == 'list') {
			if (productSelector.children('.list-view-items').length == 0) {
				productSelector.children().wrapAll('<ul class="list-view-items"></ul>');
			}
			productSelector.removeClass('grid grid--uniform grid--view-items');
		} else {
			if (productSelector.children('.list-view-items').length > 0) {
				productSelector.children('.list-view-items').children().unwrap();
			}
			productSelector.addClass('grid grid--uniform grid--view-items');
		}

		/** Start Swym integration **/
		window.SwymCallbacks = window.SwymCallbacks || [];
		window.SwymCallbacks.push(function(swat) { 
		    // Wrap with callback for loading without additional checks
		    var products = [];
		    data.forEach(function(product) {
		        var image_src = Utils.getFeaturedImage(product.images_info);
		        var productCopy = product;
		        productCopy.featured_image = image_src;
		        productCopy.price = product.price_min; // Sometimes I need to multiply the price with 100
		        productCopy.compare_at_price = product.compare_at_price_min; // Sometimes I need to multiply the price with 100
		        products.push(productCopy);
		    });
		    swat.mapShopifyProducts(products); // Product mapped data to swym layer
		    swat.initializeActionButtons('.boost-pfs-filter-products'); // Buttons can now be initialized
		});
		/** End Swym integration **/


		if (typeof FlairApp !== 'undefined' && FlairApp) {
	        var productIds = data.map(function (value, index) { return value.id });
	        FlairApp.getProductBadgesMulti({ 
	        "ids" : productIds 
	        }).then(function(badges) {
	        var FlairHTMLWrapper = jQ.parseHTML(badges);
	        for (var i = 0; i < productIds.length; i++) {
	            var selector = Selector.products + ' [data-flair-product-id="' + productIds[i] + '"]';
	            var productBadges = jQ(FlairHTMLWrapper).find('[data-product-id="' + productIds[i] + '"]');
	            jQ(selector).html(productBadges)
	        }
	        })
	    }
	}

	// Build Additional Elements
	FilterResult.prototype.afterRender = function(data, eventType) {
		var link = window.location.href;
		removePageParamFromUrlNew(link);
		if (!data) data = this.data;
		var totalProduct = '';
		if (data.total_product == 1) {
			totalProduct = boostPFSConfig.label.items_with_count_one.replace(/{{ count }}/g, data.total_product);
		} else {
			totalProduct = boostPFSConfig.label.items_with_count_other.replace(/{{ count }}/g, data.total_product);
		}

		jQ('.boost-pfs-filter-total-product').html(totalProduct);
		setTimeout(function(){
			//Group size
			var wWidth = $(window).width();
			var checkOpen = false;
			if(jQ('.boost-pfs-filter-option').length > 0){
				var options = jQ('.boost-pfs-filter-option');
				var index = 0;
				options.each(function(){
					if(jQ(this).attr('class').indexOf('size') != -1){
						if(jQ(this).find('.selected').length > 0 )
							checkOpen = true;
						jQ(this).addClass('group-size');
						if( index == 0){
							if($('.title-group-size').length < 1)
								$( '<div class="title-group-size h6">' + theme.size + '<span class="icon-plus"></span></div>' ).insertBefore( jQ(this) );
						}
						index ++;	
					}
				});
				if(checkOpen && showSize){
					$('.title-group-size').addClass('active')
					$('.group-size').show();
				}else{
					$('.group-size').hide();
				}
				showSize = true;
			}

			if($('.refine-by-type').length > 0){
				$('.boost-pfs-filter-tree-content').addClass('show-view-result');
				var viewHtml = boostPFSThemeConfig.custom.view_items
				viewHtml = viewHtml.replace(/{{ item }}/g, data.total_product);
				if(data.total_product == 1)
					viewHtml = viewHtml.replace(/s/g, '');
				$('.boost-pfs-filter-show-result').html(viewHtml);
			}
			// Price ranage
			var currencySymbol = theme.moneyFormat.replace('{{amount}}','').replace('{{amount_no_decimals }}','').replace('{{amount_with_comma_separator}}', '');
			if($('.noUi-tooltip').length > 0){
				$('.noUi-tooltip').each(function(){
					if($(this).html().indexOf(currencySymbol) == -1)
						$(this).html( currencySymbol + $(this).html());
				});
			}
			$('.group-size .boost-pfs-filter-option-value').each(function(){
				var __this = this;
				if($(this).find('span').length < 1){
					var optionValue = $(this).html().split('/');
					var i = 0;
					var htmlOption = '';
					if(optionValue.length > 2){
						optionValue.forEach(function(item){
							i++;
							htmlOption += '<span class="lang_'+ i +'">' + item + '</span>';
							if(item == '0'){
								var classHide = 'hideLabel-' + i;
								$(__this).closest('.boost-pfs-filter-option-item').addClass(classHide)
							}
						});
						$(this).html(htmlOption)
					}
				}
			});
			$('.refine-by-value').each(function(){
				if($(this).find('span').length < 1){
					var optionValue = $(this).html().split('/');
					var i = 0;
					var htmlOption = '';
					if(optionValue.length > 2){
						optionValue.forEach(function(item){
							i++;
							htmlOption += '<span class="lang_'+ i +'">' + item+ '</span>';
						});
						$(this).html(htmlOption)
					}
				}
			});
			if( Shopify.currency.active == 'EUR'){
				$('.noUi-tooltip').each(function(){
					var valueT = $(this).html().replace('€','') + ' €';
					$(this).html(valueT)
				})
			}
		},200)
		var currentPage = parseInt(Globals.queryParams.page);
		var totalPage = Math.ceil(data.total_product / Globals.queryParams.limit);
		if(currentPage == totalPage){
			$('.boost-pfs-filter-load-more-button').attr('disabled','disabled');
			$('.boost-pfs-filter-load-more-button').addClass('disabled');
		}
		// Add static block
		$('.static-block').remove();
		if(typeof blocks !== 'undefined'){
			if(blocks.length > 0){
				for( inx in blocks ){
					var block = blocks[inx];
					var classVideo = (block.use_a_video == true && block.video != null )? "has-block-video": "";
					var itemHtml = '<li class="grid__item grid__item--collection-template static-block '+ classVideo + " " + boostPFSThemeConfig.custom.product_grid_class + '"><div class="product-card grid-view-item">';
					if( block.link != '')
						itemHtml += '<a href=" '+ block.link +'" >';
					itemHtml += '<div class="info-outer "><div class="info">';
					if( block.title != '')
						itemHtml += '<div class="h3">'+ block.title +' </div>';
					if( block.button_text != '')
						itemHtml += '<div class="btn_dark"> '+ block.button_text +' </div>';
					itemHtml += '</div>';
					if(block.use_a_video == true && block.video != null ){
						itemHtml += '<video preload="auto" class="styles_backgroundMedia__Ajqh9 styles_video__21QdD" src="'+ block.video +'" autoplay loop muted playsinline></video>';
					}else{
						if( block.image != ''){
							itemHtml += '<img src="' + block.image +'" alt="" />';
						}else{
							itemHtml += '<img src="' + theme.no_img +'" alt="" />';
						}
					}
					
					itemHtml += '</div>';
					if( block.link != '')
						itemHtml += '</a>';
					
					itemHtml += '</div></li>';
					if($('.boost-pfs-filter-products .grid__item ').length > block.position ){
						var itemProduct = $('.boost-pfs-filter-products .grid__item ')[block.position];
						$(itemHtml).insertBefore($(itemProduct))
					}
				}
			}
		}

	};
	//ProductPaginationLoadMore.prototype._onClickEvent = function(){}
	function removePageParamFromUrlNew(link) {
	    if (Globals.queryParams.hasOwnProperty('page')) {
	        link = link.replace('&page=' + Globals.queryParams.page, '').replace('?page=' + Globals.queryParams.page + '&', '?').replace('?page=' + Globals.queryParams.page, '');
	        history.pushState({}, null, link);
	    }
	    
	}
})();