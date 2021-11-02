// Override Settings
var bcSfFilterSettings = {
  general: {
      limit: bcSfFilterConfig.custom.products_per_page,
      // Optional
      loadProductFirst: false,
      styleScrollToTop: 'style2',
      defaultDisplay: bcSfFilterConfig.custom.layout,
      showPlaceholderProductList: true,
      filterTreeMobileStyle: 'style3',
      breakpointMobile: '1024'
  },
};
BCSfFilter.prototype.buildProductGridItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
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
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;

  // Add a specific class for grid item
  var itemGridWidthClass = '';
  var imageSize = '600x600';

  switch (bcSfFilterConfig.custom.products_per_row) {
    case 2:
      itemGridWidthClass = 'medium-up--one-half';
      imageSize = '540x600';
      break;
    case 3:
      itemGridWidthClass = 'small--one-half medium-up--one-third';
      imageSize = '345x550';
      break;
    case 4:
      itemGridWidthClass = 'small--one-half medium-up--one-quarter';
      imageSize = '250x';
      break;
    case 5:
      itemGridWidthClass = 'small--one-half medium-up--one-fifth';
      imageSize = '195x';
      break;
  }
  itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

  // Add soldOut class
  var itemSoldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutClass}}/g, itemSoldOutClass);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;
	
  
 // Build Labels
  var labels =  buildLabels(data);
  // Build Image style
  var imageStyle = buildImageStyle(data);
  itemHtml = itemHtml.replace(/{{imageStyle}}/g, imageStyle);

  // Add Images
  var aspect_ratio = '';
  var itemImagesHtml = '<div id="' + wrapperId + '" class="grid-view-item__image-wrapper product-card__image-wrapper js">';
  itemImagesHtml += '<div style="height: 300px;padding: 5px;">';
  itemImagesHtml += '<img '+
    'class="lazyloadeds" data-bgset="'+ this.getFeaturedImage(images, '300x300') +'" src="https://cdn.shopify.com/s/files/1/0271/8613/5084/files/empty_300x300_24918061-cf8a-432f-9b32-2af7940adb69.png?v=1582019068" ' +
    'style="width: 100%; height: 100%; background-image: url('+ this.getFeaturedImage(images, '300x300') +');background-position: center; background-size: contain;background-repeat: no-repeat;"'+
    'alt="{{itemTitle}}">';
  itemImagesHtml += labels;
  itemImagesHtml += '</div>';
  itemImagesHtml += '</div>';
  itemImagesHtml += '<div class="placeholder-background placeholder-background--animation" data-image-placeholder></div>';

  var image_size = bcSfFilterConfig.custom.max_height + 'x' + bcSfFilterConfig.custom.max_height;
  var max_width = images.length > 0 ? bcSfFilterConfig.custom.max_height * aspect_ratio : 0;
  itemImagesHtml += '<noscript><img class="grid-view-item__image" src="' + this.getFeaturedImage(images, image_size + '@2x') + '" alt="{{itemTitle}}" style="max-width: ' + max_width + 'px;"></noscript>';
  itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

  // Add Vendor
  var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorGridHtml : '';
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, firstVariant);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add data json
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(data.json));

  // Form cart
  var form_classes = 'product-form product-form--hide-variant-labels product-form-'+ bcSfFilterConfig.custom.section_id +'-' + data.id;
  if( !firstVariant.available) 
  form_classes += ' product-form--variant-sold-out';
  var itemAddToCartHtml = '';
  itemAddToCartHtml += '<form accept-charset="UTF-8" novalidate="novalidate" action="/cart/add" class="'+ form_classes + '" id="product_form_' + data.id + '" method="post" enctype="multipart/form-data"  data-product-form>';
  itemAddToCartHtml += '<input type="hidden" name="quantity" value="1" />';
  itemAddToCartHtml += '<input type="hidden" name="form_type" value="product">';
  itemAddToCartHtml += '<input type="hidden" name="utf8" value="✓">';
  itemAddToCartHtml += '<select name="id"  class="product-form__variants no-js">';
  for (var i = 0; i < data['variants'].length; i++) {
    itemAddToCartHtml += '<option value="' + data['variants'][i].id + '"'; 
    if(data['variants'][i].id == firstVariant.id ){
      itemAddToCartHtml += ' selected="selected"';
    }
    itemAddToCartHtml += '>'; 
    itemAddToCartHtml += data['variants'][i].title ;
    if( !data['variants'][i].available) {
      itemAddToCartHtml += ' - ' + bcSfFilterConfig.label.sold_out;
    }
    itemAddToCartHtml += '</option>';
  }   
  itemAddToCartHtml += '</select>';
  itemAddToCartHtml += '<p class="visually-hidden" data-product-status aria-live="polite" role="status"></p>';
  itemAddToCartHtml += '<p class="visually-hidden" data-loader-status aria-live="assertive" role="alert" aria-hidden="true">'+ bcSfFilterConfig.label.loader_label + '</p>';
  itemAddToCartHtml += '<div class="product-form__error-message-wrapper product-form__error-message-wrapper--hidden" data-error-message-wrapper role="alert">';
  itemAddToCartHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.error +'</span>';
  itemAddToCartHtml += '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-error" viewBox="0 0 14 14"><g fill="none" fill-rule="evenodd"><path d="M7 0a7 7 0 0 1 7 7 7 7 0 1 1-7-7z"/><path class="icon-error__symbol" d="M6.328 8.396l-.252-5.4h1.836l-.24 5.4H6.328zM6.04 10.16c0-.528.432-.972.96-.972s.972.444.972.972c0 .516-.444.96-.972.96a.97.97 0 0 1-.96-.96z" fill-rule="nonzero"/></g></svg>';
  itemAddToCartHtml += '<span class="product-form__error-message" data-error-message>'+ bcSfFilterConfig.label.quantity_minimum_message +'</span>';
  itemAddToCartHtml += '</div>';
  itemAddToCartHtml += '<div class="product-form__controls-group product-form__controls-group--submit">';
  itemAddToCartHtml += '<div class="product-form__item product-form__item--submit">';
  var attrBtn = '';
  if( !firstVariant.available)
    attrBtn += ' aria-disabled="true"';
  attrBtn += ' aria-label="';
  if( !firstVariant.available){
    attrBtn +=  bcSfFilterConfig.label.sold_out;
  }else{
    attrBtn +=  bcSfFilterConfig.label.add_to_cart;
  }
  attrBtn += '"';
  itemAddToCartHtml += '<button type="submit" name="add" '+ attrBtn +' class="btn product-form__cart-submit" data-add-to-cart>';
  itemAddToCartHtml += '<span data-add-to-cart-text>';
  if( firstVariant.available) {
    itemAddToCartHtml += bcSfFilterConfig.label.add_to_cart;
  }else{
    itemAddToCartHtml += bcSfFilterConfig.label.sold_out;
  }
  itemAddToCartHtml += '</span>';
  itemAddToCartHtml += '<span class="hide" data-loader>';
  itemAddToCartHtml += '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-spinner" viewBox="0 0 20 20"><path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" fill="#919EAB"/></svg>';
  itemAddToCartHtml += '</button> ';
  itemAddToCartHtml += '</div>';
  itemAddToCartHtml += '</div>';
  itemAddToCartHtml += '</form>';
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemVariant}}/g, JSON.stringify(firstVariant.id));
  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemAddToCartHtml}}/g, itemAddToCartHtml);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  var productUrl = this.buildProductItemUrl(data);
  productUrl = productUrl.replace("search/", "");
 
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, productUrl);
  itemHtml = itemHtml.replace(/{{itemTags}}/g, buildTags(data));
  var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? '<span>'+ data.vendor + '</span>' : '';
  itemHtml = itemHtml.replace(/{{itemVendorSmall}}/g, itemVendorHtml);
  if(checkCustomerHideProduct(data)){
  	return '';
  }	
  return itemHtml;
}
BCSfFilter.prototype.buildProductItemUrl = function(data, hasCollection) {
 
    var tags = data.tags;

    var handle = data.handle;
    if(tags.length > 0){
      tags.forEach(function(tag){
        if(tag.indexOf('url:') != -1){
          arrTag = tag.split(':');
          handle = arrTag[1];
        }
      });
    }

    var hasCollection = typeof hasCollection !== 'undefined' ? hasCollection : true;
  	
    if (hasCollection) {
        return window.location.protocol + '//' + window.location.hostname + '/products/' + handle;
    }
    return window.location.protocol + '//' + window.location.hostname + '/products/' + handle;
};
// Build Image style
function buildImageStyle(data) {
  var images = data.images_info;
  var imgId = 'ProductCardImage-' + data.id;
  var wrapperId = 'ProductCardImageWrapper-' + data.id;
  var imageStyle = '';
  if (images.length > 0) {

    var image = images[0];
    var width = bcSfFilterConfig.custom.max_height;
    var height = bcSfFilterConfig.custom.max_height;
    var aspect_ratio = image.width / image.height;

    imageStyle += '<style>';
    if (image.height <= height) {
      var maximum_height = image.height;
    }else{
      var maximum_height = height;
    }
    var maximum_width = maximum_height * aspect_ratio;
    imageStyle += '#' + imgId + ' {';
    imageStyle += 'max-width:' + maximum_width +'px';
    imageStyle += 'max-height:' + maximum_height +'px';
    imageStyle += '}';
    imageStyle += '#' + wrapperId + ' {';
    imageStyle += 'max-width:' + maximum_width + 'px';
    imageStyle += '}';
    imageStyle += '</style>';
  }
  return imageStyle;
}

