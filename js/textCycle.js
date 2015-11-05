//var divs = $('div[id^="content-"]').hide(),
//    i = 0;
//
//(function cycle() { 
//
//    divs.eq(i).fadeIn(400)
//              .delay(1000)
//              .fadeOut(400, cycle);
//
//    i = ++i % divs.length;
//
//})();
var divs = $('u').hide(),
    i = 0;

(function cycle() { 

    divs.eq(i).fadeIn(600)
              .delay(1800)
              .fadeOut(600, cycle);

    i = ++i % divs.length;

})();
