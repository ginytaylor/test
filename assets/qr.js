(function ($) {
    var   doc = $(document),body = $('body');
    doc.ready(function () {
        qr.init();
     
    })
    var qr = {
        init: function () {
           this.qrPage();
        },
        qrPage: function () {
            if($('#result-qr-code').length > 0){
                this.queryParams();
                var params =  Shopify.queryParams;
                if(params.q != undefined){
                var locale = (Shopify.locale == 'en')?'': ('/' + Shopify.locale);
                $.ajax({
                      type: "get",
                      url: locale + '/search?q=variants.sku:'+ params.q+'\*&view=qr&type=product',
                      success: function (data) {
                        console.log(data)
                        $('#result-qr-code').html(data);
                        setTimeout(function(){
                            scandale.mixInPlayPDP();
                            scandale.mixPlay();
                            if($('.swiper-container-slider').length > 0){
                                var swiper = new Swiper('.swiper-container-slider', {
                                    observer: true,
                                    rebuildOnUpdate: true,
                                    observeParents: true,
                                    slidesPerView: 'auto',
                                    spaceBetween: 0,
                                    loop: true,                       
                                    breakpoints: {
                                        767: {
                                            spaceBetween: 0
                                        },
                                        320:{
                                            spaceBetween: 0
                                        }
                                    }
                                });
                            }
                            if($('.ourPeopleProjectSliderOuter').length > 0){
                   
                                var ourPeopleSlider =  new Swiper(".ourPeopleProjectSlider", {
                                    spaceBetween: 10,
                                    loop: true,
                                    navigation: {
                                      nextEl: ".swiper-button-next-rs",
                                      prevEl: ".swiper-button-prev-rs"
                                    }
                                });
                            }
                        },500)
                      }
                });
              }
            }  
        },
        queryParams: function () {
            Shopify.queryParams = {};
            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        }
    }
})($);