BCSfFilter.prototype.buildProductListItem = function(data) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
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
  var itemHtml = bcSfFilterTemplate.productListItemHtml;

  // Add onSale label
  var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

  // Add soldOut label
  var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '600x600') : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  // Add Vendor
  var itemSmallVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorSmallListHtml : '';
  itemHtml = itemHtml.replace(/{{itemSmallVendor}}/g, itemSmallVendorHtml);
  var itemMediumVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorMediumListHtml : '';
  itemHtml = itemHtml.replace(/{{itemMediumVendor}}/g, itemMediumVendorHtml);
 

  
  
  
  // Add Price
  var itemPriceHtml = buildPrice(data, onSale, firstVariant);
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);
  var productUrl = this.buildProductItemUrl(data);
  productUrl = productUrl.replace("search/", "");
  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemVendorLabel}}/g, data.vendor);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, productUrl);
  if(checkCustomerHideProduct(data)){
  	return '';
  }	
  return itemHtml;
}
function checkCustomerHideProduct(data){
  var tags = data.tags;
  var checkHideProduct = false;
  tags.forEach(function(tag){
    if(tag.indexOf('members-only') != -1 && theme.customer == 0){
    	checkHideProduct = true;
    }
  });
  return checkHideProduct;
}
function buildTags(data){
  var tags = data.tags;
  var htmlTag = '';
  tags.forEach(function(tag){
    if(tag.indexOf('stickers||') != -1){
    	var stickerUrl = tag.split('||');
        stickerUrl = stickerUrl[stickerUrl.length - 1];
        htmlTag = '<div class="new-tag new-tag--absolute">'+ 
                  '<img src="'+ stickerUrl +'" alt="">'+ 
            	  '</div>';
    }
  });
return htmlTag;  
}
function buildLabels(data){
  var tags = data.tags;
  var htmlTag = '';
  var labels = '';
  var check_label = false;
  tags.forEach(function(tag){
    if(tag.indexOf('label:flash') != -1){
    	htmlTag += '<span class="label-flash"></span>';
    }
    if(tag.indexOf('label1:') != -1){
        check_label = true;
        var label_s = tag.split(':');
        label_s = label_s[label_s.length - 1];
      	labels += '<span class="label-bottom label1">' + label_s + '</span>';
 
    }else if(tag.indexOf('label2:') != -1){
        check_label = true;
        var label_s = tag.split(':');
        label_s = label_s[label_s.length - 1];
      	labels += '<span class="label-bottom label2">' + label_s + '</span>';
 
    }
    
  });
  if(check_label){
    htmlTag += '<div class="labels-app">'+ labels +'</div>';
  }
  return htmlTag;  
}
function buildPrice(data, onSale, variant) {
  var priceHtml = '',
    onSaleClass = onSale ? ' price--on-sale' : '',
    onSoldOutClass = variant.available ? '':' price--sold-out',
    onUnitPriceMeasurementClass = variant.unit_price_measurement ? ' price--unit-available':'';
  priceHtml += '<dl class="price' + onSaleClass + onSoldOutClass + onUnitPriceMeasurementClass +'" data-price>';
//   if (bcSfFilterConfig.custom.vendor_enable) {
//     priceHtml += '<div class="price__vendor">';
//     priceHtml += '<dt>';
//     priceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.vendor + '</span>';
//     priceHtml += '</dt>';
//     priceHtml += '<dd>';
//     priceHtml += data.vendor;
//     priceHtml += '</dd>';
//     priceHtml += '</div>';
//   }
  priceHtml += '<div class="price__sale">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.regular_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.sale_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="or_price price-item price-item--sale" data-sale-price>';
  priceHtml += bcsffilter.formatMoney(variant.price, bcsffilter.moneyFormat);
  priceHtml += '</span>';
  priceHtml += '<span class="price-item__label price-item__label--sale" aria-hidden="true">'+ bcSfFilterConfig.label.sale + '</span>';
  priceHtml += '</dd>';
  priceHtml += '<dd>';
  priceHtml += '<s class="compare price-item price-item--regular" data-regular-price>';
  priceHtml += bcsffilter.formatMoney(variant.compare_at_price, bcsffilter.moneyFormat);
  priceHtml += '</s>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '<div class="price__regular ">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.regular_price + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--regular or_price" data-regular-price>';
  priceHtml += bcsffilter.formatMoney(variant.price, bcsffilter.moneyFormat);
  priceHtml += '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  // uNI
  priceHtml += '<div class="price__unit">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.unit_price_label + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd class="price-unit-price">';
  var unit_price_separator = '<span aria-hidden="true">/</span><span class="visually-hidden">' + bcSfFilterConfig.label.unit_price_label + '&nbsp;</span>';
  var unit_price_base_unit = '<span data-unit-price-base-unit>';
  if( variant.available && variant.unit_price_measurement){
      if (variant.unit_price_measurement.reference_value != 1){
        unit_price_base_unit += variant.unit_price_measurement.reference_value;
      }  
      unit_price_base_unit +=  variant.unit_price_measurement.reference_unit;
  } 
  unit_price_base_unit += '</span>';

  priceHtml += '<span data-unit-price>';
  priceHtml += bcsffilter.formatMoney(variant.unit_price, bcsffilter.moneyFormat);
  priceHtml += '</span>';
  priceHtml += unit_price_separator;
  priceHtml += unit_price_base_unit;
  priceHtml += '</dd>';
  priceHtml += '</div>';

  priceHtml += '<div class="price__availability">';
  priceHtml += '<dt>';
  priceHtml += '<span class="visually-hidden visually-hidden--inline">' + bcSfFilterConfig.label.availability + '</span>';
  priceHtml += '</dt>';
  priceHtml += '<dd>';
  priceHtml += '<span class="price-item price-item--regular">' + bcSfFilterConfig.label.sold_out + '</span>';
  priceHtml += '</dd>';
  priceHtml += '</div>';
  priceHtml += '</dl>';

  return priceHtml;
}


// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }

  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;

    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

    // Build page items
    var currentPage = bcSfFilterConfig.label.current_page.replace(/{{ current }}/g, currentPage).replace(/{{ total }}/g, totalPage);
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, currentPage);

    jQ(this.selector.pagination).html(paginationHtml);
  }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');

    var sortingArr = this.getSortingList();
    if (sortingArr) {
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        sortingItemsHtml += '<option value="' + k + '">' + sortingArr[k] + '</option>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      jQ(this.selector.topSorting).html(html);

      // Set current value
      jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
    }
  }
};

// Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
  var itemHtml = '<span>View As </span>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="bc-sf-filter-display-item bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><span class="fallback-text">Grid view</span></span></a>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="bc-sf-filter-display-item bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><span class="fallback-text">List view</span></span></a>';
  jQ(this.selector.topDisplayType).html(itemHtml);

  // Active current display type
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
  jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
  if (this.queryParams.display == 'list') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
  } else if (this.queryParams.display == 'grid') {
    jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
  }
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
  
    /* start-initialize-bc-al */
    var self = this;
    var alEnable = true;
    if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
      alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
    }
    if (alEnable === true && typeof BCActionList !== 'undefined') {
        if (typeof bcActionList === 'undefined') {
            bcActionList = new BCActionList();
        }else{
          if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
              bcActionList.initFlag = false;
              bcActionList.alInit(bcSfFilterParams, bcAlParams);
          } else {
              bcActionList.alInit();
          }
        }
    }
    /* end-initialize-bc-al */
  var productSelector = jQ(this.selector.products);
  if (this.queryParams.display == 'list') {
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
  jQ('#Collection .product-card .full-width-link').each(function(){
    var hrefItem = jQ(this).attr('href') + '.json';
    var $this = $(this);
    $.ajax({
      url: hrefItem
    }).done(function(data) {
      var altImg = data.product.image.alt;
      $this.closest('.product-card').find('img').attr('alt',altImg);
    });
    
  });
  
};
//Build event of a filter option when selected
function onInteractWithFilterOptionValue(event, element, filterType, displayType, selectType, keepValuesStatic) {
    var productNumber = jQ(element).data('count');
    var keepValuesStatic = typeof keepValuesStatic !== 'undefined' ? (keepValuesStatic === 'true') : false;
    if ((bcsffilter.isMobile() && bcsffilter.mobileStyle == 'style2') || (bcsffilter.isMobile() && bcsffilter.mobileStyle == 'style3')) {
        // Prevent reloading page
        if(filterType != 'collection'){
          event.preventDefault();
        }
        if (productNumber > 0 || (keepValuesStatic === true && filterType == 'collection') || filterType == 'price') {

            // This is action of clicking of user, not browser event
            bcsffilter.internalClick = true;
            if (selectType == 'single') {
                jQ('.bc-sf-filter-option-block-active').find('ul li').children().removeClass('selected');
            }
            if(filterType == 'price'){
               jQ(element).addClass('selected');
            }else{
               // Highlight selected filter options
                jQ(element).toggleClass('selected');
                jQ(element).siblings().toggleClass('selected');
            }
            // Build
            bcsffilter.buildFilterSelectionMobile();
            var id = jQ(element).attr('data-id');
            var value = decodeURIComponent(jQ(element).attr('data-value'));
            if (filterType == 'collection') {
                    bcsffilter.queryParams.collection_scope = bcsffilter.collectionId = jQ(element).data('collection-scope');
                }
            var newUrl = (displayType == 'list' && selectType == 'single') ? jQ(element).attr('href') : bcsffilter.buildFilterOptionLink(id, value, filterType, displayType, selectType);
            bcsffilter.onChangeData(newUrl, filterType, value, id);
        }
    } else {
        if (keepValuesStatic === false && displayType != 'sub_category') {
            // Prevent reloading page
            event.preventDefault();
            if (productNumber > 0 || productNumber == undefined) {
                // This is action of clicking of user, not browser event
                bcsffilter.internalClick = true;
                // Get value of the filter option selected
                var id = jQ(element).attr('data-id');
                var value = decodeURIComponent(jQ(element).attr('data-value'));
                // Set value collectionId for data of collection_scope used in API params
                if (filterType == 'collection') {
                    bcsffilter.queryParams.collection_scope = bcsffilter.collectionId = jQ(element).data('collection-scope');
                }
                // Build new url
                var newUrl = ((displayType == 'list' || displayType == 'sub_category') && selectType == 'single') ? jQ(element).attr('href') : bcsffilter.buildFilterOptionLink(id, value, filterType, displayType, selectType);
                bcsffilter.onChangeData(newUrl, filterType, value, id);
            }
        }
    }
}

