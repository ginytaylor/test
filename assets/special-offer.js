$(function(){
  $(document).on('click', "input[name='checkout']:not(.saso-ignore), input[value='Checkout']:not(.saso-ignore), button[name='checkout']:not(.saso-ignore), [href$='checkout']:not(.saso-ignore), button[value='Checkout']:not(.saso-ignore), input[name='goto_pp'], button[name='goto_pp'], input[name='goto_gc'], button[name='goto_gc']", function(e){
    e.preventDefault();
    if (typeof sasoCheckout != "function") {
      window.location = "/checkout";
    }
    $.ajax({
      cache: false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "GET",
      url: '/cart.js',
      success: function(res) {
        window.saso.cart = res
        sasoCheckout()
      }
    })

  });
});