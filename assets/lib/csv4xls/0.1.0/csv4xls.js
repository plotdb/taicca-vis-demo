(function(){
  var reg;
  reg = function(cb){
    var ret;
    ret = cb();
    if (typeof module != 'undefined' && module !== null) {
      return module.exports = ret;
    } else if (typeof window != 'undefined' && window !== null) {
      return window.csv4xls = ret;
    }
  };
  reg(function(){
    var obj, ret;
    obj = {
      toArray: function(data){
        var str, ba, i$, to$, i;
        str = data.map(function(d, i){
          return d.map(function(v, j){
            return v + "";
          }).join('\t');
        }).join('\r\n');
        str = data.map(function(d, i){
          return d.map(function(v, j){
            return '"' + ('' + v).replace(/"/g, '""').replace(/\n/g, '\r') + '"';
          }).join('\t');
        }).join('\r\n');
        ba = new Uint8Array(2 + str.length * 2);
        for (i$ = 0, to$ = str.length; i$ < to$; ++i$) {
          i = i$;
          ba[i * 2 + 2] = str.charCodeAt(i);
          ba[i * 2 + 3] = str.charCodeAt(i) >> 8;
        }
        ba[0] = 0xff;
        ba[1] = 0xfe;
        return ba;
      },
      toBlob: function(data){
        var ba;
        ba = obj.toArray(data);
        return new Blob([ba], {
          type: "text/csv"
        });
      },
      toHref: function(data){
        var blob;
        blob = obj.toBlob(data);
        return URL.createObjectURL(blob);
      },
      download: function(data, name){
        var href, a;
        name == null && (name = "data.csv");
        href = this.toHref(data);
        a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('download', name + (/\.csv$/i.exec(name) ? '' : '.csv'));
        a.style.opacity = 0;
        a.style.position = 'absolute';
        document.body.appendChild(a);
        a.click();
        return document.body.removeChild(a);
      }
    };
    ret = function(it){
      return obj.toHref(it);
    };
    return import$(ret, obj);
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