// Declare Template
BCSfFilter.prototype.getFilterTreeMobileTemplate = function(style) {
    switch(style) {
        case 'style2':
        case 'style3':
            return {
                toolbar: '<div id="bc-sf-filter-mobile-toolbar"><div class="bc-sf-filter-mobile-toolbar-header">' + bcsffilter.getSettingValue('label.refineMobile') + '</div><div class="bc-sf-filter-mobile-toolbar-items"><div class="bc-sf-filter-mobile-toolbar-left"></div><div class="bc-sf-filter-mobile-toolbar-right"></div></div></div>',
                footer: '<div id="bc-sf-filter-mobile-footer"><span class="clear-all-footer"></span><button type="button" onClick="showResultMobile(true)">' + bcsffilter.getSettingValue('label.showResult') + '</button></div>'
            }
        default:
            return '';
    }
};
// Build Toolbar
BCSfFilter.prototype.buildToolbarFilterTreeMobile = function(status) {
    if (status == 'open') {
        var allText = '<span class="all">' + bcSfFilterConfig.label_basic.all + '</span>';
        jQ('.bc-sf-filter-mobile-toolbar-header').html(jQ('.bc-sf-filter-option-block-active').data('type') + allText ).addClass('change-header-filter');
        jQ('.bc-sf-filter-mobile-toolbar-left').html('<a href="javascript:;" onClick="showResultMobile(true)" class="bc-sf-filter-close-btn">' + this.getSettingValue('label.close') + '</a> <a class="bc-sf-filter-mobile-apply" onclick="applyFilterOption()">' + this.getSettingValue('label.apply') + '</a>');
        if (jQ('.bc-sf-filter-option-block-active').data('type') != 'collection') {
            jQ('.bc-sf-filter-mobile-toolbar-right').html('<a class="' + this.class.clearButton + '" onClick="clearFilterOptionMobile()">' + this.getSettingValue('label.clear') + '</a>');
        } else {
            jQ('.bc-sf-filter-mobile-toolbar-right').empty();
        }

    } else {
        jQ('.bc-sf-filter-mobile-toolbar-header').html(bcSfFilterConfig.label.refineMobile).removeClass('change-header-filter').remove('.all');
        jQ('.bc-sf-filter-mobile-toolbar-left').html('<a href="javascript:;" class="bc-sf-filter-close-btn" onClick="closeFilterMobile()">' + this.getSettingValue('label.close') + '</a>');
        jQ('.clear-all-footer').html(this.buildClearAllButton());
        
    }
}

