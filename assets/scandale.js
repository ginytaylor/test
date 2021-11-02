    var   doc = $(document),body = $('body');
    doc.ready(function () {
        scandale.init();
    })
    var scandale = {
        init: function () {
            
            this.header();
            this.msg();
            this.featuredCollection();
            this.quotes();
            this.videoPlay();
            this.backgroundVideoPlay();
            this.cartTop();
            this.menuMobile();
            this.collectionPage();
            this.productSwatchPLP();
            this.global();
            this.ip();
            this.scrollTop();
            this.productSwatchPDP();
            this.showFormAddToCartPLP();
            this.tabsPDP();
            this.imageSliderPDP();
            this.mixInPlayPDP();
            this.mixPlay();
            this.instagramPDP();
            this.tableSize();
            this.oos();
            this.registerPage();
            this.loginPage();
            this.blogPagination();
            this.newsletterPopup();
            this.logoBar();
            this.recentlyViewed();
            this.recentTerm();
            this.historyPage();
            this.quizSize();
            this.homeAnimation();
            this.radicalCMS();
            this.cmsAnimation();
            this.formAddress();
            this.mixToPlayPage();
            this.reviewCustom();
            this.footerFormNewsletter();
            this.convertCurrencyShipping();
            this.wishlistRemove();
            this.redirectTrace();
        },
        redirectTrace: function(){
            if($('body.template-404').length > 0){
                var wUrl = window.location.pathname;
                if(wUrl.indexOf('/products/') != -1){
                    window.location.href = '/pages/traceable-transparent'
                }
            }
        },
        wishlistRemove:function(){
            if(!window.SwymCallbacks){window.SwymCallbacks = [];}
            window.SwymCallbacks.push(this.swymCallbackFn);
        },
        swymCallbackFn:function(){
               $(document).on('click','.swym-added',function(e){
               
                e.preventDefault();
                var productId = $(this).data('product-id');
                var __this = $(this);
                window._swat.removeFromWishList(
                  {
                    "epi": __this.data('variant-id'),
                    "du": __this.data('product-url'),
                    "empi": productId,
                    "pr":  __this.data('product-price')
                  },
                  function(r) {
                      console.log('Removed to wishlist');
                    __this.removeClass('swym-added').removeClass('disabled');
                  }
                );
              }) 
        },
        convertCurrencyShipping: function(){

            if($('.shipping-price').length > 0){
                var shippingText =  $('.shipping-price').html();
                if( Shopify.currency.active == 'GBP'){
                    shippingText = shippingText.replace('£69','£59');
                    $('.shipping-price').html(shippingText)
                }
            }
            if($('.announcement-bar__message').length > 0){
                $('.announcement-bar__message').each(function(){
                    if( Shopify.currency.active == 'GBP'){
                        var contentHtml = $(this).html();
                        contentHtml = contentHtml.replace('€69','£59');
                        $(this).html(contentHtml)
                    }
                });
            }
        },
        footerFormNewsletter: function(){
            var __this = this;
            $('#ContactFooter .newsletter__submit').on('click',function(e){
                e.preventDefault();
                var email = $('#ContactFooter-email').val();
                if( __this.validateEmail(email) == false){
                    $('#footer-error').show();
                    $('#ContactFooter-email').closest('.input-group').addClass('input-group--error')
                    $('#ContactFooter-email').addClass('input--error')
                }else{
                    $('#footer-error').hide();
                    $('#ContactFooter-email').removeClass('input--error')
                    $('#ContactFooter-email').closest('.input-group').removeClass('input-group--error')
                    $('#ContactFooter').submit();

                }
            })
        },
        validateEmail:function( email ){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        reviewCustom:function(){
            if($('.template-product').length > 0){
                $.get('https://stamped.io/api/widget/questions', function(data, status){
                    if(status == 'success'){
                        $('.stamped-review .stamped-starratings.stamped-review-header-starratings').each(function(){
                            $(this).append($(this).closest('.stamped-review').find('.created'))
                        });
                    }
                });
            }
        },
        mixToPlayPage:function(){
            var __this  = this;
            $(document).on('click','.page-mix-to-play .mix-play-item',function(e){
                e.preventDefault();
                var produtList = $(this).data('products');
                if(produtList != ''){
                    $(this).addClass('loading')
                    __this.mixPlayContent(produtList,true);
                }
            })
            $('#mix-to-play .btn-close-popup').click(function(){
                $('body').removeClass('show-popup').removeClass('show-mix-to-play')
            })
            if($('#mix-to-play').length > 0){
                $(window).on('scroll',function(){
                    var staticTop = $('.block-items-mix-play').offset().top -  $('.site-header').height();

                    if($(this).scrollTop() >= staticTop ){

                        $('.page-width-mix-to-play').addClass('block-page-title-active')
                    }else{
                        $('.page-width-mix-to-play').removeClass('block-page-title-active')
                    }
                })
                var sort = ['manual','best-selling','title-ascending','title-descending','price-ascending','price-descending','created-ascending', 'created-descending'];
                var sort_by = sort[Math.floor(Math.random() * sort.length)];
                let totalPages = $('.block-items-mix-play').data('total-page');
                var urlCollection = $('.block-items-mix-play').data('url') ;
                $('.block-items-mix-play .grid').load(urlCollection + '?view=ajax&sort_by=' + sort_by);
                async function loadData() {
                    var HTML = '';
                    for (let index = 2; index <= totalPages; index++) {
                        const data = await $.get(urlCollection + '?view=ajax&sort_by=' + sort_by + '&page=' + index)
                        HTML += data
                        
                    }
                    $('.block-items-mix-play .grid').append(HTML);
                }
                loadData();
            }

        },
        formAddress:function(){
            $('#address_form_new').submit(function(e){
                e.preventDefault();
                let action = $(this).attr('action');
                let dataForm = $( this ).serializeArray();
                $.post(action, dataForm,function(data, status){
                    if(status == 'success'){
                        $('#myaccount__account-details').load('/account/addresses', function(responseTxt, statusTxt, xhr){
                            if(statusTxt == "success"){
                               theme.customerTemplates.init();
                                __this.removeClass('loading')
                            }
                            if(statusTxt == "error")
                              alert("Error: " + xhr.status + ": " + xhr.statusText);
                        });
                       
                    }else{
                        console.log( data )
                    }
                });
            })
            $('.form-address form').submit(function(e){
                var __this = $(this);
                __this.closest('div').addClass('loading')
                e.preventDefault();
                let action = $(this).attr('action');
                let dataForm = $( this ).serializeArray();
                $.post(action, dataForm,function(data, status){
                    if(status == 'success'){
                        $('#myaccount__account-details').load('/account/addresses', function(responseTxt, statusTxt, xhr){
                            if(statusTxt == "success"){
                               theme.customerTemplates.init();
                                __this.removeClass('loading')
                            }
                            if(statusTxt == "error")
                              alert("Error: " + xhr.status + ": " + xhr.statusText);
                        });
                        //location.reload();
                    }else{
                        console.log( data )
                    }
                });
            })
            $(document).on('click','.address-delete-address',function(e){
                e.preventDefault();
                let msg = $(this).data('confirm-message');
                var __this = $(this);
                if (
                  confirm(
                    msg || 'Are you sure you wish to delete this address?'
                  )
                ) {
                  $.post($(this).data('target'), { _method: 'delete' } ,function(data, status){
                        if(status == 'success')
                            __this.closest('.address').remove();
                  });
                }
            })
        },
        historyPage: function(){
            if($('.history-timeline').length > 0){
                const boxRow = gsap.utils.toArray('.history-timeline  .history-row');
                boxRow.forEach((box, i) => {
                  gsap.fromTo(box,{yPercent: 0}, {
                      yPercent: 0,
                      ease: "none",
                      scrollTrigger: {
                        trigger: box,
                        toggleClass: 'active',
                        end: "bottom center",
                        onEnterBack: ({progress, direction, isActive}) => $(box).addClass('scroll-backward'),
                        onToggle: ({progress, direction, isActive}) =>  $(box).removeClass('scroll-backward'),
                        scrub: true
                      }
                    });
                });
                
                const boxImages = gsap.utils.toArray('.history-timeline  .grid-image');

                boxImages.forEach((box, i) => {
                    gsap.fromTo(box,{yPercent: -100,duration: 2}, {
                      yPercent: 0,
                      ease: "none",
                      scrollTrigger: {
                        trigger: box,
                        end: "top center",
                        scrub: true,
                      }, duration: 2
                    });
                });
                const mages = gsap.utils.toArray('.history-timeline  .grid-image img');
                mages.forEach((box, i) => {
                    gsap.fromTo(box, {yPercent: 100,duration: 2},{
                      yPercent: 0,
                      ease: "none",
                      scrollTrigger: {
                        trigger: box,
                        end: "top center",
                        scrub: true,
                      }, duration: 2
                    });
                });
                const magesBlank = gsap.utils.toArray('.history-timeline .image-blank-space');
                magesBlank.forEach((box, i) => {
                    gsap.fromTo(box, {yPercent: 35,duration: 2}, {
                      yPercent: 0,
                      ease: "none",
                      scrollTrigger: {
                        trigger: box,
                        end: "top center",
                        scrub: true,
                      }, duration: 2
                    });
                }); 
               
                $(window).on('scroll',function(){
                    if(( $(this).scrollTop() + $(window).height()) < $('.history-timeline').offset().top){
                        $('.history-row:first-child').removeClass('scroll-backward')
                    }
                    
                })
                if(( $(window).scrollTop() + $(window).height()) < $('.history-timeline').offset().top){
                    $('.history-row:first-child').removeClass('scroll-backward')
                }else{
                    $('.history-row:first-child').addClass('scroll-backward')
                }
            }    
        },
        journeyPage: function(){
            const magesBlankBlock = gsap.utils.toArray('.journey-block');
            magesBlankBlock.forEach((box, i) => {
                ScrollTrigger.create({
                    trigger: box,
                    end: "bottom bottom",
                    y: 0,
                    onEnter: self =>{
                        const boxImages = gsap.utils.toArray('.journey-block .grid-image-inner');
                        boxImages.forEach((boxS, ii) => {
                            if(i == ii ){
                                gsap.fromTo(boxS, {yPercent: -50,duration: 2}, {
                                  yPercent: 0,
                                  scrollTrigger: {
                                    trigger: box,
                                    scrub: true,
                                    end: "top center",
                                  }, duration: 2
                                });
                            }
                        });
                        const magesBlank = gsap.utils.toArray('.journey-block .grid-image');
                        magesBlank.forEach((boxx,j) => {
                            if(i == j ){
                                gsap.fromTo(boxx, {yPercent: 60,duration: 2}, {
                                  yPercent: 0,
                                  scrollTrigger: {
                                    trigger: box,
                                    scrub: true,
                                    
                                  }, duration: 2
                                });
                            }    
                        }); 
                    }
                });
                
            }); 
            $(window).on('scroll',function(){
                if( ( $(this).scrollTop() + $(window).height()) < $('.journey-history-block').offset().top){
                    $('.journey-2021').removeClass('scroll-backward')
                }
                if (($(this).innerHeight() + $(this).scrollTop()) >= $("body").height()) {
                    $('body').addClass('end-scroll')
                }else{
                    $('body').removeClass('end-scroll')
                }
            })
        },
        qrSlide:function(){
            var sliderOb = $('.content-screen-mobile .image-slider');
            var i = 0;
            var qcodeTimer = setInterval(function(){
                sliderOb.eq( i ).animate({
                    width: '100%',
                    opcity: '1'
                });
                i++;
                if((sliderOb.length + 1) == i ){
                    $('.content-screen-mobile .image-slider').css('width', 0 );
                    i = 0;
                }
            },1000)
        },
        cmsAnimation: function(){
            var ____this = this;
            if($('.journey-history-block').length > 0){
                this.journeyPage()
            }
            if($('.animation-block').length > 0){
                setInterval(function(){
                    $('.animation-block').toggleClass('finishAnimation');
                }, 5000);
            }
            if($('.all-sections').length > 0){
                ScrollTrigger.create({
                    trigger: '.all-sections',
                    toggleClass: 'anisActive',
                    start: "top " + ($('.site-header').height() + $('.site-header').height()),
                    end: "bottom 100px",
                    y: 0,
                    toggleActions: 'play none none none'
                });
            }
            if($('.block-radical-qr .qr-code').length > 0){
                var zoomQR = false;
                var heightChk =  $(window).scrollTop() + $(window).height(); 
                if (( $('.qr-code-time-line').offset().top <=   heightChk ) && zoomQR == false ){
                    ____this.qrSlide();
                }
                $(window).on('scroll',function(){
                    var heightChk =  $(this).scrollTop() + $(window).height();
                    if(($('.qr-code-time-line').offset().top + 200 ) < heightChk )
                        zoomQR = true;
                    var locationHash =  window.location.hash;
                    if(locationHash == '#traceable-transparent-factories' )
                         zoomQR = true;
                    if ( ( $('.qr-code-time-line').offset().top <=   heightChk ) && ( ($('.qr-code-time-line').offset().top + 200 ) >=   heightChk )  && zoomQR == false ){
                        zoomQR = true;
                        $('.qr-code').addClass('qr-code-zoom')
                        setTimeout(function(){ 
                            gsap.to(window, {duration: 0, scrollTo: $("#mobile-screen").offset().top - $('.site-header').height() }) 
                            ____this.qrSlide();
                        },1000)
                    }
                    
                })
                
                
            }
            // if($('#block-items-list').length > 0){
            //     gsap.fromTo('#block-items-list',{yPercent: 0,duration: 2}, {
            //       yPercent: -60,
            //       ease: "none",
            //       scrollTrigger: {
            //         trigger: '#block-items-list',
            //         start: "top center",
            //         end: "bottom bottom",
            //         scrub: true
            //       },duration: 2
            //     });
            // }
            
            const boxes = gsap.utils.toArray('.slide-up');
            boxes.forEach((box, i) => {
              ScrollTrigger.create({
                trigger: box,
                toggleClass: 'aniActive',
                y: 0,
                toggleActions: 'play none none none',
                once: true,
                onUpdate: self =>{
                    ScrollTrigger.refresh();
                }
              });
            });

            if($('.block-statics').length > 0){
                $(window).on('scroll',function(){
                    var staticTop = $('.block-statics').offset().top -  $('.site-header').height();

                    if($(this).scrollTop() >= staticTop ){

                        $('#canvasImg').addClass('canimation')
                    }else{
                        $('#canvasImg').removeClass('canimation')
                    }
                })
                
            }
            if($('.video__open').length > 0){
                $('.video__open').on('click',function(e){
                   $('body').addClass('show-popup');
                   var video = $(this).closest('.video-page-inner').find('video')[0];
                   var videoUrl = $(video).attr('src');
                   $('body').append('<div id="video-popup"><video controls src="'+ videoUrl +'"></video><span class="icon-close"></span></div>')
                });
                $(document).on('click','#video-popup .icon-close',function(){
                    $('#video-popup').remove()
                    $('body').removeClass('show-popup')
                })
            }
            this.tabs('.tablink');
            if($('.title-scroll').length > 0){
                const boxes = gsap.utils.toArray('.block-title-fixed');
                boxes.forEach((box, i) => {
                    ScrollTrigger.create({
                        trigger: box,
                        toggleClass: 'block-actived',
                        y: 0,
                        start: "top top",
                        end: "bottom 250px",
                        onUpdate: self =>{
                            $('.block-title-mask').css('top', $('.site-header').outerHeight() + 'px') 
                        } 
                    });
                });    
            }
            var objPropLogEl = $('.core-text .h3');
            var objProp = $('.block-radical-items-score strong.h1');
            var myObject = {
              prop: '0%',
              prop1: 0
            }
            var stopAnimation = false;
            var stopAnima = false;
            $(window).scroll(function(){
                var fromTop = $(this).scrollTop() + $(window).height();
                if($('.block-radical-progress').length > 0){
                    var heightW = $('.block-radical-progress').offset().top + $(window).height();
    
                    if (($('.block-radical-progress').offset().top < fromTop) && stopAnimation == false && fromTop < heightW ){
                      
                        objPropLogEl.each(function(){
                            var ob = $(this);
                            var score = parseInt($(this).data('score'));
                            anime({
                                targets: myObject,
                                prop: score,
                                prop1: score,
                                easing: 'linear',
                                round: 1,
                                update: function() {
                                    ob.html(myObject.prop);
                                    var svgOb = ob.closest('.score').find('.circle')[0];
                                    $(svgOb).attr('stroke-dasharray', myObject.prop1 + ',100')
                                }
                            });
                        })
                        stopAnimation = true;  
                    }
                }
                if($('.block-radical-items-score').length > 0){
                    if (($('.block-radical-items-score').offset().top < fromTop) && stopAnima == false && fromTop < ( $('.block-radical-items-score').offset().top + $(window).height())){
                        objProp.each(function(){
                            var ob = $(this);
                            var score = parseFloat($(this).data('score')) * 10;
                            anime({
                                targets: myObject,
                                prop: score,
                                prop1: score,
                                easing: 'linear',
                                round: 1,
                                update: function() {
                                    ob.html(myObject.prop1 / 10);
                                }
                            });
                        })
                        stopAnima = true;  
                    }
                }
                         
            }); 
            
        },
        radicalCMS: function(){
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
            if($('.block-radical-collection').length > 0){
                var hashNavigation = false;
                var inIt = true;
                if($('.block-radical-collection-v1').length > 0){
                    hashNavigation = true;
                    inIt = false;
                }
                var thumbSlider = new Swiper(".radicalThumb", {
                    spaceBetween: 0,
                    slidesPerView: 1,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true
                });
                thumbSlider.mousewheel.disable()
                var radicalSlider = new Swiper(".radicalSlider", {
                    init: inIt,
                    spaceBetween: 10,
                    hashNavigation: {
                      watchState: hashNavigation,
                    },
                    navigation: {
                      nextEl: ".swiper-button-next-r",
                      prevEl: ".swiper-button-prev-r"
                    },
                    thumbs: {
                      swiper: thumbSlider
                    }
                });
                thumbSlider.on('slideChange', function () {
                       radicalSlider.slideTo(this.realIndex)
                        
                })
                if(hashNavigation){
                    radicalSlider.on('init', function () {
                        $('.hashicons a').removeClass('active')
                        var inx = this.realIndex + 1;
                        $('.hashicons a[href="#slide'+ inx +'"]').addClass('active')
                    })
                    radicalSlider.init();
                    radicalSlider.on('slideChange', function () {
                        $('.hashicons a').removeClass('active')
                        var inx = this.realIndex + 1;
                        $('.hashicons a[href="#slide'+ inx +'"]').addClass('active')
                    })
                   
                }
            }
        },
        homeAnimation: function(){
            $(".our-commitments .grid__item .grid__item__inner").on('mousemove',function(e){
               var pOffset = $(this).offset(); 
               var relX = e.pageX - pOffset.left;
               var relY = e.pageY - pOffset.top;
               var bkgVideo =  $(this).closest('.grid__item').find('.video-bkg');
               $(bkgVideo[0]).css('transform','translate(' + ( relX  - $(bkgVideo[0]).width() ) + 'px,' + ( relY - $(bkgVideo[0]).height() )+ 'px)')
            });
            var wWindow = $(window).width();
            var __this = this;
            __this.playVideoCommit(wWindow)
            $(window).on('resize',function(){
                var wWindow = $(this).width();
                __this.playVideoCommit(wWindow)
            })
        },
        playVideoCommit:function( width ){
            $(".our-commitments .has-video ").each(function(e){

                if(width < 1025){
                    if($(this).find('video').length > 0){
                        $('video',this).get(0).load();
                        $('video',this).get(0).play();
                    }
                    
                }else{
                    if($(this).find('video').length > 0){
                        $('video',this).get(0).load();
                        $('video',this).get(0).pause();
                    }
                    
                }
                
            });
        },
        quizSize: function(){
            $('[href="/size-quiz"], [href="/fr/size-quiz"], [href="/de/size-quiz"], [href="/en/size-quiz"]').on('click',function(e){
                e.preventDefault();
                $('#table-size').hide();
                $('.step').hide();
                $('#step1').show();
                $('body').addClass('show-popup').removeClass('show-menu')
                $('.site-footer').animate({"right": "-110%" });
                $('#quiz-size').show();
            })
            $('#step4 .btns .btn_light_second').on('click',function(){
                if($(this).attr('href') == 'javascript:void(0);' ){
                    $('#quiz-size .icon-close').click();
                }
            })
            $('#quiz-size .icon-close').on('click',function(){
                $('body').removeClass('show-popup')
                $('#quiz-size').hide();
            })
            $('.next_step').click(function(e){
                e.preventDefault();
                var next = $($(this).attr('href'));
                if($(this).attr('href')  == '#step3'){
                    if($('#step2 input[name="mbrand"]').val() == '' || $('#step2 input[name="mbrand"]').val() > 92 || $('#step2 input[name="mbrand"]').val() < 68 ){
                        $('#step2 input[name="mbrand"]').addClass('input--error');
                        return;
                    }else{
                        $('#step2 input[name="mbrand"]').removeClass('input--error');
                    }
                }
                if($(this).attr('href')  == '#step4'){

                    if($('#step3 input[name="mchest"]').val() == '' || $('#step3 input[name="mchest"]').val() > 112 || $('#step3 input[name="mchest"]').val() < 82){
                        $('#step3 input[name="mchest"]').addClass('input--error');
                        return;
                    }else{

                        $('#step3 input[name="mchest"]').removeClass('input--error');
                        const underSize = $('#step2 input[name="mbrand"]').val();
                        const overSize = $('#step3 input[name="mchest"]').val();
                        var sizes =  [70,75,80,85,90]; 
                        var cupSizes =  ['A','B','C','D','E'];
                        var isEU = true;
                        if($('body').hasClass('uk-us')){
                            sizes =  [32,34,36,38,40];
                            cupSizes =  ['A','B','C','D','DD'];
                        }else{
                            if( $('body').hasClass('fr')){
                                sizes =  [85,90,95,100,105];
                                isEU = false;
                            }
                        }
                        
                        var listSize = [];
                        var overbust =  Array.from(Array(113).keys());
                        overbust = overbust.filter(function s(num){
                            return num > 80;
                        })
                        
                        var underbust =  Array.from(Array(93).keys());
                        underbust = underbust.filter(function s(num){
                            return num > 67;
                        })

                        sizes.forEach(function( size ){
                            cupSizes.forEach(function( cup ){
                                var zValue = size + cup;
                                if($('body').hasClass('uk-us')){
                                    if( zValue == '38A' || zValue == '40A' || zValue == '40B' || zValue=='32DD' ){
                                        listSize.push('')
                                    }else{
                                        listSize.push( zValue)
                                        
                                    }
                                }else{
                                    if( $('body').hasClass('fr')){
                                        if( zValue == '100A' || zValue == '105A' || zValue == '105B' || zValue=='85E' ){
                                            listSize.push('')
                                        }else{
                                            listSize.push( zValue)
                                            
                                        }
                                   }else{
                                    if( zValue == '85A' || zValue == '90A' || zValue == '90B' || zValue=='70E' ){
                                        listSize.push('')
                                    }else{
                                        listSize.push( zValue)
                                        
                                    }
                                   } 
                                }
                                
                            })
                        })
                        var i = 0 ;
                        var start = 81;
                        var lastList = [];
                        var startUnderbust = 67;
                        
                        listSize.forEach(function( size, index ){
                            var lastCheck = start + 3 ;
                            var lastUnderbustCheck = startUnderbust + 6 ;

                            overbust.forEach(function( bust ){
                                if( ( bust > start) && ( bust < lastCheck ) ){
                                    underbust.forEach(function( under ){
                                        if( ( under > startUnderbust) && ( under < lastUnderbustCheck ) ){
                                            lastList.push([ under, bust , size ])
                                        }
                                    });
                                }
                            });
                            start = lastCheck - 1;
        
                            if((( index + 1) % 5) == 0){
                                start = start - 5;
                                startUnderbust = lastUnderbustCheck - 1;
                            }
                        });
                        const itemSize = lastList.filter(function list(item){
                            return ( item[0] == underSize && item[1] == overSize);
                        })
                        var dataMoreSize = '';
                        if(itemSize.length > 0){
                            
                            const result = itemSize[0]
                            var lastSize = result[2];
                            var dataSize = [['70A','XS'],['70B','S'],['70C','M'],['70D','L'],['70E','XL'],['75A','S'],['75B','M'],['75C','L'],['75D','XL'],['75E','XL/2XL'],['80A','M'],['80B','L'],['80C','XL'],['80D','2XL'],['80E','2XL'],['85A','L'],['85B','XL'],['85C','2XL'],['85D','2XL'],['90A','XL'],['90B','2XL'],['90C','2XL']]
                            
                            if($('body').hasClass('uk-us')){
                                 dataSize = [['32A','XS'],['32B','S'],['32C','M'],['32D','L'],['32E','XL'],['34A','S'],['34B','M'],['34C','L'],['34D','XL'],['34E','XL/2XL'],['36A','M'],['36B','L'],['36C','XL'],['36D','2XL'],['36E','2XL'],['38A','L'],['38B','XL'],['38C','2XL'],['38D','2XL'],['40A','XL'],['40B','2XL'],['40C','2XL']]
                            }else{
                                if($('body').hasClass('fr')){
                                     dataSize = [['85A','XS'],['85B','S'],['85C','M'],['85D','L'],['85E','XL'],['90A','S'],['90B','M'],['90C','L'],['90D','XL'],['90E','XL/2XL'],['95A','M'],['95B','L'],['95C','XL'],['95D','2XL'],['95E','2XL'],['100A','L'],['100B','XL'],['100C','2XL'],['100D','2XL'],['105A','XL'],['105B','2XL'],['105C','2XL']]
                                }
                            }
                            var newResult = dataSize.filter(function list(item){
                                return ( item[0] == result[2] );
                            })

                            if(newResult.length > 0){
                                newResult =  newResult[0];
                                dataMoreSize = '/' +  newResult[1];
                            }

                            if(lastSize == ''){
                                var checkSize =  false;
                                var dataSizeShow = '';
                                var cup_size_e = '';
                                var under_size_e = '';
                                if(underSize == 68 || underSize == 69 || underSize == 70 || underSize == 71 || underSize == 72 ){
                                    if(overSize == 90){
                                        checkSize =  true;
                                        dataSizeShow = '70D/L';
                                        under_size_e = '70/32/85';
                                        if($('body').hasClass('uk-us')){
                                            dataSizeShow = '32D/L'
                                        }else{
                                            if($('body').hasClass('fr')){
                                                dataSizeShow = '85D/L'
                                            }
                                        }
                                        cup_size_e = 'D';
                                    }
                                } 
                                if(underSize == 73 || underSize == 74 || underSize == 75 || underSize == 76 || underSize == 77 ){
                                    if(overSize == 97){
                                        checkSize =  true;
                                        dataSizeShow = '75E/XL/2XL';
                                        cup_size_e = 'E';
                                        under_size_e = '75/34/90';
                                        if($('body').hasClass('uk-us')){
                                            dataSizeShow = '34E/XL/2XL'
                                            cup_size_e = 'DD';
                                        }else{
                                            if($('body').hasClass('fr')){
                                                dataSizeShow = '90E/XL/2XL'
                                            }
                                        }
                                    }
                                }
                                if(underSize == 78 || underSize == 80|| underSize == 81 || underSize == 82 || underSize == 79 ){
                                    if(overSize == 102){
                                        checkSize =  true;
                                        dataSizeShow = '80E/2XL';
                                        cup_size_e = 'E';
                                        under_size_e = '80/36/95';
                                        if($('body').hasClass('uk-us')){
                                            dataSizeShow = '36E/2XL'
                                            cup_size_e = 'DD';
                                        }else{
                                            if($('body').hasClass('fr')){
                                                dataSizeShow = '95E/2XL'
                                            }
                                        }
                                       
                                    }
                                }
                                if(underSize == 83 || underSize == 84|| underSize == 85 || underSize == 86 || underSize == 87 ){
                                    if(overSize == 107){
                                        checkSize =  true;
                                        dataSizeShow = '85E';
                                        cup_size_e = 'E';
                                        under_size_e = '85/38/100';
                                        if($('body').hasClass('uk-us')){
                                            dataSizeShow = '38E'
                                            cup_size_e = 'DD';
                                        }else{
                                            if($('body').hasClass('fr')){
                                                dataSizeShow = '100E'
                                            }
                                        }
                                       
                                    }
                                }
                                if(underSize == 88 || underSize == 89|| underSize == 90 || underSize == 91 || underSize == 92 ){
                                    if(overSize == 112){
                                        checkSize =  true;
                                        dataSizeShow = '90E';
                                        cup_size_e = 'E';
                                        under_size_e = '90/40/105';
                                        if($('body').hasClass('uk-us')){
                                            dataSizeShow = '40E'
                                            cup_size_e = 'DD';
                                        }else{
                                            if($('body').hasClass('fr')){
                                                dataSizeShow = '105E'
                                            }
                                        }
                                    }
                                }
                                if(checkSize == false){
                                    $('#step4 .grid__item__info_s .p-large').hide();
                                    $('#step4 .btns .btn_light_second').hide()
                                    $('#step4 .h2').html("sorry! we cannot find the size you are looking for.")
                                }else{
                                    $('#step4 .h2').html(dataSizeShow )
                                    if($('body').hasClass('template-product')){
                                        $('#step4 .btn_light_second').attr('href','javascript:void(0);')
                                        $('#step4 .btn_light_second').html(theme.strings.continueShoping)
                                    }else{
                                        $('#step4 .btn_light_second').attr('href','/collections/bra?pf_opt_band_size='+ under_size_e +'&pf_opt_cup_size='+ cup_size_e +'')
                                    }
                                }
                            }else {
                                $('#step4 .h2').html(lastSize + dataMoreSize )
                                $('#step4 .btns .btn_light_second').show();
                                $('#step4 .grid__item__info_s .p-large').show();
                                if($('body').hasClass('template-product')){
                                    $('#step4 .btn_light_second').attr('href','javascript:void(0);')
                                    $('#step4 .btn_light_second').html(theme.strings.continueShoping)
                                }else{
                                    var allSizes = ['70/32/85','75/34/90','80/36/95','85/38/100','90/40/105']
                                    var band_size = lastSize.substring(0, lastSize.length - 1)
                                    var cup_size = lastSize[lastSize.length - 1]
                                    allSizes.forEach(function(itemSize){
                                        var itemsSize = itemSize.split('/');

                                        if($('body').hasClass('uk-us')){
                                            if(band_size == itemsSize[1]){
                                                band_size = itemSize;
                                            }    
                                        }else{
                                            if($('body').hasClass('fr')){
                                                if(band_size == itemsSize[2]){
                                                    band_size = itemSize;
                                                }    
                                            }else{
                                                if(band_size == itemsSize[0]){
                                                    band_size = itemSize;
                                                } 
                                            }
            
                                        }
                                    });
                                    $('#step4 .btn_light_second').attr('href','/collections/bra?pf_opt_band_size='+ band_size +'&pf_opt_cup_size='+ cup_size +'')
                                    $('#step4 .btn_light_second').html(theme.strings.shopAll)
                                }
                            }
                        }else{
                            var checkSize =  false;
                            var dataSizeShow = '';
                            var cup_size_e = '';
                            var under_size_e = '';
                            if(underSize == 68 || underSize == 69 || underSize == 70 || underSize == 71 || underSize == 72 ){
                                if(overSize == 90){
                                    checkSize =  true;
                                    dataSizeShow = '70D/L';
                                    cup_size_e = 'D';
                                    under_size_e = '70/32/85';
                                    if($('body').hasClass('uk-us')){
                                        dataSizeShow = '32D/L'
                                    }else{
                                        if($('body').hasClass('fr')){
                                            dataSizeShow = '85D/L'
                                        }
                                    }
                                }
                            } 
                            if(underSize == 73 || underSize == 74 || underSize == 75 || underSize == 76 || underSize == 77 ){
                                if(overSize == 97){
                                    checkSize =  true;
                                    dataSizeShow = '75E/XL/2XL';
                                    cup_size_e = 'E';
                                    under_size_e = '75/34/90';
                                    if($('body').hasClass('uk-us')){
                                        dataSizeShow = '34E/XL/2XL'
                                        cup_size_e = 'DD';
                                    }else{
                                        if($('body').hasClass('fr')){
                                            dataSizeShow = '90E/XL/2XL'
                                        }
                                    }
                                }
                            }
                            if(underSize == 78 || underSize == 80|| underSize == 81 || underSize == 82 || underSize == 79 ){
                                if(overSize == 102){
                                    checkSize =  true;
                                    dataSizeShow = '80E/2XL';
                                    cup_size_e = 'E';
                                    under_size_e = '80/36/95';
                                    if($('body').hasClass('uk-us')){
                                        dataSizeShow = '36E/2XL'
                                        cup_size_e = 'DD';
                                    }else{
                                        if($('body').hasClass('fr')){
                                            dataSizeShow = '95E/2XL'
                                        }
                                    }
                                   
                                }
                            }
                            if(underSize == 83 || underSize == 84|| underSize == 85 || underSize == 86 || underSize == 87 ){
                                if(overSize == 107){
                                    checkSize =  true;
                                    dataSizeShow = '85E';
                                    cup_size_e = 'E';
                                    under_size_e = '85/38/100';
                                    if($('body').hasClass('uk-us')){
                                        dataSizeShow = '38E'
                                        cup_size_e = 'DD';
                                    }else{
                                        if($('body').hasClass('fr')){
                                            dataSizeShow = '100E'
                                        }
                                    }
                                   
                                }
                            }
                            if(underSize == 88 || underSize == 89|| underSize == 90 || underSize == 91 || underSize == 92 ){
                                if(overSize == 112){
                                    checkSize =  true;
                                    dataSizeShow = '90E';
                                    cup_size_e = 'E';
                                    under_size_e = '90/40/105';
                                    if($('body').hasClass('uk-us')){
                                        dataSizeShow = '40E'
                                        cup_size_e = 'DD';
                                    }else{
                                        if($('body').hasClass('fr')){
                                            dataSizeShow = '105E'
                                        }
                                    }
                                }
                            }
                            if(checkSize == false){
                                 $('#step4 .grid__item__info_s .p-large').hide();
                                $('#step4 .btns .btn_light_second').hide()
                                $('#step4 .h2').html("sorry! we cannot find the size you are looking for.")
                            }else{
                                $('#step4 .h2').html(dataSizeShow )
                                if($('body').hasClass('template-product')){
                                    $('#step4 .btn_light_second').attr('href','javascript:void(0);')
                                    $('#step4 .btn_light_second').html('continue shopping')
                                }else{
                                    $('#step4 .btn_light_second').attr('href','/collections/bra?pf_opt_band_size='+ under_size_e +'&pf_opt_cup_size='+ cup_size_e +'')
                                }
                            }
                           
                        }
                    }
                }
                $('.step').hide();
                $('#quiz-size').attr('data-step',$(this).attr('href').replace('#',''));
                next.show();
            })
            
        },
        recentTerm: function(){
            var recentTermSearch = localStorage.getItem("recentTerms")? localStorage.getItem("recentTerms"): '';
            if(recentTermSearch != ''){
                $('#recent_searchs').addClass('has_terms')
               var recentTermSearchArr = recentTermSearch.split(';')
               var HTML = '';
               for (let index = 0; index < recentTermSearchArr.length; index++) {
                    HTML += '<li><a href="/search?q= '+ recentTermSearchArr[index]+ '" class="h6">'+ recentTermSearchArr[index]+'</a></li>';
               }
               $('#recent_searchs-list ul').html(HTML);
            }
            $(document).on('click','#recent_searchs .h6 a',function(){
                $('#recent_searchs').removeClass('has_terms')
                $('#recent_searchs-list ul').html('');
                localStorage.setItem("recentTerms", '' );
            })
            $(document).on('keyup','.search-form__input-wrapper input',function(){
                var inputVal = $(this).val();
                if( inputVal == ''){
                    $('.hide-static-block').removeClass('hide-static-block')
                }
            })
        },
        recentlyViewed: function(){
            var recentlyViewed = localStorage.getItem("productsViewedss");
            if(recentlyViewed == null){
                var recentlyViewedArr = [];
                recentlyViewed = '';
                $('#recenty-viewed h6').hide();
            }else{
                var recentlyViewedArr = recentlyViewed.split(';');

                if(recentlyViewedArr.length > 6)
                    recentlyViewedArr = recentlyViewedArr.slice(0, 6);
                async function loadData() {
                    var HTML = '<ul class="list-products">';
                    for (let index = 0; index < recentlyViewedArr.length; index++) {
                        const data = await $.get("/products/" + recentlyViewedArr[index] + '.json')    
                        if(data.product.image != null){
                            var featured_image =   data.product.image.src.split('?');
                            var featured_images = featured_image[0].split('.');
                            var ext = featured_images[featured_images.length -1];
                            featured_images.pop();
                            featured_image = featured_images.join('.') + '_87x109_crop_center@2x.' + ext;
                            HTML += '<li>';
                            HTML += '<a href="/products/' + data.product.handle + ' " class="product-item-img">';
                            HTML += '<img src="' + featured_image + '" alt=" ' + data.product.image.alt + '"/>';
                            HTML += '<strong class="h8"> '+ data.product.title +' </strong>';
                            HTML += '</a>';
                            HTML += '</li>';
                        }
                        
                    }
                    HTML += '</ul>';
                    $('#recenty-viewed-list').html( HTML )
                }
                loadData();
            }
            
            if(theme.product_url != ''){
                if( recentlyViewed.indexOf(theme.product_url) != -1){
                    var newArr = recentlyViewedArr.filter(function( handle ){
                        return theme.product_url != handle;
                    });
                    newArr.unshift(theme.product_url)
                    localStorage.setItem("productsViewedss", newArr.join(';'))
                }else{
                    recentlyViewedArr.unshift(theme.product_url)
                    localStorage.setItem("productsViewedss", recentlyViewedArr.join(';'))
                }
            }
        },  

        newsletterPopup: function(){
            var time = parseInt(sessionStorage.getItem("time"));
            var showPoup = this.readCookie('showPoup');
            var __this = this;
            if(Number.isNaN(time))
                time = 0;
            var checkTimeOnSite = setInterval(function(){ 
                time = time + 1000 ;
                sessionStorage.setItem("time", time);
                if(showPoup == null){
                    if( time >= 60000){
                        $('.newsletter-section').fadeIn(100);
                        __this.setCookiePopup('showPoup', 1 );
                        clearInterval(checkTimeOnSite);
                        sessionStorage.setItem("time", 0 );
                    }    
                }
            }, 1000 );
           
            if($('#Contact_newsletter .form-message--success').length > 0){
                document.location.href = '/pages/thank-you-newsletter';
            }
            
            $('.newsletter-section .p-close').click(function(){
                $('.newsletter-section').fadeOut(100); 
            })

        },
        blogPagination: function(){
            if( $('body.template-blog').length > 0){
                $('#view-more a').on('click',function(){
                    var pages = parseInt($(this).data('pages'));
                    var curPage = parseInt($(this).data('nextpage'));
                    if( currentPage <= pages){
                        $.get( blogUrl + '?view=ajax&page=' + currentPage, function(data, status){
                            if(status == 'success'){
                                $('#blog-list').append(data);
                            }
                        });
                        if( currentPage == pages ){
                            $(this ).addClass('disabled')
                        }
                    }
                })
            }
        },
        loginPage: function(){
            if(localStorage.getItem("email") != null && localStorage.getItem("email") != '' && localStorage.getItem("pass") != null && localStorage.getItem("pass") != ''){
                if($('#customer_login .errors').length > 0){
                    return;
                }else{
                    $('#customer_login #CustomerEmail').val(localStorage.getItem("email"));
                    $('#customer_login #CustomerPassword').val(localStorage.getItem("pass"));
                    //$('#customer_login').submit();
                }
                
            }
            $('#customer_logout_link').on('click',function(e){
                e.preventDefault();
                var linkLoutout = $(this).attr('href');
                localStorage.setItem("email", '');
                localStorage.setItem("pass", '');
                document.location.href = linkLoutout;
            })
            $('#customer_login').submit(function(event) {
                event.preventDefault();
                var data =  $(this).serialize();
                var email = $('#CustomerEmail').val();
                var pass = $('#CustomerPassword').val();
                $.post('/account/login', data)
                  .done(function(data){
                    $('#customer_login').removeClass('loading');
                  var logErrors =  $(data).find('.errors').text();
                  var htmlForm = $(data).find('#form-login').html()
                  $('#form-login').html(htmlForm)
                  if ($(data).find('.form-message--error').length > 0){
                       $('#customer_login .errors').html(logErrors);
                       $('#customer_login .errors').show();
                  }else{
                    if($('#keep-me-sign-in').is(":checked")){
                       localStorage.setItem("email", email);
                       localStorage.setItem("pass", pass);
                    }else{
                        localStorage.setItem("email", '');
                        localStorage.setItem("pass", ''); 
                    }
                    document.location.href = '/account';
                  }
                  }).fail(function(){console.log('error');});
                 return false;
            }); 
        },
        registerPage: function(){
            var __this = this;
            $('#RegisterForm').submit(function(event) {
                $('#RegisterForm').addClass('loading');
                event.preventDefault();
                var data =  $(this).serialize();
                var checkValid = true;
                $('.register-field').removeClass('invalid')

                $('#RegisterForm .register-field input').each(function(){
                    var value = $(this).val();
                    if(value == '' ){
                        checkValid = false;
                        $(this).closest('.register-field').addClass('invalid')
                    }else{
                        console.log($(this).attr('type'))
                        if($(this).attr('type') == 'email'){
                            if( __this.validateEmail(value) == false){
                                checkValid = false;
                                $(this).closest('.register-field').addClass('invalid')
                            }
                        }
                    }
                });
                if(checkValid ==  true){
                    $.post('/account', data)
                    .done(function(data){
                        $('#RegisterForm').removeClass('loading');
                        var logErrors =  $(data).find('.form-message--error').text();
                        var htmlForm = $(data).find('#form_register').html()
                        $('#form_register').html(htmlForm)
                        if ($(data).find('.form-message--error').length > 0){
                           $('#RegisterForm .errors').html(logErrors);
                           $('#RegisterForm .errors').show();
                        }else{
                            document.location.href = '/pages/thank-you';
                        }
                    }).fail(function(){console.log('error');});
                }else{
                    $('#RegisterForm').removeClass('loading');
                }
                return false;
            }); 
        },
        oos: function(){
            $(document).on('click','.BIS_trigger',function(){
                var productData = $(this).data('product-data');
                if(productData.featured_image != null ){
                    var featuredImage = productData.featured_image;
                }else{
                    var featuredImage = 'https://cdn.shopify.com/s/files/1/0435/7305/1554/t/8/assets/boost-pfs-no-image_315x396_crop_center.gif?v=9767452811561511183';
                }
                var newItem = document.createElement("img");
                newItem.setAttribute('src',featuredImage );
                newItem.setAttribute('alt','' );
                //$('#BIS_frame').remove();
                setTimeout(function(){
                    if(document.getElementById('BIS_frame') != null){
                        var productName = document.getElementById('BIS_frame').contentWindow.document.querySelector('.product-name');
                        var productIMG = document.getElementById('BIS_frame').contentWindow.document.querySelector('img');
                        if(productIMG != null)
                            productIMG.remove();
                        productName.insertBefore(newItem, productName.childNodes[0]);
                    }
                },500)
                
            })
            if($('.template-product').length > 0){
                var added = false;
                $(document).on('click','#BIS_trigger',function(){
                        var productData = $(this).data('product-data');
                        if(productData.featured_image != null ){
                            var featuredImage = productData.featured_image;
                        }else{
                            var featuredImage = 'https://cdn.shopify.com/s/files/1/0435/7305/1554/t/8/assets/boost-pfs-no-image_315x396_crop_center.gif?v=9767452811561511183';
                        }
                    setTimeout(function(){
                        var IMG = featuredImage;
                        var newItem = document.createElement("img");
                        newItem.setAttribute('src',IMG );
                        newItem.setAttribute('alt','' );
                       
                        if(document.getElementById('BIS_frame') != null){
                            var productName = document.getElementById('BIS_frame').contentWindow.document.querySelector('.product-name');
                            if(added == false){
                                productName.insertBefore(newItem, productName.childNodes[0]);
                                added = true;
                            }
                        }

                        if($('iframe#BIS_frame').length > 0){
                            $('iframe#BIS_frame').contents().find('#single_variant_product_select').hide()
                            $('iframe#BIS_frame').contents().find('#email_address').after($('iframe#BIS_frame').contents().find('#message_holder'));
                            if($('html').attr('lang') == 'fr'){
                                $('iframe#BIS_frame').contents().find('.modal-title').html('prévenez-moi');
                                $('iframe#BIS_frame').contents().find('.btn.btn-success').html('prévenez-moi');
                                $('iframe#BIS_frame').contents().find('p').html("nous vous contacterons dès que l'article sera à nouveau disponible. votre adresse mail restera confidentielle.");
                            }
                            if($('html').attr('lang') == 'de'){
                                $('iframe#BIS_frame').contents().find('.modal-title').html('mich benachrichtigen');
                                $('iframe#BIS_frame').contents().find('.btn.btn-success').html('mich benachrichtigen');
                                $('iframe#BIS_frame').contents().find('p').html("Wir melden uns bei Dir, sobald der Artikel verfügbar ist. Wir geben deine E-Mail-Adresse an niemanden weiter.");
                                $('iframe#BIS_frame').contents().find('#email_address').attr('placeholder','E-Mail')
                            }
                        }
                    },100);
                })
            }

        },
        tableSize: function(){
            $('[href$="/size-table"],[href$="/de/size-table"],[href$="/fr/size-table"],[href$="/en/size-table"]').on('click',function(e){
                e.preventDefault();
                var sizes =  [70,75,80,85,90]; 
                var titleSize = ['','A','B','C','D','E']
                if($('body').hasClass('uk-us')){
                    sizes =  [32,34,36,38,40];
                     titleSize = ['','A','B','C','D','DD']
                }else{
                    if( $('body').hasClass('fr')){
                        sizes =  [85,90,95,100,105];
                    }
                }
                $('#body-tab .table-size thead th').each(function( inx , item ){
                    $(this).html(titleSize[inx]);
                });
                $('#body-tab .table-size tbody th').each(function( inx , item ){
                    $(this).html(sizes[inx]);
                });
                $('#wired_bra .table-size.first-table th').each(function( inx , item ){
                    $(this).html(sizes[inx]);
                });
                $('#wired_bra .table-size.second-table tbody th').each(function( inx , item ){
                    $(this).html(sizes[inx]);
                });
                $('#wired_bra .table-size.second-table thead th').each(function( inx , item ){
                    $(this).html(titleSize[inx]);
                });
                $('#unwired-tab .table-size thead th').each(function( inx , item ){
                    $(this).html(titleSize[inx]);
                }); 
                console.log($('#unwired-tab .table-size tbody th'))
                $('#unwired-tab .table-size tbody th').each(function( inx , item ){
                    $(this).html(sizes[inx ]);
                });        
                $('body').addClass('show-popup').removeClass('show-menu')
                $('.site-footer').animate({"right": "-110%" });
                $('#table-size').css('display','flex');

            })
            $('#table-size .icon-close').on('click',function(){
                $('body').removeClass('show-popup')
                $('#table-size').hide();
            })
        },
        instagramPDP: function(){
            if($('body.template-product').length > 0){
                $("body").on('DOMSubtreeModified', ".ssw-instagram-widget", function() {
                    setTimeout(function(){
                        $('.ssw-instagram-grid .ssw-instagram-items').slick({
                            infinite: true,
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            prevArrow: '<span class="icon-arrow_left"></span>',
                            nextArrow: '<span class="icon-arrow_right"></span>',
                            responsive: [
                            {
                              breakpoint: 599,
                              settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                variableWidth: true,
                                arrows: false
                              }
                            }
                          ]
                        });
                    },500) 

                });
            }
        },
        mixInPlayPDP: function(){
            if($('.mix-play-content').length > 0){
                var productList = $('.mix-play-content').data('products');
                this.mixPlayContent(productList, false);
            }
        },
        mixPlayContent:function( produtList, isPopup ){
            produtList = produtList.split(";");
            produtList = produtList.sort(() => .5 - Math.random());
            var items = (produtList.length > 6)?produtList.slice(0, 6): produtList;
            if($(window).width() < 600 && isPopup == false)
                items = (produtList.length > 4)?produtList.slice(0, 4): produtList;
            async function loadData() {
                var HTML = '';
                var HTMLL = '';
                for (let index = 0; index < items.length; index++) {
                    const data = await $.get("/search?view=ajax&q=variants.sku:" + items[index] + "\*")
                    var newData = data.split('<!-- split -->');
                    HTML += newData[0];
                    HTMLL += newData[1];
                }
                $('#list-images-mix-left').html(HTMLL);
                $('#list-images-mix-right').html(HTML);
                setTimeout(function(){
                    $('#list-images-mix-left').removeAttr('class');
                    $('#list-images-mix-left').slick({
                        autoplay: true,
                        autoplaySpeed: 100,
                        speed: 100,
                        fade: true,
                        arrows: false,
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1
                    });
                    if(isPopup == true)
                        $('body').addClass('show-popup show-mix-to-play')
                    if($('.mix-play-item').length > 0)
                        $('.mix-play-item').removeClass('loading')
                },200)
            }
            loadData();
        },
        mixPlay: function(){
            var __this = this;
            $(document).on('click','.mix-n-play-btn',function(){
                __this.mixInPlayPDP();
            })

            $(document).on('mouseover','.right-product',function(){
                var slide = $(this).find('img')[0];
                var slideImgSrc  = $(slide).attr('src').split('203x255_crop_center')[0];
                var indexSlide = 0;
                $('#list-images-mix-left img').each(function(){
                    var mainImage = $(this).attr('src').split('430x542_crop_center')[0];
                    if(mainImage == slideImgSrc ){
                        indexSlide = $(this).closest('.slick-slide').data('slick-index');
                    }
                });
                $('#list-images-mix-left.slick-initialized').slick('slickPause');
                $('#list-images-mix-left.slick-initialized').slick('slickGoTo', indexSlide, false);
            })
            $(document).on('mouseout','#list-images-mix-right',function(){
                $('#list-images-mix-left.slick-initialized').slick('slickPlay');
            })
        },
        imgZoomPDP: function(){
            if($('.featured-image-slider').length > 0){
                $(document).on('click','.featured-image-slider img',function(){
                    if($(window).width() > 1024){
                        $('#zoom-img .zoom-thumb').html( '');
                        $('#zoom-img .zoom-main-container').html( '');
                        var IMG = $(this).attr('src');
                        var HTML = $('#product-info-left .thumbnails-wrapper').html();
                        var mainHTML = '<div class="main-zoom">';
                        $('#product-info-left .product-single__thumbnails a').each(function(){
                            var dataType = $(this).data('type')
                            if(dataType == 'video'){
                                mainHTML += '<div class="item" data-type="'+ dataType +'" data-url="'+ $(this).attr('href') +'"><video class="media-video" loop muted playsinline preload="metadata"><source src="'+ $(this).attr('href') +'"></video></div>';
                            }else{
                                mainHTML += '<div class="item" data-type="'+ dataType +'" data-url="'+ $(this).attr('href') +'"><img src="'+ $(this).attr('href') +'" alt="" /></div>';
                            }
                        })
                        mainHTML += '</div>';
                        $('body').addClass('show-popup');
                        $('#zoom-img').addClass('show-zoom')
                        $('#zoom-img .zoom-thumb').html( HTML);
                        $('#zoom-img .zoom-main-container').html( mainHTML);
                        setTimeout(function(){
                            $('.zoom-main-container img').each(function(){
                                var IMGArr = IMG.split('657x825_crop_center');
                                var arrSrc = $(this).attr('src').split('885x1111_crop_center');
                                if( IMGArr[0] == arrSrc[0] ){
                                    var pTop = $(this).position();
                                    $('#zoom-img').animate({scrollTop:pTop.top },200);
                                }
                            })
                        }, 1000)
                    }else{
                        $('#zoom-img .zoom-main-container').html('');
                        var mainHTML = '<div class="swiper-container zoom-swiper-container" ><div class="swiper-wrapper">';
                        $('#product-info-left .product-single__thumbnails a').each(function(){
                            var dataType = $(this).data('type')
                            if(dataType == 'video'){
                                mainHTML += '<div class="swiper-slide"><div class="swiper-zoom-container"><video class="media-video" autoplay loop muted playsinline preload="metadata"><source src="'+ $(this).attr('href') +'"></video></div></div>';
                            }else{
                                mainHTML += '<div class="swiper-slide"><div class="swiper-zoom-container"><img src="'+ $(this).attr('href') +'" alt="" /></div></div>';
        
                            }
                            
                        })
                        mainHTML += '</div></div><div class="z-swiper-pagination"></div>';
                        $('#zoom-img .zoom-main-container').html( mainHTML);
                        $('body').addClass('show-popup');
                        $('#zoom-img').addClass('show-zoom')
                        setTimeout(function(){
                            var settings = {
                                zoom: true,
                                spaceBetween: 0,
                                pagination: {
                                    el: ".z-swiper-pagination",
                                    clickable: true

                                }
                            }
                            var swiper = new Swiper('#zoom-img .zoom-swiper-container', settings);
                        }, 100)
                    }
                })
            }else{
                if($('.product-single__media-wrapper img').length > 0){
                    $(document).on('click','.product-single__media-wrapper img',function(){
                        var IMG = $(this).attr('src');
                        if($(window).width() > 1024){
                            $('#zoom-img .zoom-thumb').html( '');
                            $('#zoom-img .zoom-main-container').html( '');
                            
                            var HTML = $('#product-info-left .thumbnails-wrapper').html();
                            var mainHTML = '<div class="main-zoom">';
                           
                            mainHTML += '<div class="item"><img src="'+ IMG.replace('_657x825_crop_center','') +'" alt="" /></div>';
                        
                            mainHTML += '</div>';
                            $('body').addClass('show-popup');
                            $('#zoom-img').addClass('show-zoom')
                            $('#zoom-img .zoom-thumb').html( '&nbsp;');
                            $('#zoom-img .zoom-main-container').html( mainHTML);
                        }else{
                            $('#zoom-img .zoom-main-container').html('');
                            var mainHTML = '<div class="swiper-container zoom-swiper-container" ><div class="swiper-wrapper">';
                             mainHTML += '<div class="swiper-slide"><div class="swiper-zoom-container"><img src="'+ IMG.replace('_657x825_crop_center','') +'" alt="" /></div></div>';
                            mainHTML += '</div></div><div class="z-swiper-pagination"></div>';
                            $('#zoom-img .zoom-main-container').html( mainHTML);
                            $('body').addClass('show-popup');
                            $('#zoom-img').addClass('show-zoom')
                            setTimeout(function(){
                                var settings = {
                                    zoom: true,
                                    spaceBetween: 0,
                                    pagination: {
                                        el: ".z-swiper-pagination",
                                        clickable: true

                                    }
                                }
                                var swiper = new Swiper('#zoom-img .zoom-swiper-container', settings);
                            }, 100)
                        }
                    })
                }
            }
            $('#zoom-img .icon-close').on('click',function(){
                $('body').removeClass('show-popup');
                $('#zoom-img').removeClass('show-zoom')
            })
            $(document).on('click','.zoom-thumb a',function(e){
                $('.zoom-thumb a').removeClass('active-thumbs')
                $(this).addClass('active-thumbs');
                e.preventDefault();
                var IMG = $(this).attr('href');
                $('.zoom-main-container .item').each(function(){
                    if( IMG == $(this).data('url')){
                        var pTop = $(this).position();
                        var dataType = $(this).data('type')
                        if(dataType == 'video')
                            $('video', this).get(0).play();
                        $('#zoom-img').animate({scrollTop:pTop.top },200);
                    }
                })
                
            })
        },
        imageSliderPDP: function(){
            this.imgZoomPDP();
            if($('.featured-image-slider').length > 0){
                
                var settings = {
                    navigation: {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev"
                    },
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true
                    }
                }
                var swiper = new Swiper('.featured-image-slider', settings);
                swiper.on('slideChange', function (data) {
                  var wWindow = $(window).width();
                  if( wWindow > 1024){
                    $('.product-single__thumbnails-item a').removeClass('active-thumb');
                    var item  = $('.product-single__thumbnails-item a')[data.realIndex];
                    $(item).addClass('active-thumb')
                  }
                });
                $(document).on('click','.product-single__thumbnails-item a',function(){
                    var index = $(this).data('index');
                    swiper.slideTo(index, 1000, false);
                })
            }
        },
        tabsPDP: function () {
            this.tabs('.tablinks');
            $(document).on('click','.tab-title',function(){
                $(this).closest('.tab-v').addClass('current-tab');
                $('.tab-v:not(.current-tab)').removeClass('active');
                $(this).closest('.tab-v').toggleClass('active');
                $(this).closest('.tab-v').removeClass('current-tab');
            })
        },
        tabs: function(tabname){
            $(document).on('click',tabname,function(){
                $(tabname).removeClass('active');
                $(this).closest('.tab').next().find('.tabcontent').hide();
                if( $(window).width() < 1025 && $('.template-product').length > 0){
                    $('.tabcontent').hide();
                }
                var tab = $('#' + $(this).data('tab'));
                $(this).addClass('active');
                tab.show();
            })
        },
        productSwatchPDP: function(){
            var __this = this;
            var sections = new theme.Sections();
            $(document).on('click','.template-product .swatch a',function(e){
                e.preventDefault();
                var newUrl =  $(this).attr('href');
                history.pushState({}, null, newUrl);
                $.get(newUrl + '?view=ajax', function(data, status){
                    if(status == 'success'){
                        $('#product-content').html(data);
                        sections.register('product', theme.Product)
                        __this.imageSliderPDP();
                        __this.mixInPlayPDP();
                        __this.instagramPDP();
                        if (typeof StampedFn !== 'undefined' && typeof StampedFn.loadBadges == 'function') {
                            StampedFn.loadBadges();
                            StampedFn.reloadUGC();
                            StampedFn.toggleForm('review');
                            StampedFn.toggleForm('question');

                        }
                        if(window._swat){
                            window._swat.initializeActionButtons("#product-content");
                          }else{
                            window.SwymCallbacks = window.SwymCallbacks || [];

                            window.SwymCallbacks.push(function(){
                              window._swat.initializeActionButtons("#product-content");
                            });
                          }
                    }
                });
            })

            $(document).on('click','.template-product .swatch .option-title',function(e){
                e.preventDefault();
                $('.swatch').toggleClass('active');
            })
        },
        productSwatchPLP: function(){
            var __this = this;
            $(document).on('click','.product-card .swatch a',function(e){
                e.preventDefault();
                __this.SwatchPLP($(this));
            });
            $(document).on('mouseover','.product-card .swatch a',function(e){
                e.preventDefault();
                __this.SwatchPLP($(this));
            })
        },
        SwatchPLP: function( ob ){
            var newUrl =  ob.attr('href') ;
            var colorItem = ob;
            ob.closest('.swatch').find('a').removeClass('checked');
            ob.addClass('checked')
            var checkWishlist = ob.closest('.wishlisthColors').length > 0 ? true: false;
            $.getJSON(newUrl + '.js', function(data){
                var variants = data.variants; 
                var variantSelected = ''; 
                variants.forEach(function(variant){
                    var merge_options = variant.options;
                    var isVariant = false;
                    merge_options.forEach(function(option){
                        if(Utils.getParam('pf_opt_band_size') != null){
                            var bandSize =  Utils.getParam('pf_opt_band_size')
                            if(option == bandSize) 
                                isVariant = true
                        }
                        if(Utils.getParam('pf_opt_cup_size') != null){
                            var cupSize = Utils.getParam('pf_opt_cup_size');
                            if(option == cupSize) 
                                isVariant = true
                        }
                        if(Utils.getParam('pf_opt_letter_size') != null){
                            var letterSize = Utils.getParam('pf_opt_letter_size')
                            if(option == letterSize) 
                                isVariant = true
                        }
                        
                    })
                    
                    if(isVariant == true && variantSelected == '' ){
                        variantSelected = variant;
                    }

                })
                if(variantSelected != '')
                    newUrl = newUrl + '?variant=' + variantSelected.id;
                var item = colorItem.closest('.product-card');
                item.find('.grid-view-item__link').attr('href', newUrl )
                item.find('.add-cart').attr('href', newUrl )
                if(checkWishlist == true){
                    var pUrl = newUrl + '?view=options-w';
                    $.get(pUrl,function(data, status){
                        var dataHTML = data.split('<!-- split -->');
                        ob.closest('.wishlisthColors').next().html(dataHTML[1]);
                        ob.closest('.wishlisthColors').prev().html(dataHTML[0]);
                    })
                }
                if(data.images.length > 0){
                    var featured_image =  data.featured_image.split('?');
                    var featured_images = featured_image[0].split('.');
                    var ext = featured_images[featured_images.length -1];
                    featured_images.pop();
                    featured_image = featured_images.join('.') + '_315x396_crop_center.' + ext;
                    var img_hover_url = featured_image;
                    if(data.images.length > 1){
                        let img_hover = data.images[1];
                        img_hover_url = Utils.optimizeImage(img_hover, '315x396_crop_center')

                    }
                    item.find('.img-main img').attr('src', featured_image).attr('srcset',featured_image)
                    item.find('.img-hover img').attr('src', img_hover_url).attr('srcset',img_hover_url)
                    
                }
                
            });
        },
        showFormAddToCartPLP: function(){
            $(document).on('click','.add-cart', function(e){
                e.preventDefault();
            });
            $(document).on('mouseover','.add-cart', function(e){
                e.preventDefault();
                var bandSize ='';
                var cupSize = '';
                var letterSize = '';
                var productId = $(this).closest('.grid__item').data('id') 
                // Utils is the libary of the filter & search app.

                if(Utils){
                    if(Utils.getParam('pf_opt_band_size') != null){
                        bandSize = Utils.getParam('pf_opt_band_size')
                    }
                    if(Utils.getParam('pf_opt_cup_size') != null){
                        cupSize = Utils.getParam('pf_opt_cup_size')
                    }
                    if(Utils.getParam('pf_opt_letter_size') != null){
                        letterSize = Utils.getParam('pf_opt_letter_size')
                    }
                }
                if( ! $(this).closest('.product-card').hasClass('form-cart-active')){
                     $('.collection-form-popup').html('');

                    var url = $(this).attr('href').trim();
                    if(url.indexOf('variant') != -1){
                        url = url + "&view=options"
                    }else{
                        url = url + "?view=options"
                    }
                    $(this).closest('.product-card').find('.card-info').load(url,function(responseTxt, statusTxt, xhr){
                        var sections = new theme.Sections();
                        sections.register('collection-form', theme.Product);
                        $(this).addClass('active');
                        $(this).closest('.product-card').addClass('form-cart-active');
                        // Trigger the size option when the filter has the options.
                        if(cupSize != ''){
                            var obCup = '#ProductSelect-option-cup-size-'+ cupSize + '-'+ productId;
                            $(obCup).removeAttr('disabled');
                            $(obCup).click();
                        }
                        if(bandSize != ''){
                            var obBand = 'input[value="'+ bandSize + '"]';
                            $(obBand).removeAttr('disabled');
                            $(obBand).click();
                        }
                        if(letterSize != ''){
                            var obLetter = '#ProductSelect-option-letter-size-'+ letterSize  + '-'+ productId;
                            $(obLetter).removeAttr('disabled');
                            $(obLetter).click();
                        }
                    })
                }
            })
            $('.grid__item').on('mouseleave','.form-cart-active', function(e){
                $(this).find('.card-info').removeClass('active');
                $(this).removeClass('form-cart-active');
                
            });
        },
        scrollTop: function(){
            var offSet = $('#MainContent').offset() ;
            $('.filter-scroll-to-top').click(function(){
                $("html, body").stop().animate({scrollTop: 0  }, 500, 'swing', function() { });
            });
        },
        collectionPage: function(){
           var sections = new theme.Sections();
           var ___this = this;
           if($('.child-collection').length > 0){
                var settings = {
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    loop: true,
                    breakpoints: {
                        768: {
                            spaceBetween: 0
                        },
                        320:{
                            spaceBetween: 0
                        }
                    }
                }
                var swiperCollection = new Swiper('.child-collection', settings);
                if($(window).width() > 1024){
                    swiperCollection.destroy()
                }
                $(window).on('resize',function(){
                    if($(this).width() > 1024){
                        swiperCollection.destroy()
                    }else{
                        swiperCollection.init()
                    }
                })
            }
            $(document).on('click','.title-group-size',function(){
                $(this).toggleClass('active');
                $('.group-size').slideToggle();
            })
            $(document).on('click','.collection-swatch-button-drowpdown', function(){
                $(this).closest('.wrapper-option').addClass('option-current');
                $(this).closest('.wrapper-option').toggleClass('wrapper-option-active');
                $('.wrapper-option:not(.option-current)').removeClass('wrapper-option-active');
                $(this).closest('.wrapper-option').removeClass('option-current');
            })
            // Trigger change options when select Size
            
            $(document).on('change','.collection-select-option', function(){
                var __this = $(this);
                var isWishlist = __this.closest('#wishlistList').length > 0 ? true: false;
                var optionValue = $(this).val().split('/');
                var i = 0;
                var htmlOption = '';
                if(optionValue.length > 1){
                    optionValue.forEach(function(item){
                        i++;
                        htmlOption += '<span class="lang_'+ i +'">' + item+ '</span>';
                    });
                    $(this).closest('.wrapper-option').removeClass('wrapper-option-active').find('span.label').html(htmlOption)
                }else{

                    $(this).closest('.wrapper-option').removeClass('wrapper-option-active').find('span.label').html($(this).val());
                }
                var optionIndex = $(this).attr('name');
                var optionValue = $(this).val();

                $(this).closest('form').find('[data-index ="'+ optionIndex +'"]').val(optionValue).trigger('change');
                $(this).closest('form').find('[data-index ="'+ optionIndex +'"]')[0].dispatchEvent(new Event('change')); 
                // only For PDP when we choose the size after the images have been loaded again.
                var self = $(this);
                if($('body').hasClass('template-product')){
                    // PDP
                    var productObject = JSON.parse( $('#ProductJson-product-template').html()); 
                    var currentVaraint = $('#ProductSelect-product-template').val();
                }else{
                    // PLP: update image when change the size option
                   
                    if(isWishlist == true){
                        var formP = __this.closest('form').attr('id').split('-');
                        var idP = '#ProductJson-collection-form-' + formP[formP.length - 1];

                        var productObject = JSON.parse( $(idP).html());
                        var selectorForm = '#ProductSelect-collection-form-' + formP[formP.length - 1];
                        var currentVaraint = $(selectorForm).val();
                    }else{
                       var productObject = JSON.parse( $('#ProductJson-collection-form').html()); 
                        var currentVaraint = $('#ProductSelect-collection-form').val();
                    } 
                    var medias = productObject.media;
                   
                    var variants = productObject.variants;
                    var sku = '';
                    variants.forEach(function( variant ){
                        if(variant.id == currentVaraint){
                            sku = variant.sku;
                        }
                    });
                    if(sku != ''){
                        var mediaUrl = [];
                        medias.forEach(function(media){
                            if(media.alt != null){
                                if(media.alt.indexOf(sku) != -1){
                                    mediaUrl.push(media.src)
                                }
                            }    
                        });
                        if( mediaUrl.length == 0)
                            mediaUrl.push(productObject.featured_image)
                       
                        var featured_image =  mediaUrl[0].split('?');
                        var featured_images = featured_image[0].split('.');
                        var ext = featured_images[featured_images.length -1];
                        featured_images.pop();
                        featured_image = featured_images.join('.') + '_315x396_crop_center.' + ext;
                        $(this).closest('.product-card').find('img').attr('src',featured_image).attr('srcset',featured_image)
                        
                    }
                }
                
                var obSelect = (isWishlist ==  true)? __this.closest('.card-footer').find('.wrapper-options input[type="radio"]'): $('.wrapper-options input[type="radio"]')
                var name_Option = __this.attr('name')
                var value_Option = __this.val();
                obSelect.each(function(){
                    var _this = $(this);
                    let nameOption = $(this).attr('name');
                    let valueOption = $(this).val();
                    
                    if(name_Option !=  nameOption){ 
                        _this.removeAttr('disabled');
                        var checkEnable = false;
                        productObject.variants.forEach(function( vari ){
                            if( valueOption == vari[nameOption] && value_Option == vari[name_Option] ){
                                    checkEnable = true;
                            }
                        })
                        if(checkEnable == false)
                            $(this).attr('disabled', 'disabled');
                    }
                });
                if($('body').hasClass('template-product')){
                    // Trigger all option
                    $('.selector-wrapper select').each(function(){
                        var dataIndex = $(this).data('index');
                        var selectedV = $(this).val();
                        if(name_Option != dataIndex){
                           
                            var $radios = $('input:radio[name='+ dataIndex +']');
                            if($radios.is(':checked') === false) {
                                $radios.filter('[value="'+ selectedV +'"]').prop('checked', true);
                                $radios.filter('[value="'+ selectedV +'"]').trigger('change')
                            }
                        }
                    });
                    var variantId = $('#ProductSelect-product-template').val();
                    var hrefProduct = window.location.href + '?variant=' + variantId +  '&view=ajaxsize'; 
                    
                    $.get(hrefProduct , function(data, status){
                        if(status == 'success'){
                            var dataContent = data.split('<!-- split -->');
                            $('#product-info-left').html(dataContent[0]);
                            $('#product-single__media-group').html(dataContent[1]);
                            sections.register('product', theme.Product);
                            ___this.imageSliderPDP();
                        }
                    });
                }
            })
            // Close sort by dropdown
            ___this.onBodyClick();
        },
        onBodyClick: function() {
            $(document).click(function(e){
                if($(e.target).closest('.filters-toolbar__item-wrapper').length != 0) return false;
                $('.boost-pfs-filter-filter-dropdown').hide();
                if($(e.target).closest('.wrapper-option-active').length == 0 )
                    $('.wrapper-option-active').removeClass('wrapper-option-active');
                if($(e.target).closest('.form-cart-active').length == 0 )
                    $('.form-cart-active').removeClass('form-cart-active');
                if($(e.target).closest('.swatch').length == 0 )
                    $('.swatch ').removeClass('active');
            });
        },
        ip: function(){
            $('#localizationForm .geo__submit').on('click',function(e){
                e.preventDefault();
                var form = $(this).closest('#localizationForm');
                var country = form.find('.disclosure__toggle-currency').data('country');
                var textStorge = '';
                if(country == 'FR')
                    textStorge += 'France | EUR €'
                if(country == 'DE')
                    textStorge += 'Germany | EUR €'
                if(country == 'IT')
                    textStorge += 'Italy | EUR €'
                if(country == 'ES')
                    textStorge += 'Spain | EUR €'
                if(country == 'GB')
                    textStorge += 'United Kingdom | GBP £'
                window.localStorage.setItem("geoCountry", textStorge )
                window.localStorage.setItem("geoCountryCode", country)
                form.submit();
            })

            
            var firstVisit = false;
            var __this = this;
            var timeVisit = false;

            var geoCountry = window.localStorage.getItem("geoCountry");
            var geoCountryCode = window.localStorage.getItem("geoCountryCode");
            if( geoCountry  != null ){
                $('#localizationForm .disclosure__toggle-currency').html(geoCountry);
                $('.geoLocalization .currency_d').html(geoCountry.replace('|',' ( ') + ' ) ');
                $('#localization_form .disclosure__toggle__currency').html(geoCountry);
            }
            if(geoCountryCode != null){ 
                $('.disclosure__toggle-currency').attr('data-country',geoCountryCode) 
                $('.disclosure__toggle__currency').attr('data-country',geoCountryCode) 
                if(geoCountryCode == 'GB'){    
                    $('body').addClass('uk-us')
                }else{

                    if( geoCountryCode == 'FR' ){
                        $('body').addClass('fr')
                    }
                }
            }
            if (typeof(Storage) !== "undefined") {
              firstVisit =  window.sessionStorage.getItem("firstVisit");
              timeVisit  =  window.localStorage.getItem("visiteds");
            }
            if(timeVisit != 1){
                var currencySelector = $('#CurrencySelector'), localeSelector = $('#LocaleSelector'); localizationForm = $('#localization_form');
                $.getJSON("https://ipgeolocation.abstractapi.com/v1/?api_key=5a53e2b6ec0e40b0823de4805ca8fc2c", function(data) {
                  
                  //Changed by Felix 2021-10-15
                  //Note: create scandale account in abstractapi.com and change the key
                  //https://ipgeolocation.abstractapi.com/v1/?api_key=ef10819b938b40a3a2ad00a2006ca3f7 from Branch8
                  
                    var country = data.country_code;
                    var oversea = true;
                    window.localStorage.setItem("geoCountryCode", country)
                    if( country == 'FR' || country == 'DE' || country  == 'ES' || country == 'IT' ){
                        if( firstVisit == false || firstVisit == null ){
                            var isSubmitForm = false;
                            if(country == 'FR'){
                                window.localStorage.setItem("geoCountry", 'France  |  EUR €') 
                                $('body').addClass('fr')
                                localeSelector.val('fr');
                                isSubmitForm = true;
                            }
                            if(country == 'DE'){
                                localeSelector.val('de');
                                isSubmitForm = true;
                            }
                            if(Shopify.currency.active != 'EUR' || isSubmitForm == true  ){
                                currencySelector.val('EUR');
                                localizationForm.submit();
                            }

                        }
                        oversea = false;
                    }else{
                        // if(timeVisit == false ||  timeVisit == null){
                        //     $('body').addClass('show-popup');
                        //     $('#show-form-language').show();
                        //     $(document).on('click','.geo__submit',function(){
                        //         timeVisit  =  window.localStorage.setItem("visiteds", 1 );
                        //     })
                        // }
                        if( country == 'GB'){
                            if( firstVisit == false || firstVisit == null ){
                                $('body').addClass('uk-us')
                                window.localStorage.setItem("geoCountry", 'United Kingdom | GBP £')
                                currencySelector.val('GBP');
                                localeSelector.val('en');
                                localizationForm.submit();
                           }
                        }else{
                            if(timeVisit == false ||  timeVisit == null){
                                $('body').addClass('show-popup');
                                $('#show-form-language').show();
                                $(document).on('click','.geo__submit',function(){
                                    timeVisit  =  window.localStorage.setItem("visiteds", 1 );
                                })
                            }
                        } 
                    } 
                })
                if( firstVisit == false || firstVisit == null ){
                    if (typeof(Storage) !== "undefined") {
                      sessionStorage.setItem("firstVisit", true);
                    }
                }
            } 
            $('#localization-d').click(function(){
                $('#show-form-language').addClass('show-form-update')
            });  
            $('.form-geo .icon-close').click(function(){
                $('#show-form-language').removeClass('show-form-update')
            });
        },
        global: function(){
            $('.bkg-overlay').on('click',function(){
                if($('body').hasClass('show-menu'))
                    $('.site-footer').animate({"right": "-110%" });
                if($('body').hasClass('show-popup'))
                    $('[data-cart-popup-wrapper]').addClass('cart-popup-wrapper--hidden').animate({"right": "-110%" });
                $('body').removeClass('show-menu').removeClass('show-popup').removeClass('boost-pfs-filter-tree-open-body');
                $('#video-popup').remove();
            })
            if($('.contact-page .form-message').length > 0){
                setTimeout(function(){
                    $('.contact-page .form-message').slideUp();
                },10000);
            }
            setTimeout(function(){
                $('.contact-page a.btn_light_second_outline').click(function(e){
                    e.preventDefault();
                    GorgiasChat.open();
                    $('#gorgias-chat-container').show();
                })

                $('.btn-chat-s').click(function(e){
                    e.preventDefault();
                    GorgiasChat.open();
                    $('#gorgias-chat-container').show();
                })
            },1000);
            if($('.bras-section').length > 0){
                $('.bras-section .grid__item__inner').hover( 
                    function(){
                        $('.bras-section').addClass('hover-item')
                    }, 
                    function(){
                        $('.bras-section').removeClass('hover-item')
                    }
                );
            }
        },
        menuMobile: function(){
            $('.mobile-nav--open').bind('click', function(){
                if($(body).hasClass('show-menu')){
                    $('.site-footer').animate({"right": "-110%" });
                    $('body').removeClass('show-menu').removeClass('show-popup');
                }else{
                    $('.site-footer').animate({"right": 0 });
                    $('body').addClass('show-menu').addClass('show-popup');
                }
                $('#menu-clone .site-nav--has-dropdown').removeClass('site-nav--has-dropdown');
            });

            $('.site-footer-item p.h8').on('click',function(){
                if($(window).width() < 1440){
                    $(this).closest('.site-footer__item-inner').addClass('show-sub');
                    setTimeout(function(){
                        $('.mobile-menu .site-footer__item-inner:not(.show-sub) p.h8.active ').removeClass('active');
                        $('.mobile-menu .site-footer__item-inner:not(.show-sub) .site-footer__linklist').slideUp();
                        $('.site-footer__item-inner.show-sub').removeClass('show-sub')
                    }, 100 );

                    $(this).toggleClass('active');
                    $(this).next().slideToggle();
                    $('#menu-clone .site-nav__link--button.active ').removeClass('active');
                    $('#menu-clone .site-nav__dropdown').slideUp();
                }
            });
            $(document).on('click','#menu-clone .site-nav__link--button',function(){
                $(this).toggleClass('active');
                $(this).next().slideToggle();
                $(this).closest('li').addClass('show-sub');
                setTimeout(function(){
                    $('#menu-clone li:not(.show-sub) .site-nav__link--button.active ').removeClass('active');
                    $('#menu-clone li:not(.show-sub) .site-nav__dropdown').slideUp();
                    $('li.show-sub').removeClass('show-sub')
                }, 100 );
                
                $('.site-footer-item p.h8').removeClass('active');
                $('.site-footer__linklist').slideUp();
            })
        },
        cartTop: function(){
            $('.site-header__cart').on('click',function(e){
                e.preventDefault();
                $('[data-cart-popup-wrapper]').removeClass('cart-popup-wrapper--hidden').animate({"right": "0" });
                $('body').addClass('show-popup');
                if($('.cart-subtotal__price').length > 0){
                    var percent = 0;
                    if(parseFloat($('.cart-subtotal__price').data('subtotal')) > 0){

                        if($('#fsb_amount').length > 0){
                            var totalShipping = parseFloat($('.cart-subtotal__price').data('subtotal')) + parseFloat($('#fsb_amount').html());
                            percent = (parseFloat($('.cart-subtotal__price').data('subtotal')) ) * 100 / totalShipping;
                        }else{
                            percent = 100;
                        } 
                        $('.shipping-bar-inner').css('width', percent + '%')
                    }
                }
            });
            $(document).on('click','.cart-popup__close',function(e){
                $('[data-cart-popup-wrapper]').addClass('cart-popup-wrapper--hidden').animate({"right": "-110%" });
                $('body').removeClass('show-popup');
            });
        },
        header: function(){
            $('#menu-clone').html($('#SiteNav').html());
            $('#menu-clone').prepend('<li class="form-search">'+ $('#SearchDrawer .search-form__container').html()+'</li>');
            $('.site-header').css('top', $('.announcement-bar').outerHeight() + 'px');
            $(window).on('resize',function(){
                $('.site-header').css('top', $('.announcement-bar').outerHeight() + 'px');
            })
           
            $('.site-header').hover(function(){
                if(!$(this).hasClass('fixedTop')){
                    $('.bkg-white').slideDown();
                }
             
            },function(){ 
                if(!$(this).hasClass('fixedTop')){
                    $('.bkg-white').slideUp();
                }
            })

            $(window).scroll(function(){
                if($(this).scrollTop() > 0){
                    $('.site-header').addClass('fixedTop');
                    $('.bkg-white').slideDown();
                }else{
                    $('.site-header').removeClass('fixedTop');
                    $('.bkg-white').slideUp();
                    
                }
            })
        },
        msg: function(){
            var __this = this;
            var arrTime = [];
            $('.addSlider').on('click',function(){
                $('.mgs-bar-outer').addClass('active');
                if($('.msg_number').length > 0){
                    $('.msg_number span').each(function(){
                        var number = parseInt($(this).data('number'));
                        arrTime.push(__this.animateValue($(this), 0, number, 100 ));
                    });
                }
            });
            $('.close-up').on('click',function(){
                $('.mgs-bar-outer').removeClass('active');
                for(var i = 0; i< arrTime.length; i++){
                    clearInterval(arrTime[i]);
                }
            });
            var swiper = new Swiper('.addSlider .swiper-container', {
                direction: 'vertical',
                loop: true,
                autoplay: true,
                navigation: {
                    nextEl: '.mgs-bar-next',
                    prevEl: '.mgs-bar-prev',
                }
            });
        },
        animateValue: function (id, start, end, duration) {
            var range = end - start;
            var current = start;
            var increment = end > start? 1000 : 0;
            var stepTime = Math.abs(Math.floor(duration / range));
            var obj = id;
            var timer = setInterval(function() {
                    current += increment;
                    if(current >= end){
                        obj.html(end.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    }else{
                        obj.html(current.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    }
                    
                    if (current >= end || start == end) {
                        clearInterval(timer);
                    }
                }, stepTime);
            return timer;
        },
        featuredCollection: function(){
            // Waiting Image lazyload
            setTimeout(function(){
                var swiper = new Swiper('.featured-products-slider', {
                        observer: true,
                        rebuildOnUpdate: true,
                        observeParents: true,
                        slidesPerView: 'auto',
                        spaceBetween: 25,
                        loop: true,                       
                        breakpoints: {
                            599: {
                                spaceBetween: 25
                            },
                            320:{
                                spaceBetween: 8
                            }
                        }
                    });
               
            },500)

        },
        logoBar: function(){
            let SwiperTop = new Swiper('.logo-bar-slider', {
              spaceBetween: 0,
              centeredSlides: true,
              speed: 6000,
              autoplay: {
                delay: 1,
              },
              loop: true,
              slidesPerView:'auto',
              allowTouchMove: false,
              disableOnInteraction: true
            });
            
        },
        quotes: function(){
            if( $('.quotes-slider').length > 0) {
                var $slider = $('.quotes-slider');
                var $progressBarLabel = $( '.swiper-scrollbar-drag' );
                var countItem = 100 / $('.quotes-slider .quotes-slide').length;
                $progressBarLabel.css('width',countItem + '%');
                var $countItem =  $('.quotes-slider .quotes-slide').length - 1;
                //$progressBarLabel.css('animation','line-slide '+ ($countItem * 6) +'s  infinite linear');
                $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {  
                    if(nextSlide == 0){
                        $slider.addClass('loopslide')
                    }else{
                        $slider.removeClass('loopslide')
                    }
                    setTimeout(function(){
                     $progressBarLabel.css('left',(countItem * nextSlide) + '%');
                    }, 25000);
                    
                });
                
                $slider.slick({
                    pauseOnHover: false,
                    speed: 25000,
                    autoplay: true,
                    autoplaySpeed: 0,
                    centerMode: false,
                    cssEase: 'linear',
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true,
                    infinite: true,
                    arrows: false,
                    buttons: false,
                    dots: false
                });
            }
        },
        videoPlay: function(){
            var __this = this;
            if($(".has-video").length > 0){
                $(".has-video").hover( 
                    function(){
                        if( $(this).find('video').length > 0)
                            $('video', this).get(0).play();
                    }, 
                    function(){
                        if( $(this).find('video').length > 0)
                            $('video', this).get(0).pause(); 
                    }
                );
                if($(window).width() < 1025){
                    $(".has-video video").each(function(){
                        $(this).get(0).play();
                    })
                
                }
            }
        },
        backgroundVideoPlay: function(){
            $(window).scroll(function(){
                var pTop =  $(window).height() + $(this).scrollTop();
                var scroll = $(window).scrollTop();
                if($('.mix-to-play').length > 0){
                    var offSet = $('.mix-to-play').offset();
                    var offsetTop = offSet.top + $('.mix-to-play').height() + $(window).height();
                    var op = 0;
                    if( pTop >= offSet.top && pTop < offsetTop  ){

                        op = ((pTop - offSet.top) / $(window).height()) + 0.8 ;
                        op =  (pTop - offSet.top) * 8 / $(window).height() ;
                        if( op  > 1 )
                            op = 1;
                        $('video', $('.mix-to-play')).get(0).play();
                        gsap.to(".mix-to-play .video-background-section",{opacity: op, scale: op, duration: 1 });
                    }else{
                        $('video', $('.mix-to-play')).get(0).pause();
                    }
                    
                }
                
            })
        },
        readCookie : function(name){
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        setCookiePopup: function(name, cValue){
            document.cookie = name + "=" + cValue + ";expires= " + this.ssCalculateExpireDate(1) +"; path=/";
        },
        ssCalculateExpireDate: function (days){
            var d = new Date();
            d.setTime(d.getTime() + (days*24*60*60*1000));
            d.toUTCString();
            return d;
        }
        
    }
