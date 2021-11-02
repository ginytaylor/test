// let slick_cdn = document.createElement('script');
// slick_cdn.setAttribute('type','text/javascript');
// slick_cdn.setAttribute('src','//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js');
// document.head.appendChild(slick_cdn);
  
let jquery1_12_cdn = document.createElement('script');
jquery1_12_cdn.setAttribute('type','text/javascript');
jquery1_12_cdn.setAttribute('src','//code.jquery.com/ui/1.12.1/jquery-ui.js');
document.head.appendChild(jquery1_12_cdn);

let notification_header_script = document.createElement('script');
notification_header_script.setAttribute('type','text/javascript');
notification_header_script.setAttribute('src','//owlcarousel2.github.io/OwlCarousel2/assets/owlcarousel/owl.carousel.js');
document.head.appendChild(notification_header_script);

$(document).ready(function(){
  if($(window).width() < 426){
    $('#AccessibleNav').detach().prependTo('#shopify-section-hero >div').removeClass('small--hide');
    var slickopts_ = {
      slidesToShow: 3,
      slidesToScroll: 2,
      speed: 200,
      loop:false,
      infinite:true,
      rows: 2, // Removes the linear order. Would expect card 5 to be on next row, not stacked in groups.
    }
    $('#AccessibleNav ul.site-nav').not('.slick-initialized').slick(slickopts_);
  }
    $('body').addClass('special-page-s');
    var tabFunction = setInterval(function(){ 
          $('.box-theshop > .container' ).tabs();
          $('.box-theshop .tab-content > .tab-default').owlCarousel({
            items:5,
            nav: true,
            rows: 1,
            loop:false,
            // center: true,
            // loop:true,
            responsive: {
                0: {
                    items: 2
                },
                769: {
                    items: 4
                },
                1440:{
                  items: 5
                }
            }
          });
          $('.collection-grid ul.grid--uniform').owlCarousel({
            items:6,
            nav: true,
            dots: false,
            nav:false,
            responsive: {
                0: {
                    items: 3,
                },
                769: {
                    items: 6
                }
            }
          });
      },700);
    setTimeout(function(){ clearInterval(tabFunction); }, 2100);
  
  
    $('.nav-tab-home > li').click(function() {
      $('.box-theshop .tab-content > div').hide();
      let tabActive = $(this).data('tab');
      $(tabActive).show();
      if(!$(tabActive).hasClass('tab-default')){
      $(tabActive).addClass('tab-default');
      $(tabActive).owlCarousel({
        nav: true,
        rows: 1,
        loop:false,
        responsive: {
            0: {
                items: 2
            },
            769: {
              items: 4
            },
            1440: {
                items: 5
            }
        }
      });
      }
    });
    setTimeout(function(){ 
      if(($('.index-section-spc .grid-items-ajax > li').length) != 0 && !$('.index-section-spc .grid-items-ajax').hasClass('owl-loaded')){
        console.log(12)
        $('.index-section-spc .grid-items-ajax').owlCarousel({
          items:5,
          nav: true,
          rows: 1,
          loop:false,
          // center: true,
          // loop:true,
          responsive: {
              0: {
                  items: 2
              },
              769: {
                  items: 4
              },
              1440:{
                items: 5
              }
          }
        });
      }
      if(($('.index-section-hot-ten .grid-items-ajax > li').length) != 0 && !$('.index-section-hot-ten .grid-items-ajax').hasClass('owl-loaded')){
        $('.index-section-hot-ten .grid-items-ajax').owlCarousel({
        items:5,
        nav: true,
        rows: 1,
        loop:false,
        // center: true,
        // loop:true,
        responsive: {
            0: {
                items: 2
            },
            769: {
                items: 4
            },
            1440:{
              items: 5
            }
        }
      });
    }
    },1500);
    // setTimeout(function(){ clearInterval(slideFunction); },2100);
});
    
  //   setTimeout(function(){
  //   $('.logo-bar-spec').slick({
  //       slidesToShow: 8,
  //       slidesToScroll: 8,
  //       infinite: true,
  //       prevArrow: '<div class="arr-prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-left" viewBox="0 0 7 11"><path d="M5.5.037a1.5 1.5 0 0 1 1.06 2.56l-2.94 2.94 2.94 2.94a1.5 1.5 0 0 1-2.12 2.12l-4-4a1.5 1.5 0 0 1 0-2.12l4-4A1.5 1.5 0 0 1 5.5.037z" fill="#fff" class="layer"/></svg></div>',
  //       nextArrow: '<div class="arr-next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-right" viewBox="0 0 7 11"><path d="M1.5 11A1.5 1.5 0 0 1 .44 8.44L3.38 5.5.44 2.56A1.5 1.5 0 0 1 2.56.44l4 4a1.5 1.5 0 0 1 0 2.12l-4 4A1.5 1.5 0 0 1 1.5 11z" fill="#fff"/></svg></div>',
  //       responsive: [
  //           {
  //           breakpoint: 768,
  //               settings: {
  //                   slidesToShow: 6
  //               }
  //           },
  //           {
  //               breakpoint: 480,
  //               settings: {
  //                   slidesToShow: 4
  //               }
  //           }
  //       ]
  //   });
  // },1000);
    
  // Lazyload For product list;
   $('.grid-items-ajax').each(function(){
      var ob = $(this);
      var blockId = $(this).data('block-id');
      var limit = $(this).data('limit');
      var widthClass = $(this).data('width') + ' grid__item--' + blockId ;
      var ajax = $(this).data('url');
      
      if(ajax && ajax.indexOf('collections')!=-1){
        $.ajax({
          url: ajax,
        }).done(function( response) {
           ob.html(response);
           var items = ob.find('.grid__item');
           items.addClass(widthClass);
           items.each(function(){
          		var index = $(this).data('index');
                var sectionId = blockId + '-' + $(this).data('product-id');
                $(this).find('.product-card').attr('data-section-id',sectionId);
                var jsonId  = 'ProductJson-' + sectionId;
                $(this).find('.product-json').attr('id',jsonId); 
                if(index > limit)
                  $(this).remove();
           });
           console.log( 111);
           var sections = new theme.Sections();
           sections.register('index-section-hot-ten', theme.Product);
          });
      }
    });

  
