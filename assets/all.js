$(document).ready(function(){
	$('.linkstyle').attr('rel','stylesheet');
    if($('body').hasClass('template-article')){
 
      var relatedProducts = $('#related-blog-products');
      var ajax = relatedProducts.data('url');
      if(ajax){
        relatedProducts.load(ajax,function(responseTxt, statusTxt, xhr){
          
        });
      }
    }
   
});