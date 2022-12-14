(function(){
  var svgns, parent, aniloop, visibilityObserver, resizeObserver, withDefault, defaultConfig, chart;
  svgns = "http://www.w3.org/2000/svg";
  parent = function(n, s, e){
    var m;
    m = n;
    while (n && n !== e) {
      n = n.parentNode;
    }
    if (n !== e) {
      return null;
    }
    if (!s) {
      return n;
    }
    n = m;
    while (n && n !== e && (!n.matches || (n.matches && !n.matches(s)))) {
      n = n.parentNode;
    }
    if (n === e && (!e.matches || !e.matches(s))) {
      return null;
    }
    return n;
  };
  aniloop = function(){
    this.running = false;
    this.time = {
      now: 0,
      last: 0
    };
    this.fps(60);
    this.evtHandler = {};
    return this;
  };
  aniloop.prototype = import$(Object.create(Object.prototype), {
    on: function(n, cb){
      var this$ = this;
      return (Array.isArray(n)
        ? n
        : [n]).map(function(n){
        var ref$;
        return ((ref$ = this$.evtHandler)[n] || (ref$[n] = [])).push(cb);
      });
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    reset: function(){
      return this.time = {
        now: 0
      };
    },
    setTime: function(t){
      return this.time.now = t;
    },
    getTime: function(){
      return this.time.now;
    },
    isRunning: function(){
      return this.running;
    },
    toggle: function(it){
      if (it != null) {
        this.running = !it;
      }
      if (this.running) {
        return this.pause();
      } else {
        return this.run();
      }
    },
    pause: function(){
      return this.running = false;
    },
    render: function(){
      return this.fire('tick', this.time.now);
    },
    run: function(fps){
      var this$ = this;
      if (fps != null) {
        this.fps(fps);
      }
      if (this.running) {
        return;
      }
      this.running = true;
      return requestAnimationFrame(function(t){
        return this$.handler(this$.time.last = t, true);
      });
    },
    throttle: function(v){
      v == null && (v = true);
      return this.isThrottled = v;
    },
    fps: function(it){
      if (!(it != null)) {
        return this._fps_val;
      }
      this._fps_val = it > 0.01 ? it : 0.01;
      return this._fps_delay = 1000 / this._fps_val;
    },
    handler: function(t, force){
      var delay, ref$, this$ = this;
      force == null && (force = false);
      if (!this.running) {
        return;
      }
      this.time.now = t;
      delay = this.isThrottled
        ? (ref$ = this._fps_delay) > 1000 ? ref$ : 1000
        : this._fps_delay;
      if (force || this.time.now - this.time.last >= delay) {
        this.time.last = t;
        this.render();
      }
      return requestAnimationFrame(function(t){
        return this$.handler(t, false);
      });
    }
  });
  visibilityObserver = {
    list: [],
    init: function(){
      var ref$, h, vc, this$ = this;
      this.inited = true;
      ref$ = document.hidden != null
        ? ['hidden', 'visibilitychange']
        : document.msHidden != null
          ? ['hidden', 'visibilitychange']
          : document.webkiHidden != null
            ? ['webkitHidden', 'webkitvisibilitychange']
            : ['hidden', 'visibilitychange'], h = ref$[0], vc = ref$[1];
      return document.addEventListener(vc, debounce(150, function(){
        var th;
        th = !!document[h];
        return this$.list.map(function(it){
          return it.throttle(th);
        });
      }, false));
    },
    add: function(aniloop){
      if (!this.inited) {
        this.init();
      }
      return this.list.push(aniloop);
    }
  };
  resizeObserver = {
    wm: new WeakMap(),
    ro: new ResizeObserver(function(list){
      return list.map(function(n){
        var ret;
        ret = resizeObserver.wm.get(n.target);
        return ret._resize();
      });
    }),
    add: function(node, obj){
      this.wm.set(node, obj);
      return this.ro.observe(node);
    },
    'delete': function(it){
      this.ro.unobserve(it);
      return this.wm['delete'](it);
    }
  };
  withDefault = function(cfg, defcfg){
    var _;
    cfg == null && (cfg = {});
    defcfg == null && (defcfg = {});
    defcfg = JSON.parse(JSON.stringify(defcfg));
    _ = function(cfg, defcfg){
      var k, v;
      for (k in defcfg) {
        v = defcfg[k];
        if (!(cfg[k] != null)) {
          cfg[k] = v;
        } else if (typeof cfg[k] === 'object' && typeof v === 'object') {
          withDefault(cfg[k], defcfg[k]);
        }
      }
      return cfg;
    };
    return _(cfg, defcfg);
  };
  defaultConfig = function(cfg){
    var _;
    _ = function(meta, ret){
      var ctrls, that, id, v;
      ret == null && (ret = {});
      ctrls = (that = meta.child) ? that : meta;
      for (id in meta) {
        v = meta[id];
        if (!v.type) {
          _(v, ret[id] || (ret[id] = {}));
        } else if (v['default']) {
          ret[id] = v['default'];
        }
      }
      return ret;
    };
    return _(cfg);
  };
  chart = function(opt){
    var this$ = this;
    opt == null && (opt = {});
    this.root = typeof opt.root === 'string'
      ? document.querySelector(opt.root)
      : opt.root;
    this.useSample = opt.useSample != null ? opt.useSample : true;
    this.autoSelect = opt.autoSelect != null ? opt.autoSelect : true;
    this.forceInit = opt.forceInit ? opt.forceInit : false;
    this.prepareSvg = opt.prepareSvg != null ? opt.prepareSvg : true;
    this.layoutOpt = opt.layout != null ? opt.layout : true;
    this.delayRender = opt.delayRender || false;
    this.dataAccessor = opt.dataAccessor != null
      ? opt.dataAccessor
      : function(it){
        if (it) {
          return it.data._raw;
        } else {
          return null;
        }
      };
    this.raw = opt.raw || null;
    this.mod = opt.mod || {};
    this.cfg = opt.config || {};
    this.seed = opt.seed || Math.random();
    this.binding = opt.binding || {};
    this.evtHandler = {};
    this.init = proxise.once(function(){
      return this$._init();
    });
    this._resize = null;
    if (this.autoSelect) {
      this.root.addEventListener('click', this._select = function(e){
        var p;
        if (!(p = parent(e.target, '.data', this$.root))) {
          return;
        }
        return this$.fire('select', [{
          data: this$.dataAccessor(p),
          node: p
        }]);
      });
      this.root.addEventListener('mouseover', this._hover = function(e){
        var p;
        if (!(p = ld$.parent(e.target, '.data', this$.root))) {
          return;
        }
        return this$.fire('hover', [{
          data: this$.dataAccessor(p),
          node: p
        }]);
      });
    }
    return this;
  };
  chart.prototype = import$(Object.create(Object.prototype), {
    _init: function(){
      var layoutRoot, ref$, r, p, this$ = this;
      if (window.getComputedStyle(this.root).position === 'static') {
        this.root.style.position = 'relative';
      }
      layoutRoot = this.layoutOpt ? typeof this.layoutOpt !== 'object'
        ? this.root.querySelector('.pdl-layout')
        : typeof this.layoutOpt.root === 'string'
          ? this.root.querySelector(this.layoutOpt.root)
          : this.layoutOpt.root ? this.layoutOpt.root : null : null;
      if (this.prepareSvg && !(this.svg = this.root.querySelector('svg'))) {
        this.svg = document.createElementNS(svgns, "svg");
        ref$ = this.svg.style;
        ref$.width = "100%";
        ref$.height = "100%";
        if (this.layoutOpt) {
          if (!layoutRoot) {
            console.error("[@plotdb/chart] layout enabled yet layout root isn't configured properly. ");
          }
          r = layoutRoot.querySelector('[data-type=render]');
          if (!r) {
            console.warn("[@plotdb/chart] prepareSvg and layout is configured at the same time,\nyet render container for layout is not found. svg is thus appended in the root.");
          }
        }
        (r || this.root).appendChild(this.svg);
      }
      this._aniloop = new aniloop();
      visibilityObserver.add(this._aniloop);
      this._aniloop.on('tick', function(){
        return this$.tick();
      });
      return p = Promise.resolve().then(function(){
        var defcfg, ret;
        defcfg = defaultConfig(this$.mod.config || {});
        withDefault(this$.cfg, defcfg);
        if (this$.raw && Array.isArray(this$.raw)) {
          return;
        }
        if (!this$.useSample || !this$.mod.sample) {
          return;
        }
        ret = this$.mod.sample.apply(this$);
        return ret.then
          ? ret.then()
          : Promise.resolve(ret);
      }).then(function(it){
        var ref$;
        return this$.raw = (ref$ = it || {}).raw, this$.binding = ref$.binding, this$;
      }).then(function(){
        var ref$, _resizeLock;
        if (!this$.raw) {
          this$.raw = [];
        }
        if (this$.layoutOpt) {
          if (!(typeof layout != 'undefined' && layout !== null)) {
            console.warn("[@plotdb/chart] layout-opt is set yet @plotdb/layout is not found.");
          } else {
            if (!layoutRoot) {
              console.error("[@plotdb/chart] cannot determine root node for @plotdb/layout.");
              console.error("[@plotdb/chart] config layout properly or disable layout by setting layout to false");
            }
            this$.layout = new layout(typeof this$.layoutOpt === 'object'
              ? (ref$ = import$({}, this$.layoutOpt), ref$.watchResize = false, ref$)
              : {
                root: layoutRoot,
                watchResize: false
              });
          }
        }
        _resizeLock = proxise(function(){
          resizeObserver.add(this$.root, this$);
          return null;
        });
        if (this$.forceInit && !this$.root.offsetParent || window.getComputedStyle(this$.root).display === 'none') {
          return;
        }
        this$._resize = function(){
          return _resizeLock.resolve();
        };
        return _resizeLock();
      }).then(function(){
        return this$._resize = function(){};
      }).then(function(){
        var init, layoutLock;
        init = function(){
          if (this$.mod.init) {
            return this$.mod.init.apply(this$);
          }
        };
        if (!this$.layout) {
          return init();
        }
        layoutLock = proxise(function(){
          Promise.resolve(this$.layout.init(init));
          return null;
        });
        this$._layout = function(){
          return layoutLock.resolve();
        };
        this$.layout.on('render', function(){
          return this$._layout();
        });
        return layoutLock();
      }).then(function(){
        this$._layout = function(){};
        Promise.resolve().then(function(){
          if (!this$.delayRender) {
            return;
          }
          this$.renderLock = proxise(function(){});
          return this$.renderLock();
        }).then(function(){
          this$._resize = function(){
            this$.resize();
            return this$.render();
          };
          this$._layout = function(){
            this$.parse();
            this$.bind();
            this$.resize();
            return this$.render();
          };
          this$.parse();
          this$.bind();
          this$.resize();
          return this$.render();
        });
      });
    },
    parse: function(){
      var this$ = this;
      this.data = this.raw.map(function(r, i){
        var ret, k, v;
        ret = {};
        (function(){
          var ref$, results$ = [];
          for (k in ref$ = this.binding) {
            v = ref$[k];
            results$.push({
              k: k,
              v: v
            });
          }
          return results$;
        }.call(this$)).map(function(arg$){
          var k, v, ref$, ref1$, t;
          k = arg$.k, v = arg$.v;
          if (!v) {
            return;
          }
          ret[k] = ((ref$ = (ref1$ = this$.mod).dimension || (ref1$.dimension = {}))[k] || (ref$[k] = {})).multiple
            ? (v.map
              ? v
              : [v]).map(function(it){
              return r[it.key];
            })
            : r[v.key];
          t = ((ref$ = (ref1$ = this$.mod).dimension || (ref1$.dimension = {}))[k] || (ref$[k] = {})).type;
          if (/[RIT]/.exec(t) && !/[CN]/.exec(t)) {
            return ret[k] = Array.isArray(ret[k])
              ? ret[k].map(function(it){
                return parseFloat(it);
              })
              : parseFloat(ret[k]);
          }
        });
        ret._raw = r;
        ret._idx = i;
        return ret;
      });
      if (this.mod.parse) {
        return this.mod.parse.apply(this);
      }
    },
    bind: function(){
      if (this.mod.bind) {
        return this.mod.bind.apply(this);
      }
    },
    start: function(){
      this._aniloop.run();
      if (this.mod.start) {
        return this.mod.start.apply(this);
      }
    },
    stop: function(){
      this._aniloop.pause();
      if (this.mod.stop) {
        return this.mod.stop.apply(this);
      }
    },
    resize: function(){
      if (this.layout) {
        this.layout.update(false);
      }
      this.box = this.root.getBoundingClientRect();
      if (this.mod.resize) {
        return this.mod.resize.apply(this);
      }
    },
    tick: function(){
      if (this.mod.tick) {
        return this.mod.tick.apply(this);
      }
    },
    render: function(){
      if (this.mod.render) {
        return this.mod.render.apply(this);
      }
    },
    destroy: function(){
      var this$ = this;
      return Promise.resolve().then(function(){
        if (this$._select) {
          this$.root.removeEventListener('click', this$._select);
        }
        if (this$._hover) {
          this$.root.removeEventListener('mouseover', this$._hover);
        }
        resizeObserver['delete'](this$.root);
        if (this$.layout) {
          this$.layout.destroy();
        }
        this$.stop();
        if (this$.mod.destroy) {
          return this$.mod.destroy.apply(this$);
        }
      });
    },
    config: function(opt){
      if (!(opt != null && opt)) {
        return this.cfg;
      }
      return import$(this.cfg, opt);
    },
    setBind: function(n, b){
      this.binding[n] = b;
      this.parse();
      this.bind();
      this.resize();
      return this.render();
    },
    setRaw: function(raw, binding, reinit){
      var ref$;
      reinit == null && (reinit = false);
      if (!Array.isArray(raw)) {
        ref$ = raw, raw = ref$.raw, binding = ref$.binding, reinit = ref$.reinit;
      }
      if (raw != null) {
        this.raw = raw;
      }
      if (binding != null) {
        this.binding = binding;
      }
      if (this.renderLock) {
        this.renderLock.resolve();
        return this.renderLock = null;
      } else {
        if (reinit && this.mod.init) {
          this.mod.init.apply(this);
        }
        this.parse();
        this.bind();
        this.resize();
        return this.render();
      }
    },
    on: function(n, cb){
      var this$ = this;
      return (Array.isArray(n)
        ? n
        : [n]).map(function(n){
        var ref$;
        return ((ref$ = this$.evtHandler)[n] || (ref$[n] = [])).push(cb);
      });
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    filter: function(filters, internal){
      var bs, k, ref$, v, u;
      filters == null && (filters = {});
      internal == null && (internal = false);
      bs = [];
      for (k in ref$ = this.binding) {
        v = ref$[k];
        u = Array.isArray(v)
          ? v
          : [v];
        u = u.map(fn$);
        bs = bs.concat(u);
      }
      for (k in filters) {
        v = filters[k];
        bs.filter(fn1$).map(fn2$);
      }
      if (internal) {
        this.fire('filter', filters);
      }
      if (this.mod.filter) {
        this.mod.filter.apply(this, [filters, internal]);
      }
      this.parse();
      this.bind();
      this.resize();
      return this.render();
      function fn$(v){
        return {
          k: k,
          v: v
        };
      }
      function fn1$(it){
        return it.k === k;
      }
      function fn2$(it){
        return it.v.filter = v;
      }
    },
    sample: function(){
      if (this.mod.sample) {
        return this.mod.sample.apply(this);
      } else {
        return {
          raw: [],
          binding: {}
        };
      }
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = chart;
  } else if (typeof window != 'undefined' && window !== null) {
    window.chart = chart;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
