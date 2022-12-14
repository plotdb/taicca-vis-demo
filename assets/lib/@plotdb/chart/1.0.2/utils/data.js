(function(){
  var main;
  main = {
    number: function(opt){
      var data, len;
      opt == null && (opt = {});
      data = opt.data.filter(function(it){
        return !(!it || (it + "").trim() === '');
      });
      len = data.filter(function(it){
        return !isNaN(parseFloat(it));
      }).length;
      return len / data.length;
    },
    serial: function(opt){
      var data, hash, i$, to$, i, delta, k;
      opt == null && (opt = {});
      data = [].concat(opt.data);
      data.sort(function(a, b){
        return b - a;
      });
      hash = {};
      for (i$ = 1, to$ = data.length; i$ < to$; ++i$) {
        i = i$;
        if (isNaN(data[i]) || isNaN(data[i - 1])) {
          hash[data[i] > data[i - 1]
            ? data[i] + ":" + data[i - 1]
            : data[i - 1] + ":" + data[i]] = true;
        } else {
          delta = data[i] - data[i - 1];
        }
        hash[delta] = true;
      }
      return 1 / ((function(){
        var results$ = [];
        for (k in hash) {
          results$.push(k);
        }
        return results$;
      }()).filter(function(it){
        return it !== '0';
      }).length || 2);
    },
    text: function(opt){
      opt == null && (opt = {});
      return 1 - this.number(opt);
    },
    category: function(opt){
      var len, maxlen, ret, ref$, ref1$, ref2$;
      opt == null && (opt = {});
      len = Array.from(new Set(opt.data)).length;
      maxlen = opt.data.length;
      ret = (ref$ = (ref1$ = 1 - ((ref2$ = len - 2) > 0 ? ref2$ : 0) / maxlen - 1 / maxlen) > 0 ? ref1$ : 0) < 1 ? ref$ : 1;
      if (this.number(opt)) {
        ret = ret * 0.9;
      }
      return ret;
    },
    parse: function(data){
      var head, body;
      if (Array.isArray(data)) {
        head = data.slice(0, 1)[0];
        body = data.slice(1);
        body = body.map(function(d, i){
          var ret;
          ret = {};
          head.map(function(h, j){
            return ret[h] = d[j];
          });
          return ret;
        });
        return {
          head: head,
          body: body
        };
      }
      return data;
    },
    autotype: function(data){
      var head, res$, k, type, i$, len$, key, d, ret, list;
      data == null && (data = []);
      res$ = [];
      for (k in data[0] || {}) {
        res$.push(k);
      }
      head = res$;
      type = [];
      for (i$ = 0, len$ = head.length; i$ < len$; ++i$) {
        key = head[i$];
        d = data.map(fn$);
        ret = {
          key: key,
          types: {
            R: main.number({
              data: d
            }),
            O: main.serial({
              data: d
            }),
            N: main.text({
              data: d
            }),
            C: main.category({
              data: d
            })
          }
        };
        list = ['R', 'O', 'N', 'C'].map(fn1$);
        list.sort(fn2$);
        ret.type = list[0][0];
        type.push(ret);
      }
      return type;
      function fn$(it){
        return it[key];
      }
      function fn1$(it){
        return [it, ret.types[it]];
      }
      function fn2$(a, b){
        return b[1] - a[1];
      }
    },
    autobind: function(data, dimension){
      var datatypes, dims, k, v, i$, len$, dim, ts, j$, to$, i, t, k$, to1$, dt, ret;
      data == null && (data = []);
      dimension == null && (dimension = {});
      datatypes = this.autotype(data);
      dims = (function(){
        var ref$, results$ = [];
        for (k in ref$ = dimension) {
          v = ref$[k];
          results$.push({
            k: k,
            v: v
          });
        }
        return results$;
      }()).filter(function(it){
        return !it.v.passive;
      });
      dims.sort(function(a, b){
        var ret, ref$, ma, mb;
        ret = (a.v.priority || 100) - (b.v.priority || 100);
        if (ret !== 0) {
          return ret;
        }
        ref$ = [a.v.type || 'R', b.v.type || 'R'].map(function(t){
          return Math.min.apply(Math, (function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = t.length; i$ < to$; ++i$) {
              results$.push(i$);
            }
            return results$;
          }()).map(function(i){
            return "CONR".indexOf(t[i]);
          }));
        }), ma = ref$[0], mb = ref$[1];
        return ma - mb;
      });
      for (i$ = 0, len$ = dims.length; i$ < len$; ++i$) {
        dim = dims[i$];
        dim.bind = null;
        ts = dim.v.type || 'RNOC';
        for (j$ = 0, to$ = ts.length; j$ < to$; ++j$) {
          i = j$;
          t = ts[i];
          datatypes.sort(fn$);
          for (k$ = 0, to1$ = datatypes.length; k$ < to1$; ++k$) {
            i = k$;
            dt = datatypes[i];
            if (dt.types[t] < 0.5 || dt.used || (t === 'C' && dt.types.R > 0.5)) {
              continue;
            }
            dim.bind = dim.v.multiple ? [dt] : dt;
            dt.used = true;
            break;
          }
        }
      }
      for (i$ = 0, len$ = dims.length; i$ < len$; ++i$) {
        dim = dims[i$];
        if (!dim.v.multiple) {
          continue;
        }
        ts = dim.v.type || 'RNOC';
        for (j$ = 0, to$ = ts.length; j$ < to$; ++j$) {
          i = j$;
          t = ts[i];
          datatypes.sort(fn1$);
          for (k$ = 0, to1$ = datatypes.length; k$ < to1$; ++k$) {
            i = k$;
            dt = datatypes[i];
            if (dt.types[t] < 0.5 || dt.used || (t === 'C' && dt.types.R > 0.5)) {
              continue;
            }
            dim.bind.push(dt);
            dt.used = true;
          }
        }
      }
      ret = {};
      for (i$ = 0, len$ = dims.length; i$ < len$; ++i$) {
        dim = dims[i$];
        if (dim.bind) {
          ret[dim.k] = dim.bind;
          (Array.isArray(dim.bind)
            ? dim.bind
            : [dim.bind]).map(fn2$);
        }
      }
      return ret;
      function fn$(a, b){
        var ret;
        ret = (b.types[t] || 0) - (a.types[t] || 0);
        if (b.types[t] === a.types[t] && t === 'R') {
          return (a.types.O || 0) - (b.types.O || 0);
        }
        return ret;
      }
      function fn1$(a, b){
        var ret;
        ret = (b[t] || 0) - (a[t] || 0);
        if (b[t] === a[t] && t === 'R') {
          return (a.O || 0) - (b.O || 0);
        }
        return ret;
      }
      function fn2$(it){
        var ref$;
        return ref$ = it.used, delete it.used, ref$;
      }
    }
  };
  if (typeof chart != 'undefined' && chart !== null) {
    (chart.utils || (chart.utils = {})).data = main;
  }
}).call(this);