BCSfFilter.prototype.buildFilterTreeMobileButtonEvent = function() {
    var _this = this;
    var filterSelector = this.getSelector('filterTree');
    var mobileBtnSelector = this.getSelector('filterTreeMobileButton');
    jQ(mobileBtnSelector).unbind('click');
    jQ(mobileBtnSelector).on('click', function() {
        var style = _this.mobileStyle;
        // Full Width style
        if (style == 'style2' || style == 'style3') {
            jQ(filterSelector).toggleClass('bc-sf-filter-tree-mobile-open');
            // Build mobile content
            _this.buildFilterTreeMobile();
            // Remove scrollbar
            //_this.removeScrollbar(jQ('.' + _this.class.filterBlockContent));
        }
        // Default style
        else {
            // Change button text when clicking
            if (_this.getSettingValue('general.changeMobileButtonLabel')) {
                var openClass = _this.class.mobileButtonOpen;
                jQ(this).toggleClass(openClass);
                var label = jQ(this).hasClass(openClass) ? _this.getSettingValue('label.refineMobileCollapse') : _this.getSettingValue('label.refineMobile');
                jQ(this).text(label);
            }
            jQ(filterSelector).slideToggle(function () {
                jQ(filterSelector).toggleClass('bc-sf-filter-tree-mobile-open');
                _this.buildFilterOptionBoxStyle(jQ(this));                
                // Re-initialize jscrollpane
                _this.buildFilterScrollbar();
            });
        }
    });
};
// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  var totalProduct = '';
  if (data.total_product == 1) {
    totalProduct = bcSfFilterConfig.label.items_with_count_one.replace(/{{ count }}/g, data.total_product);
  } else {
    totalProduct = bcSfFilterConfig.label.items_with_count_other.replace(/{{ count }}/g, data.total_product);
  }
  jQ('#bc-sf-filter-total-product').html(totalProduct);
   // Add funtion scrollBack
    var productItemSelector = '.grid__item--collection-template';
    scrollBack(productItemSelector);
  
  var posts = bcSfFilterConfig.posts;
        if(posts.length > 0){
          var products = $('#bc-sf-filter-products .grid__item');
          $('#bc-sf-filter-products .grid__item').each(function(index){
            var nextP = $(products[index + 1]);                
            var pro = '.product-'+ $(this).data('id');
            var inx = index;
            if( nextP.hasClass('promo-block')){
              var inx = index + 1;
            }else{
              var inx = index + 2;
            }
              for(var i = 0; i< posts.length; i++){
                  var post = posts[i];
                  var position = parseInt(post.position);
                  if( inx == position && ! nextP.hasClass('promo-block')){
                    var articleUrl =  '/blogs/news/' + post.post + '?view=ajax';
                    $.get(articleUrl, function(data){
                      $(data).insertAfter(pro);	
                    });
                  }
              }
          });
          
        }
};

