var bcsffilter = new BCSfFilter(); bcsffilter.init(); if (typeof bcSfFilterConfig != 'undefined' && typeof bcSfFilterConfig.general != 'undefined' && typeof bcSfFilterConfig.general.isInitFilter != 'undefined' && bcSfFilterConfig.general.isInitFilter === true) { bcsffilter.initFilter(); } jQ(window).load(function() { bcsffilter.initSearchBox(); });


// $(document).ready(function(){
// 	scrollBarMenuMobile();
// })
// function scrollBarMenuMobile(){
//   jQ('.AccessibleNavSecond').jScrollPane({resizeSensor:true,autoReinitialise: true});
// }
