
var ItemSwiperList = [];
(function ($) {
    var   doc = $(document);
    
    var brand = {
        init: function () {
            this.slider();
            this.brandShowFull();
        },
        brandShowFull: function(){
          $(document).on('click','.linkList a',function(e){
              var thisOb = this;
              e.preventDefault();
              var idCollection = $('#' + $(this).data('id'));
              var heightHeader =  $('.site-header').height();
              if(  $('.site-header.scrolling').length > 0){
                  heightHeader = $('.site-header').height();
                  var topP =  idCollection.offset().top - heightHeader;
              }else{
                 var topP =  idCollection.offset().top - heightHeader - heightHeader;
              }
              if( !$(this).hasClass('active')){
                $(".swiper-container").each(function( index, item){
                    if( index == $(thisOb).closest('li').index()){
                      this.swiper.destroy(); 
                    }
                });
                idCollection.addClass('remove-slider');
              }
              $("html, body").animate({
                  scrollTop: topP
              }, 1000);
              $(this).addClass('active');
              return false;
          });
        },
        slider: function(){
          if($('.brand-slider .swiper-wrapper').length > 0 ){
            var brandThis = this;
            var queries = [];
            $('.brand-slider .swiper-wrapper').each(function(){
              var slider = $(this);
              var sectionId = slider.data('id');
              var ajax = slider.data('url');
              var sliderOb = '.swiper-container-' + sectionId;
              var sliderNext = '.swiper-button-next-' + sectionId;
              var sliderPrev = '.swiper-button-prev-' + sectionId;
              
              if(ajax){
                queries.push(slider.load(ajax,function(responseTxt, statusTxt, xhr){
                  if(statusTxt == "success"){
                    brandThis.brandSlider(sliderOb,sliderNext,sliderPrev);
               
                  }
                }));
              }else{
                brandThis.brandSlider(sliderOb,sliderNext,sliderPrev);
        
              }
              
            });
          }
        },
        brandSlider: function(sliderOb,sliderNext,sliderPrev){
          var ItemSwiper = new Swiper(sliderOb, {
                  autoHeight: false,
                  navigation: {
                    nextEl: sliderNext,
                    prevEl: sliderPrev
                  },
                  loop: true,
                  slidesPerView: 'auto',
                  spaceBetween: 24,
                  breakpoints: {
                    640: {
                        spaceBetween: 24
                    },
                    320:{
                        spaceBetween: 14
                    },
                },
          });
         
        }
    }
    doc.ready(function () {
        brand.init();
    })
})(jQuery);