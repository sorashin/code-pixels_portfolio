$(document).ready(function(){
  var h = $(window).height();
  $(".section").css("min-height", h + "px");
  $(".title").css("margin-top", h/2-20 + "px");

  //画面リサイズ時の高さ取得
  $(window).resize(function() {
  var h = $(window).height();
  var w = $(window).width();
  var scale = w/1000;
  $(".section").css("min-height", h + "px");
  $(".title").css("margin-top", h/2-20 + "px");
  bubbly.scale.set(scale, scale, scale);
  smartlock.scale.set(scale, scale, scale);
  });
  if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
    $(".title h1").css("width",300 + "px");
  } else {
    // BUBBLYをホバーした時に表示するアクション
    $(".bubbly").hover(function(){
      // FadeIn
      $("h1" ,this).addClass("fadein_h1");
      $("p" ,this).addClass("fadein_p");
      $("span", this).addClass("ripple_animate");
      // text
      letterTicker_2 = new LetterTicker('.fadein_h1', {callback: function() {},step: 1, fps: 60});
      letterTicker_3 = new LetterTicker('.fadein_p', {callback: function() {},step: 1, fps: 60});
      // Ripple
      var ink, d, x, y, cx, cy;
      ink = $(this).find("span");
      if(!ink.height() && !ink.width()){
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            cx = ($(this).outerHeight()-d)/2;
            cy = ($(this).outerWidth()-d)/2;
            ink.css({height: d, width: d, top: cx, left: cy});
      }
      // BUBBLY追加
      // scene.add(bubbly);

    },function(){
        $("h1", this).removeClass("fadein_h1");
        $("p", this).removeClass("fadein_p");
        $("span", this).removeClass("ripple_animate");
        // BUBBLY削除
        // scene.remove( bubbly );
    });
    // SMARTLOCKをホバーした時に表示するアクション
    $(".smartlock").hover(function(){
      // FadeIn
      $("h1" ,this).addClass("fadein_h1");
      $("p" ,this).addClass("fadein_p");
      $("span", this).addClass("ripple_animate");
      // text
      letterTicker_2 = new LetterTicker('.fadein_h1', {callback: function() {},step: 1, fps: 60});
      letterTicker_3 = new LetterTicker('.fadein_p', {callback: function() {},step: 1, fps: 60});
      // Ripple
      var ink, d, x, y, cx, cy;
      ink = $(this).find("span");
      if(!ink.height() && !ink.width()){
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            cx = ($(this).outerHeight()-d)/2;
            cy = ($(this).outerWidth()-d)/2;
            ink.css({height: d, width: d, top: cx, left: cy});
      }
      // BUBBLY追加
      scene.add(smartlock);
      scene.remove( bubbly );
    },function(){
        $("h1", this).removeClass("fadein_h1");
        $("p", this).removeClass("fadein_p");
        $("span", this).removeClass("ripple_animate");
        // BUBBLY削除
        scene.remove( smartlock );
        scene.add(bubbly);
    });
  }
});