function scrollBack(productItemSelector) {
    // Get current page
    var page = parseInt(bcsffilter.queryParams.page);
   
    jQ(productItemSelector).each(function() {
        if (jQ(this).data('page') == undefined) {
            jQ(this).attr('data-page', page);
        }
    });
  var urlW = new URL(window.location.href);
    // Change params on the address bar when click to item
    jQ(productItemSelector).click(function(e){
       var urlW = new URL(window.location.href);
        if (urlW.searchParams.get('page') !== null){
              urlW.searchParams.delete('page');
        }
        if (urlW.searchParams.get('bc-product-current') !== null)
            urlW.searchParams.delete("bc-product-current");
      
        urlW.searchParams.append('bc-product-current', jQ(this).attr('id'));
        urlW.searchParams.append('currentpage', jQ(this).data('page'));
        urlW.searchParams.append('positions', jQ(this).offset().top);
        window.history.pushState('', '', urlW.toString());
    }); 
    
    // Turn off scroll default  of browser
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
  
    if (history.state !== null) {
        var urlW = new URL(window.location.href);
        var itemId = urlW.searchParams.get('bc-product-current');
        var positionS = urlW.searchParams.get('positions') - jQ('.site-header').height();
        var currentPage = urlW.searchParams.get('currentpage');
        
        if (itemId !== null) {
          	if( page < currentPage){
              var topScrolls = $('#shopify-section-footer').offset().top ;
              jQ("html, body").animate({ scrollTop: topScrolls },10);
            }else{
              urlW.searchParams.delete("bc-product-current");
              urlW.searchParams.delete("positions");
              urlW.searchParams.delete("currentpage");
              urlW.searchParams.delete("page");
              //if (urlW.searchParams.get('page')) urlW.searchParams.delete("page");
              window.history.pushState('', '', urlW.toString());
              //var topScroll = jQ('#'+itemId).offset().top - jQ('.site-header').height();
              jQ("html, body").animate({ scrollTop: positionS }, 1000);
           }
        }
    }
}

