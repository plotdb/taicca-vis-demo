(function(){
  var zmgr;
  zmgr = function(opt){
    opt == null && (opt = {});
    this.opt = opt;
    this.stack = [];
    this.step = opt.step || 1;
    if (opt.init != null) {
      this.init = opt.init;
    }
    return this;
  };
  zmgr.prototype = import$(Object.create(Object.prototype), {
    add: function(v, s){
      s == null && (s = 0);
      if (this.init != null) {
        v = this.step > 0
          ? Math.max(this.init, v)
          : Math.min(this.init, v);
      }
      if (!(this.value != null)) {
        this.value = v;
      }
      v = this.step > 0
        ? Math.max(this.value, v)
        : Math.min(this.value, v);
      v = v + (this.step > 0
        ? 1
        : -1) * Math.max(Math.abs(this.step), Math.abs(s));
      this.stack.push(v);
      this.value = v;
      return v;
    },
    remove: function(v){
      var i;
      if (!~(i = this.stack.indexOf(v))) {
        return;
      }
      return this.stack.splice(i, 1);
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = zmgr;
  } else if (typeof window != 'undefined' && window !== null) {
    window.zmgr = zmgr;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
