// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		suggestionStyle: 'style2',
		suggestionMobileStyle: 'style2',
		suggestionStyle2MainContainerSelector: '.search-form__container__bottom'
			//suggestionMode: 'test',
			//suggestionPosition: 'left'
	}
};

(function() {
	BoostPFS.inject(this);
	InstantSearchMobile.prototype.afterShowSearchBoxMobile = function(searchBoxId) {
		if (!searchBoxId) searchBoxId = this.searchBoxId;
		// Hide debut's search bar on mobile, and show our search bar instead
		
		if(jQ('.js-drawer-close').length > 0){
			setTimeout(function() {
				//jQ('.js-drawer-close').trigger('click');
			});
		}
	};

	SearchInput.prototype.customizeInstantSearch= function() {
		// Hide debut's search suggestion
		if (jQ('.predictive-search-wrapper').length > 0){
				jQ('.predictive-search-wrapper').hide();
		}

		if(jQ('.boost-pfs-search-suggestion-no-result').length > 0){
			jQ('.search-form__container__bottom').removeClass('hide-static-block')
			
		}else{
			jQ('.search-form__container__bottom').addClass('hide-static-block')
			jQ('.boost-pfs-search-suggestion-item img').each(function(){
				var imgSrc = $(this).attr('src').replace('200x','87x109_crop_center@2x');
				$(this).attr('src',imgSrc)
			})
		}
		if(jQ(window).width() < 1440 ){
			jQ('.search-form__container__bottom').append(jQ('.boost-pfs-search-suggestion-wrapper'))
		}
		
		
	};

	// function closeSuggestionMobile(searchBoxId, isCloseSearchBox) {
	// 	jQ(searchBoxId).autocomplete('close');
	// 	jQ('.' + Class.searchSuggestion + '[data-search-box="' + searchBoxId + '"]').parent().hide();
	// 	// Remove search box
	// 	var isCloseSearchBox = typeof isCloseSearchBox !== 'undefined' ? isCloseSearchBox : false;
	// 	if (isCloseSearchBox) jQ('.boost-pfs-search-suggestion-mobile-top-panel,.boost-pfs-search-suggestion-mobile-overlay').hide();
	// 	// Update current term for all search boxes
	// 	setValueAllSearchBoxes();
	// 	// Add back tabindex=-1
	// 	jQ('.boost-pfs-search-no-tabindex').attr('tabindex', -1);
	// 	// Return scrolling of body
	// 	if(jQ('body').hasClass(Class.searchSuggestionMobileOpen)){    
	// 		jQ('body').removeClass(Class.searchSuggestionMobileOpen);
	// 	}
	// 	BoostPFS.afterCloseSuggestionMobile(searchBoxId, isCloseSearchBox);
	
	// 	// Close search theme debut
	// 	if(jQ('.js-drawer-close').length > 1){
	// 		jQ('.js-drawer-close').trigger('click');
	// 	}
	// }

})();