// Build Infinite Loading event
BCSfFilter.prototype.buildInfiniteLoadingEvent = function(data) {
    var _this = this;
    var currentPage = parseInt(this.queryParams.page);

    // Using scrolling to prevent callling onscroll twice
    var scrolling = 0;

    // onscroll event
    // When windown reaches the bottom of product list
    	
    var scrollToBottom = false;
    if (jQ(this.getSelector('bottomPagination')).length > 0) {
        jQ(window).scroll(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var scrollbarHeight = jQ(window).height() * (jQ(window).height() / jQ(document).outerHeight());
            var maxPos = parseInt(jQ(_this.getSelector('bottomPagination')).offset().top);
            var maxScroll = parseInt(jQ(window).scrollTop()) + scrollbarHeight + _this.getSettingValue('general.positionShowInfiniteLoading');
            if ((jQ(window).scrollTop() + jQ(window).height() + scrollbarHeight) >= jQ(document).outerHeight() - 100) {
                scrollToBottom = true;
            }
            
            // Begin loading more products
            if (scrolling == 0 && data.products.length > 0) {
                if (maxScroll >= maxPos || (maxScroll < maxPos && scrollToBottom)) {
                    // Show Loading
                    _this.showLoadMoreLoading();

                    // Prevent scrolling twice
                    scrolling = 1;

                    // Next page
                    currentPage ++;

                    // Build data of next page
                    _this.internalClick = true;
                    _this.queryParams.limit = _this.getSettingValue('general.limit');
                    _this.queryParams.page = currentPage;
                    _this.getFilterData('page');
                }
            }
        });
    }
};
// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};

