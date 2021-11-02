$(document).ready(function(){
    $('body').on('click','.saso-ul li',function(){
        $('.saso-ul li').removeClass('selected');
        $(this).addClass('selected');
        var qty =  parseInt($(this).find('.qty').html());
        $('#Quantity-product-template_2').val(qty);
        $('#Quantity-product-template').val(qty);
        var price_new = $(this).find('.saso-price').html();
        $('.product-pages .product_meta .product_price .or_price').parent().html('<span class="or_price price-item price-item--sale"><span class="class="money pre-money">' + price_new +'</span></span>');

    });
   var qtyParam = getUrlParameter('qty');
    if(qtyParam != undefined){
        $('.saso-ul li').each(function(){
            var qty = parseInt($(this).find('.qty').html());
            var price = $(this).find('.saso-price').html()
            $(this).find('.bold-bundles-widget-item__price--new').html(price);
            if(qtyParam == qty){
                $(this).addClass('selected');
                $('.product-pages .product_meta .product_price .or_price').parent().html('<span class="or_price price-item price-item--sale"><span class="class="money pre-money">' + price +'</span></span>');
            }
        });
        $('#Quantity-product-template_2').val(qtyParam);
        $('#Quantity-product-template').val(qtyParam);
    }
    
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

          for (i = 0; i < sURLVariables.length; i++) {
              sParameterName = sURLVariables[i].split('=');

              if (sParameterName[0] === sParam) {
                  return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
              }
          }
    }
        setTimeout(function(){
            $('.cart__submit').attr('disabled','disabled');
        },500);
        setTimeout(function(){
            $('.cart__submit').removeAttr('disabled');
        },4500);
          $(document).on('click','.close-popup',function(){
        	$('.mfp-close').click();
            $('body.template-cart').removeClass('showQuickInterval');
        });
        var popup = setInterval(function(){ 
          	var itemCount = $('.saso-product-container').length;
            var totalPrice = 0;
            if(itemCount > 0 && $('body').hasClass('template-cart')){
              if(!$('body.template-cart').hasClass('quickInterval')){
                $('body.template-cart').addClass('quickInterval');
                $('body.template-cart').addClass('showQuickInterval');
                $('.saso-product-container').each(function(){
                  var price = $(this).data('price');
                  price = price.replace( /^\D+/g, '');
                  price = price.replace( /,/g, '');
                  price = parseInt(price);
                  totalPrice += price;
                  if(price == 0){
                      $(this).find('.saso-add-to-cart.saso-crosssell-nav').click();
                  }
                });
                if(totalPrice == 0){
                    $('.mfp-close').click();
                }else{
                  $('body.template-cart').addClass('m_showQuickInterval');
                }
                
              }
            }
			
        }, 1);
});