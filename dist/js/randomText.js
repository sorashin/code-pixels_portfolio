LetterTicker = (function() {
  var mergeOptions, randomChar;
 
  /**
    Options
    {Number} step ランダム文字の長さ
    {Number} fps アニメーションFPS
    {String} text 表示する文章。空欄の場合はターゲットとなるDOM要素のテキスト
    {Function} callback 表示完了後に呼び出すコールバック関数
  */
  LetterTicker.prototype.step = 8;
  LetterTicker.prototype.fps = 24;
  LetterTicker.prototype.text = '';
  LetterTicker.prototype.callback = function() {};
 
  LetterTicker.prototype.str = [];
  LetterTicker.prototype.types = [];
  LetterTicker.prototype.nodes = null;
 
  function LetterTicker(selector, opts) {
    this.nodes = document.querySelectorAll(selector);
    if (!this.nodes) {
      return;
    }
    mergeOptions.call(this, opts);
    for (var i=0, _len=this.nodes.length; i<_len; i++) {
      var node = this.nodes[i];
      if (this.text) {
        this.str = this.text.split('');
      } else if (node.textContent) {
        this.str = node.textContent.split('');
      } else {
        continue;
      }
      this.types = [];
      for (var j=0,len=this.str.length; j<len; j++) {
        var ch = this.str[j];
        if (ch === ' ') {
          this.types[j] = 'space';
        } else {
          this.types[j] = 'symbol';
        }
      }
      node.innerHTML = '';
      this.shuffle(node, this.step * -1);
    }
  }
 
  mergeOptions = function(opts) {
    var key, value;
    for (key in opts) {
      value = opts[key];
      if (value) {
        this[key] = value;
      }
    }
    return this;
  };
 
  randomChar = function(type) {
    var pool;
    switch (type) {
      case 'symbol':
        pool = ',.?/\\(^)![]{}*&^%$#\'"';
        break;
      default:
        pool = '';
    }
    var arr = pool.split('');
    return arr[Math.floor(Math.random() * arr.length)];
  };
 
  LetterTicker.prototype.shuffle = function(node, start) {
    var len = this.str.length;
    var strCopy = this.str.slice(0);
    if (start > len) {
      this.callback.call(node);
      return;
    }
    for (var i=Math.max(start,0); i<len; i++) {
      if (i < start + this.step) {
        strCopy[i] = randomChar.call(this, this.types[i]);
      } else {
        strCopy[i] = '';
      }
    }
    node.textContent = strCopy.join('');
    setTimeout((function(_this) {
      return function() {
        _this.shuffle(node, start + 1);
      };
    })(this), 1000 / this.fps);
    return this;
  };
 
  return LetterTicker;
 
})();