function customizeJsonProductData(data) {for (var i = 0; i < data.variants.length; i++) {var variant = data.variants[i];var featureImage = data.images.filter(function(e) {return e.src == variant.image;});if (featureImage.length > 0) {variant.featured_image = {"id": featureImage[0]['id'],"product_id": data.id,"position": featureImage[0]['position'],"created_at": "","updated_at": "","alt": null,"width": featureImage[0]['width'], "height": featureImage[0]['height'], "src": featureImage[0]['src'], "variant_ids": [variant.id]}} else {variant.featured_image = '';};};var self = bcsffilter;var itemJson = {"id": data.id,"title": data.title,"handle": data.handle,"vendor": data.vendor,"variants": data.variants,"url": self.buildProductItemUrl(data),"options_with_values": data.options_with_values,"images": data.images,"images_info": data.images_info,"available": data.available,"price_min": data.price_min,"price_max": data.price_max,"compare_at_price_min": data.compare_at_price_min,"compare_at_price_max": data.compare_at_price_max};return itemJson;};
BCSfFilter.prototype.prepareProductData = function(data) {var countData = data.length;for (var k = 0; k < countData; k++) {data[k]['images'] = data[k]['images_info'];if (data[k]['images'].length > 0) {data[k]['featured_image'] = data[k]['images'][0]} else {data[k]['featured_image'] = {src: bcSfFilterConfig.general.no_image_url,width: '',height: '',aspect_ratio: 0}}data[k]['url'] = '/products/' + data[k].handle;var optionsArr = [];var countOptionsWithValues = data[k]['options_with_values'].length;for (var i = 0; i < countOptionsWithValues; i++) {optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options'] = optionsArr;if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) {var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim();function updateMultiCurrencyPrice(oldPrice, newPrice) {if (typeof newPrice != 'undefined') {return newPrice;}return oldPrice;}data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]);data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]);data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]);data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]);}data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100;data[k]['price'] = data[k]['price_min'];data[k]['compare_at_price'] = data[k]['compare_at_price_min'];data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max'];var firstVariant = data[k]['variants'][0];if (getParam('variant') !== null && getParam('variant') != '') {var paramVariant = data[k]['variants'].filter(function(e) {return e.id == getParam('variant')});if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0]} else {var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {if (data[k]['variants'][i].available) {firstVariant = data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant'] = firstVariant;var countVariants = data[k]['variants'].length;for (var i = 0; i < countVariants; i++) {var variantOptionArr = [];var count = 1;var variant = data[k]['variants'][i];var variantOptions = variant['merged_options'];if (Array.isArray(variantOptions)) {var countVariantOptions = variantOptions.length;for (var j = 0; j < countVariantOptions; j++) {var temp = variantOptions[j].split(':');data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];data[k]['variants'][i]['option_' + temp[0]] = temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options'] = variantOptionArr}data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100}data[k]['description'] = data[k]['content'] = data[k]['body_html'];if (data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0) {data[k]['tags'] = data[k]['original_tags'].slice(0);}data[k]['json'] = customizeJsonProductData(data[k]);}return data;};

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
