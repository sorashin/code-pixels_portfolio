$(document).ready(function(){
  h = $(window).height();
  console.log(h);
  $(".section").css("min-height", h + "px");
  $(".title").css("margin-top", h/2-20 + "px");
  $(window).resize(function() {
  //画面リサイズ時の高さ取得
  h = $(window).height();
  $(".section").css("min-height", h + "px");
  $(".title").css("margin-top", h/2-20 + "px");
  });
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
});
