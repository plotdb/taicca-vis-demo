(function(){
  var ceNS, axis;
  ceNS = function(it){
    return document.createElementNS("http://www.w3.org/2000/svg", it);
  };
  axis = function(opt){
    var n, x$, y$, this$ = this;
    opt == null && (opt = {});
    this.dir = {
      "bottom": 0,
      "left": 2
    }[opt.direction || 'bottom'];
    this.name = opt.name || 'axis';
    this.layout = opt.layout || new layout({
      root: this.root
    });
    this._ticks = [];
    this._scale = opt.scale || function(it){
      return it;
    };
    this._format = opt.format || (typeof chart != 'undefined' && chart !== null
      ? chart.utils.format.simple
      : function(it){
        return it;
      });
    this.cfg = import$({
      tickSize: 8
    }, opt.cfg);
    this._map = {};
    this._n = n = {
      root: ceNS('g'),
      layout: this.layout.getNode(this.name),
      render: this.layout.getGroup(this.name),
      wrap: null,
      domain: ceNS('path')
    };
    n.render.appendChild(n.root);
    n.root.appendChild(n.domain);
    n.label = ceNS('text');
    n.label.textContent = '';
    x$ = n.label;
    x$.setAttribute('dominant-baseline', 'hanging');
    x$.setAttribute('text-anchor', 'middle');
    n.root.appendChild(n.label);
    this.wrapper();
    y$ = this.layout;
    y$.on('update', function(){
      return this$.update();
    });
    y$.on('render', function(){
      return this$.render();
    });
    return this;
  };
  axis.prototype = import$(Object.create(Object.prototype), {
    wrapper: function(){
      var n, ref$;
      n = this._n;
      if (n.wrap && n.wrap.parentNode) {
        n.wrap.parentNode.removeChild(n.wrap);
      }
      n.wrap = document.createElement('div');
      import$((ref$ = n.wrap.style, ref$.visibility = 'hidden', ref$.position = 'absolute', ref$.top = 0, ref$.left = 0, ref$.pointerEvents = 'none', ref$.userSelect = 'none', ref$.zIndex = 0, ref$.wordBreak = "break-all", ref$.lineHeight = '.95em', ref$), this.dir < 2 && this.cfg.textWidth != null
        ? {
          whiteSpace: 'wrap',
          width: ((ref$ = this.cfg.textWidth) > 1 ? ref$ : 1) + "em"
        }
        : {
          whiteSpace: 'pre',
          width: '4em'
        });
      return n.layout.appendChild(n.wrap);
    },
    config: function(it){
      if (!(it != null)) {
        return this.cfg;
      }
      import$(this.cfg, it);
      if (this.cfg.format) {
        this.format(this.cfg.format);
      }
      return this.wrapper();
    },
    format: function(it){
      if (it != null) {
        return this._format = it;
      } else {
        return this._format;
      }
    },
    scale: function(it){
      if (it != null) {
        return this._scale = it;
      } else {
        return this._scale;
      }
    },
    caption: function(it){
      if (this.cfg.showCaption != null && !this.cfg.showCaption) {
        return this._n.label.textContent = '';
      } else {
        return this._n.label.textContent = it;
      }
    },
    update: function(){},
    ticks: function(ticks){
      /* (v)alue -> (c)oordinate -> (t)ext -> (n)odes: { g(group), p(path), t(text) } */
      var map, size, count, itr, ref$, k, v, this$ = this;
      map = {};
      size = this._n.layout.getBoundingClientRect()[this.dir < 2 ? 'width' : 'height'];
      count = Math.round(size / 25);
      itr = (ref$ = Math.round(ticks.length / (count > 1 ? count : 1))) > 1 ? ref$ : 1;
      this._ticks = ticks.filter(function(d, i){
        return !(i % itr) || i === ticks.length - 1;
      }).map(function(o){
        var ref$, key$;
        if (typeof o !== 'object') {
          o = {
            v: o
          };
        }
        return map[o.v] = import$((ref$ = this$._map)[key$ = o.v] || (ref$[key$] = {}), o);
      });
      for (k in ref$ = this._map) {
        v = ref$[k];
        if (!map[k]) {
          v.n.g.parentNode.removeChild(v.n.g);
        }
      }
      this._map = map;
      return this._ticks.filter(function(o){
        return !o.n;
      }).map(function(o){
        o.n = {
          g: ceNS('g'),
          p: ceNS('path'),
          t: ceNS('g')
        };
        o.n.g.appendChild(o.n.p);
        o.n.g.appendChild(o.n.t);
        this$._n.root.appendChild(o.n.g);
        if (isNaN(+o.v)) {
          return o.t = o.v;
        }
      });
    },
    render: function(){
      var n, isHorizon, wrap, ticks, ref$, fontSize, box, this$ = this;
      n = this._n;
      isHorizon = this.dir < 2;
      wrap = n.wrap;
      ticks = this._ticks;
      if (this.cfg.enabled != null && !this.cfg.enabled) {
        if (isHorizon) {
          ref$ = n.layout.style;
          ref$.height = "0px";
          ref$.paddingTop = "0";
          ref$.paddingBottom = "0";
        } else {
          ref$ = n.layout.style;
          ref$.width = "0px";
          ref$.paddingLeft = "0";
          ref$.paddingRight = "0";
        }
        n.domain.style.display = 'none';
        ticks.map(function(o){
          return o.n.g.style.display = 'none';
        });
        return;
      } else {
        if (isHorizon) {
          ref$ = n.layout.style;
          ref$.height = "";
          ref$.paddingTop = "";
          ref$.paddingBottom = "";
        } else {
          ref$ = n.layout.style;
          ref$.width = "";
          ref$.paddingLeft = "";
          ref$.paddingRight = "";
        }
        n.domain.style.display = '';
        ticks.map(function(o){
          return o.n.g.style.display = '';
        });
      }
      fontSize = getComputedStyle(wrap).fontSize;
      box = n.layout.getBoundingClientRect();
      ref$ = n.domain.style;
      ref$.strokeWidth = 1;
      ref$.stroke = 'currentColor';
      ref$.fill = 'none';
      ticks.map(function(o, idx){
        var pos, ref$;
        pos = !idx
          ? 0
          : idx === ticks.length - 1 ? 2 : 1;
        o._c = o.c != null
          ? o.c
          : this$._scale(o.v) + (this$._scale.bandwidth ? this$._scale.bandwidth() / 2 : 0);
        o._t = o.t != null
          ? o.t
          : this$._format(o.v);
        ref$ = o.n.p.style;
        ref$.strokeWidth = 1;
        ref$.stroke = 'currentColor';
        ref$.fill = 'none';
        wrap.textContent = o._t;
        wrap.style.textAlign = isHorizon
          ? ['left', 'center', 'right'][pos]
          : ['right', 'left'][this$.dir - 2];
        o.n.tt = wrapSvgText({
          node: wrap
        });
        o.n.t.style.fontSize = fontSize;
        o.n.t.textContent = '';
        return o.n.t.appendChild(o.n.tt);
      });
      ticks.sort(function(a, b){
        return a._c - b._c;
      });
      if (isHorizon) {
        n.domain.setAttribute('d', "M0 0L" + box.width + " 0Z");
        n.label.setAttribute('x', box.width / 2);
      } else {
        n.domain.setAttribute('d', "M0 0L0 " + box.height + "Z");
        n.label.setAttribute("transform", "translate(0," + box.height / 2 + ") rotate(90)");
      }
      ticks.map(function(o){
        return o.box = o.n.t.getBBox();
      });
      return this.adjust();
    },
    adjust: function(){
      var ticks, isHorizon, insert, bfs, this$ = this;
      ticks = this._ticks;
      isHorizon = this.dir < 2;
      insert = function(idx, lv, lc){
        var tick, pos, ref$, coord, text, box, offset, doOffset, r, m, ip1, ip2, op1, op2, overlap;
        if (lc.checked[idx]) {
          return;
        } else {
          lc.checked[idx] = true;
        }
        tick = ticks[idx];
        pos = !idx
          ? 0
          : idx === ticks.length - 1 ? 2 : 1;
        ref$ = [tick._c, tick._t], coord = ref$[0], text = ref$[1];
        box = tick.box;
        offset = {
          x: -box.x,
          y: -box.y
        };
        doOffset = this$._scale.bandwidth
          ? false
          : this$.cfg.boundaryTickOffset != null
            ? !!this$.cfg.boundaryTickOffset
            : this$.dir < 2 ? true : false;
        r = doOffset
          ? pos / 2
          : 1 / 2;
        if (isHorizon) {
          offset.x -= box.width * r;
        } else {
          offset.y -= box.height * r;
        }
        tick.n.tt.setAttribute('transform', "translate(" + offset.x + "," + offset.y + ")");
        box = {
          size: box[isHorizon ? 'width' : 'height'],
          sizeAlt: box[isHorizon ? 'height' : 'width'],
          lv: lv,
          tick: tick,
          idx: idx
        };
        box.coord = coord - box.size * r;
        if (isHorizon) {
          tick.n.g.setAttribute('transform', "translate(" + coord + ",0)");
          tick.n.p.setAttribute('d', "M0 0L0 " + this$.cfg.tickSize);
          tick.n.t.setAttribute('transform', "translate(0," + this$.cfg.tickSize + ")");
        } else {
          tick.n.g.setAttribute('transform', "translate(0," + coord + ")");
          tick.n.p.setAttribute('d', "M0 0L-" + this$.cfg.tickSize + " 0");
          tick.n.t.setAttribute('transform', "translate(" + (-this$.cfg.tickSize - box.sizeAlt - 1) + ",0)");
        }
        m = 2;
        ref$ = [box.coord, box.coord + box.size], ip1 = ref$[0], ip2 = ref$[1];
        ref$ = [ip1 - m, ip2 + m], op1 = ref$[0], op2 = ref$[1];
        overlap = lc.picked.filter(function(b){
          var ref$, iq1, iq2, oq1, oq2;
          ref$ = [b.coord, b.coord + b.size], iq1 = ref$[0], iq2 = ref$[1];
          ref$ = [iq1 - m, iq2 + m], oq1 = ref$[0], oq2 = ref$[1];
          return (ip1 > oq1 && ip1 < oq2) || (iq1 > op1 && iq1 < op2);
        }).length;
        tick.n.t.style.opacity = overlap ? 0 : 1;
        lc.picked.push(box);
        return !overlap;
      };
      bfs = function(maxlv){
        var ref$, lc, fifo, L, R, D, M, size, box;
        maxlv == null && (maxlv = 1);
        ref$ = [
          {
            checked: {},
            picked: [],
            node: this$._n.wrap
          }, []
        ], lc = ref$[0], fifo = ref$[1];
        lc.fontSize = getComputedStyle(lc.node).fontSize;
        ticks.map(function(it){
          return it.n.t.style.opacity = 0;
        });
        if (ticks.length) {
          fifo.push([0, ticks.length - 1, 0]);
          [0, ticks.length - 1].map(function(it){
            return insert(it, 0, lc);
          });
        }
        while (fifo.length) {
          ref$ = fifo.splice(0, 1)[0], L = ref$[0], R = ref$[1], D = ref$[2];
          if (D >= maxlv) {
            continue;
          }
          M = Math.floor((L + R) / 2);
          insert(M, D, lc);
          if (M > L + 1) {
            fifo.push([L, M, D + 1]);
          }
          if (R > M + 1) {
            fifo.push([M, R, D + 1]);
          }
        }
        /* align lv
        lc.picked.map -> if it.lv >= maxlv => it.tick.n.t.style.opacity = 0
        lc.picked = lc.picked.filter -> it.lv < maxlv
        */
        size = Math.max.apply(Math, [0].concat(lc.picked.map(function(it){
          return it.sizeAlt;
        })));
        if (this$.dir < 2) {
          this$._n.label.setAttribute('y', size + this$.cfg.tickSize);
          return this$._n.layout.style.height = (size + this$.cfg.tickSize + this$._n.label.getBoundingClientRect().height) + "px";
        } else {
          this$._n.label.setAttribute('x', 0);
          this$._n.label.setAttribute('y', 0);
          this$._n.layout.style.width = (size + this$.cfg.tickSize + this$._n.label.getBoundingClientRect().width) + "px";
          box = this$._n.layout.getBoundingClientRect();
          this$._n.label.setAttribute('transform', "translate(" + (-(size + this$.cfg.tickSize)) + "," + box.height / 2 + ") rotate(90)");
          return this$._n.root.setAttribute('transform', "translate(" + box.width + ",0)");
        }
      };
      return bfs(5);
    }
  });
  if (typeof chart != 'undefined' && chart !== null) {
    (chart.utils || (chart.utils = {})).axis = axis;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
