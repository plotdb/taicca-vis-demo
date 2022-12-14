(function(){
  var svgns, legend;
  svgns = "http://www.w3.org/2000/svg";
  legend = function(opt){
    var x$, nodeLayout, nodeRender, gl, gs, gt, this$ = this;
    opt == null && (opt = {});
    this._data = opt.data || [];
    this.name = opt.name || 'legend';
    this.cfg = opt.cfg || {};
    this.root = typeof opt.root === 'string'
      ? document.querySelector(opt.root)
      : opt.root;
    this.dir = opt.direction || 'vertical';
    this.evtHandler = {};
    this._picked = Object.fromEntries(this._data.map(function(it){
      return [it.key, true];
    }));
    this.layout = opt.layout || new layout({
      root: this.root
    });
    x$ = this.layout;
    x$.on('update', function(){
      return this$.update();
    });
    x$.on('render', function(){
      return this$.render();
    });
    this.id = Math.random().toString(36).substring(2);
    nodeLayout = this.layout.getNode(this.name);
    nodeRender = this.layout.getGroup(this.name);
    if (!nodeLayout.querySelector('[ld-each=legend]')) {
      nodeLayout.innerHTML = "<div class=\"pdlg " + this.dir + "\">\n  <div ld-each=\"legend\">\n    <div class=\"pdl-cell\" ld=\"shape\" data-only></div>\n    <div class=\"pdl-cell\" ld=\"text\" data-only></div>\n  </div>\n</div>";
    }
    if (!nodeRender.querySelector('[ld-each=legend]')) {
      gl = document.createElementNS(svgns, "g");
      gs = document.createElementNS(svgns, "g");
      gt = document.createElementNS(svgns, "g");
      gl.classList.add('pdlg-g');
      gl.setAttribute('ld-each', 'legend');
      gs.setAttribute('ld', 'shape');
      gt.setAttribute('ld', 'text');
      gl.appendChild(gs);
      gl.appendChild(gt);
      nodeRender.appendChild(gl);
    }
    this._func = [
      {
        key: "all",
        type: "func",
        text: "全選"
      }, {
        key: "none",
        type: "func",
        text: "全不選"
      }
    ];
    this.view = {
      layout: new ldview({
        root: this.layout.getNode(this.name),
        initRender: false,
        handler: {
          legend: {
            list: function(){
              return this$._data.concat(this$.cfg.selectable
                ? this$._func
                : []);
            },
            key: function(it){
              return it.key;
            },
            view: {
              handler: {
                shape: function(arg$){
                  var node, ctx;
                  node = arg$.node, ctx = arg$.ctx;
                  return node.setAttribute('data-name', this$._name(ctx, "shape"));
                },
                text: function(arg$){
                  var node, ctx;
                  node = arg$.node, ctx = arg$.ctx;
                  node.setAttribute('data-name', this$._name(ctx, "text"));
                  return node.innerText = ctx.text;
                }
              }
            }
          }
        }
      }),
      render: new ldview({
        root: this.layout.getGroup(this.name),
        initRender: false,
        handler: {
          legend: {
            list: function(){
              return this$._data.concat(this$.cfg.selectable
                ? this$._func
                : []);
            },
            key: function(it){
              return it.key;
            },
            view: {
              action: {
                click: {
                  "@": function(arg$){
                    var node, ctx, k;
                    node = arg$.node, ctx = arg$.ctx;
                    if (!this$.cfg.selectable) {
                      return;
                    }
                    if (ctx.type === 'func') {
                      for (k in this$._picked) {
                        this$._picked[k] = ctx.key === 'all' ? true : false;
                      }
                    } else {
                      this$._picked[ctx.key] = !this$._picked[ctx.key];
                    }
                    this$.view.render.render('legend');
                    return this$.fire('select', this$._picked);
                  }
                }
              },
              handler: {
                "@": function(arg$){
                  var node, ctx;
                  node = arg$.node, ctx = arg$.ctx;
                  return node.style.opacity = !this$.cfg.selectable || ctx.type === 'func' || this$._picked[ctx.key] ? 1 : 0.3;
                },
                "shape": function(arg$){
                  var node, ctx, n, box, rbox;
                  node = arg$.node, ctx = arg$.ctx;
                  if (ctx.type === 'func') {
                    node.style.display = 'none';
                    return;
                  }
                  if (!node.querySelector('circle')) {
                    node.appendChild(document.createElementNS(svgns, 'circle'));
                  }
                  n = node.querySelector('circle');
                  box = this$.layout.getBox(this$._name(ctx, 'shape'));
                  rbox = this$.layout.getBox(this$.name);
                  n.setAttribute('cx', ".5em");
                  n.setAttribute('cy', ".5em");
                  n.setAttribute('r', ".5em");
                  n.setAttribute('transform', "translate(" + (box.x - rbox.x) + ", " + (box.y - rbox.y) + ")");
                  if (typeof opt.shape === 'function') {
                    return opt.shape.call(n, ctx);
                  }
                },
                "text": function(arg$){
                  var node, ctx, n, nbox, rbox, ret;
                  node = arg$.node, ctx = arg$.ctx;
                  n = this$.layout.getNode(this$._name(ctx, 'text'));
                  nbox = this$.layout.getBox(this$._name(ctx, 'text'));
                  rbox = this$.layout.getBox(this$.name);
                  node.setAttribute('transform', "translate(" + (nbox.x - rbox.x) + ", " + (nbox.y - rbox.y) + ")");
                  node.textContent = "";
                  ret = wrapSvgText({
                    node: n,
                    useRange: true
                  });
                  return node.appendChild(ret);
                }
              }
            }
          }
        }
      })
    };
    this.update();
    return this;
  };
  legend.prototype = import$(Object.create(Object.prototype), {
    _name: function(ctx, type){
      type == null && (type = "s");
      return "pdlg-" + type + "-" + this.id + "-" + (ctx.type || '') + "-" + ctx.key;
    },
    enabled: function(){
      return this._data && this._data.length && (!(this.cfg.enabled != null) || this.cfg.enabled);
    },
    update: function(){
      var val, ref$;
      val = this.enabled() ? '' : '0px';
      ref$ = this.layout.getNode('legend').style;
      ref$.width = val;
      ref$.height = val;
      ref$.padding = val;
      ref$.margin = val;
      return this.view.layout.render();
    },
    render: function(){
      var enabled, g;
      enabled = this.enabled();
      g = this.layout.getGroup(this.name);
      g.style.display = enabled ? '' : 'none';
      if (enabled) {
        return this.view.render.render();
      }
    },
    config: function(cfg){
      var node, this$ = this;
      if (!(cfg != null)) {
        return this.cfg;
      }
      if (this.cfg.selectable !== cfg.selectable) {
        this._picked = null;
        this._updatePicked();
      }
      this.cfg = cfg;
      this.dir = this.cfg.position === 'bottom' ? 'horizontal' : 'vertical';
      node = this.layout.getNode(this.name).querySelector('.pdlg');
      return ['horizontal', 'vertical'].map(function(it){
        return node.classList.toggle(it, this$.dir === it);
      });
    },
    _updatePicked: function(){
      var this$ = this;
      if (!(this._picked != null)) {
        this._picked = Object.fromEntries(this._data.map(function(d){
          return [d.key, true];
        }));
      }
      return this._data.map(function(d){
        if (!(this$._picked[d.key] != null)) {
          return this$._picked[d.key] = true;
        }
      });
    },
    data: function(data){
      var hash;
      data == null && (data = []);
      hash = {};
      data.map(function(d, i){
        return hash[d.key] = i;
      });
      this._data = data.filter(function(d, i){
        return hash[d.key] === i;
      });
      this._updatePicked();
      this.update();
      this.layout.update(false);
      return this.view.render.render();
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
    isSelected: function(key){
      return !!this._picked[key];
    }
  });
  if (typeof chart != 'undefined' && chart !== null) {
    (chart.utils || (chart.utils = {})).legend = legend;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
