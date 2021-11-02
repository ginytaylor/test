if(!window.SwymCallbacks){window.SwymCallbacks = [];}
var sectionss = new theme.Sections();
window.SwymCallbacks.push(function(){
  _swat.fetchWrtEventTypeET(function(products){
   if(products.length > 0){
    
    products.forEach(function( product ){
      var productUrl = product.du.split('/');
      var product_url = productUrl[productUrl.length - 1];
      if(product_url.indexOf('?variant') == -1){
         productUrl = '/products/' + productUrl[productUrl.length - 1] + '?view=ajax-grid';
       }else{
          productUrl = '/products/' + productUrl[productUrl.length - 1] + '&view=ajax-grid';
       }
      $.get(productUrl , function(data, status){
          if(status == 'success'){
              var HTML = '<div class="grid__item col-3 col-md-4 col-small-3">';
              HTML += data;
              HTML +='<div class="hide scriptOb">';
              HTML += JSON.stringify(product);
              HTML += '</div>';
              HTML += '</div>';
             $('#wishlistList').append(HTML);
              
              var sectionName = 'collection-form-' + product.empi;
              sectionss.register(sectionName , theme.Product);
              if(window._swat){
                window._swat.initializeActionButtons("#product-content");
              }else{
                window.SwymCallbacks = window.SwymCallbacks || [];

                window.SwymCallbacks.push(function(){
                  window._swat.initializeActionButtons("#product-content");
                });
              }
            $('.ajax-loader').remove();  
          }
      });
    });
   }else{
    $('.ajax-loader').remove();  
   }
 }, _swat.EventTypes.addToWishlist);});
function swymCallbackFn(){
   $(document).on('click','.removeWishlist',function(e){
    e.preventDefault();
    var productId = $(this).data('id');
    var __this = $(this);
    var obScript = __this.closest('.grid__item').find('.scriptOb')[0];
    var productOb = $($.parseJSON($(obScript).html()))[0];
    window._swat.removeFromWishList(
      {
        "epi": productOb.epi,
        "du": productOb.du,
        "empi": productOb.empi,
        "iu" : productOb.iu,
        "pr": productOb.pr
      },
      function(r) {
        __this.closest('.grid__item').remove()
      }
    );
  }) 
}
 window.SwymCallbacks.push(swymCallbackFn);