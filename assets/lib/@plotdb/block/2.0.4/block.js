// Generated by LiveScript 1.6.0
(function(){
  var rescope, sanitize, e404, rid, parseNameString, pubsub, block, slice$ = [].slice;
  rescope = typeof window != 'undefined' && window !== null
    ? window.rescope
    : (typeof module != 'undefined' && module !== null) && (typeof require != 'undefined' && require !== null) ? require("@plotdb/rescope") : null;
  sanitize = function(code){
    return code || '';
  };
  e404 = function(){
    var ref$;
    return Promise.reject((ref$ = new Error(), ref$.name = 'lderror', ref$.id = 404, ref$));
  };
  rid = function(){
    var id;
    for (;;) {
      id = "b-" + Math.random().toString(36).substring(2);
      if (!rid.hash[id]) {
        break;
      }
    }
    rid.hash[id] = true;
    return id;
  };
  rid.hash = {};
  parseNameString = function(n){
    var ref$, v;
    n = n.split('@');
    ref$ = !n[0]
      ? ["@" + n[1], n[2]]
      : [n[0], n[1]], n = ref$[0], v = ref$[1];
    return {
      name: n,
      version: v
    };
  };
  pubsub = function(){
    this.subs = {};
    return this;
  };
  pubsub.prototype = import$(Object.create(Object.prototype), {
    fire: function(name){
      var args, res$, i$, to$, ref$;
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return Promise.all(((ref$ = this.subs)[name] || (ref$[name] = [])).map(function(it){
        return it.apply(null, args);
      }));
    },
    on: function(name, cb){
      var ref$;
      return ((ref$ = this.subs)[name] || (ref$[name] = [])).push(cb);
    }
  });
  block = {};
  block.i18n = {
    module: {
      lng: 'en',
      t: function(v){
        var vs, lng, i$, to$, i, ref$, ns, t, that, ref1$;
        vs = Array.isArray(v)
          ? v
          : [v];
        lng = this.lng;
        for (i$ = 0, to$ = vs.length; i$ < to$; ++i$) {
          i = i$;
          if (!vs[i]) {
            continue;
          }
          ref$ = vs[i].split(':'), ns = ref$[0], t = slice$.call(ref$, 1);
          t = t.join(':');
          if (that = ((ref$ = (ref1$ = this.res)[lng] || (ref1$[lng] = {}))[ns] || (ref$[ns] = {}))[t]) {
            return that;
          }
        }
        return t || ns || v[v.length - 1];
      },
      changeLanguage: function(it){
        return this.lng = it || 'en';
      },
      addResourceBundle: function(lng, ns, res, deep, overwrite){
        var ref$;
        return ((ref$ = this.res)[lng] || (ref$[lng] = {}))[ns] = res;
      },
      res: {}
    },
    use: function(it){
      return this.module = it;
    },
    addResourceBundle: function(lng, id, resource, deep, overwrite){
      deep == null && (deep = true);
      overwrite == null && (overwrite = true);
      return block.i18n.module.addResourceBundle(lng, id, resource, deep, overwrite);
    }
  };
  block.global = {
    csscope: {
      hash: {},
      apply: function(ret){
        var this$ = this;
        ret = ret.filter(function(it){
          return !this$.hash[it.url];
        }).map(function(it){
          return this$.hash[it.url] = it.scope;
        });
        if (ret.length) {
          return document.body.classList.add.apply(document.body.classList, ret);
        }
      }
    }
  };
  block.init = proxise.once(function(){
    return block.rescope.init();
  });
  block.rescope = new rescope({
    global: window
  });
  block.csscope = new csscope.manager();
  block.manager = function(opt){
    var this$ = this;
    opt == null && (opt = {});
    this.hash = {};
    this.proxy = {};
    this.running = {};
    this._chain = opt.chain || null;
    this._fetch = opt.fetch || null;
    this.init = proxise.once(function(){
      return this$._init();
    });
    this.rescope = opt.rescope instanceof rescope
      ? opt.rescope
      : block.rescope;
    this.csscope = opt.csscope instanceof csscope
      ? opt.csscope
      : block.csscope;
    if (opt.registry) {
      this.registry(opt.registry);
    }
    this.init();
    return this;
  };
  block.manager.prototype = import$(Object.create(Object.prototype), {
    _init: function(){
      if (this.rescope === block.rescope) {
        return block.init();
      } else {
        return this.rescope.init();
      }
    },
    chain: function(it){
      return this._chain = it;
    },
    registry: function(it){
      var ref$, lib, block;
      if ((ref$ = typeof it) === 'string' || ref$ === 'function') {
        lib = block = it;
      } else {
        ref$ = it || {}, lib = ref$.lib, block = ref$.block;
      }
      if (lib != null) {
        if (this.rescope === block.rescope) {
          this.rescope = new rescope({
            global: window
          });
        }
        if (this.csscope === block.csscope) {
          this.csscope = new csscope();
        }
        this.rescope.registry(lib);
        this.csscope.registry(lib);
      }
      if (block != null) {
        this._reg = block || '';
        if (typeof this._reg === 'string') {
          if (this._reg && (ref$ = this._reg)[ref$.length - 1] !== '/') {
            return this._reg += '/';
          }
        }
      }
    },
    set: function(opt){
      var opts, this$ = this;
      opt == null && (opt = {});
      opts = Array.isArray(opt)
        ? opt
        : [opt];
      return Promise.all(opts.map(function(obj){
        var name, version, path, b, ref$, ref1$;
        name = obj.name, version = obj.version, path = obj.path;
        b = obj instanceof block['class']
          ? obj
          : obj.block;
        return ((ref$ = (ref1$ = this$.hash)[name] || (ref1$[name] = {}))[version] || (ref$[version] = {}))[path || 'index.html'] = b;
      }));
    },
    getUrl: function(arg$){
      var name, version, path;
      name = arg$.name, version = arg$.version, path = arg$.path;
      if (typeof this._reg === 'function') {
        return this._reg({
          name: name,
          version: version,
          path: path,
          type: 'block'
        });
      } else {
        return (this._reg || '') + "/assets/block/" + name + "/" + version + "/" + (path || 'index.html');
      }
    },
    fetch: function(opt){
      var url;
      if (this._fetch) {
        return Promise.resolve(this._fetch(opt));
      }
      url = this.getUrl({
        name: opt.name,
        version: opt.version,
        path: opt.path
      });
      if (!url) {
        return e404();
      }
      return ld$.fetch(url, {
        method: 'GET'
      }, {
        type: 'text'
      });
    },
    _get: function(opt){
      var ref$, n, v, p, ref1$, this$ = this;
      ref$ = [opt.name, opt.version || 'latest', opt.path || 'index.html'], n = ref$[0], v = ref$[1], p = ref$[2];
      if (!(n && v)) {
        return Promise.reject((ref$ = new Error(), ref$.name = "lderror", ref$.id = 1015, ref$));
      }
      if (((ref$ = (ref1$ = this.hash)[n] || (ref1$[n] = {}))[v] || (ref$[v] = {}))[p] != null && !opt.force) {
        return Promise.resolve(this.hash[n][v][p]);
      }
      if (((ref$ = (ref1$ = this.running)[n] || (ref1$[n] = {}))[v] || (ref$[v] = {}))[p] === true) {
        return;
      }
      this.running[n][v][p] = true;
      return this.fetch({
        name: opt.name,
        version: opt.version,
        path: opt.path
      }).then(function(it){
        if (it) {
          return it;
        } else {
          return e404();
        }
      })['catch'](function(e){
        if (!this$._chain) {
          return Promise.reject(e);
        }
        return this$._chain.get(opt);
      }).then(function(ret){
        var b, obj;
        ret == null && (ret = {});
        b = new block['class']({
          code: ret,
          name: n,
          version: v,
          path: p,
          manager: this$
        });
        this$.set(obj = {
          name: n,
          version: v,
          path: p,
          block: b
        });
        if (ret.version && ret.version !== v) {
          this$.set((obj.version = ret.version, obj));
        }
        return b;
      }).then(function(it){
        this$.proxy[n][v][p].resolve(it);
        return it;
      })['finally'](function(){
        return this$.running[n][v][p] = false;
      })['catch'](function(e){
        this$.proxy[n][v][p].reject(e);
        return Promise.reject(e);
      });
    },
    get: function(opt){
      var opts, this$ = this;
      opt == null && (opt = {});
      opts = Array.isArray(opt)
        ? opt
        : [opt];
      return Promise.all(opts.map(function(opt){
        var ref$, n, v, p, ref1$;
        opt == null && (opt = {});
        if (typeof opt === 'string') {
          opt = parseNameString(opt);
        }
        ref$ = [opt.name, opt.version || 'latest', opt.path || 'index.html'], n = ref$[0], v = ref$[1], p = ref$[2];
        if (!((ref$ = (ref1$ = this$.proxy)[n] || (ref1$[n] = {}))[v] || (ref$[v] = {}))[p]) {
          this$.proxy[n][v][p] = proxise(function(opt){
            return this$._get(opt);
          });
        }
        return this$.proxy[n][v][p](opt);
      })).then(function(it){
        if (Array.isArray(opt)) {
          return it;
        } else {
          return it[0];
        }
      });
    }
  });
  block['class'] = function(opt){
    var code, div, node, this$ = this;
    opt == null && (opt = {});
    this.opt = opt;
    this.scope = "_" + Math.random().toString(36).substring(2);
    this._ctx = {};
    this.csscopes = {
      global: [],
      local: []
    };
    this.name = opt.name;
    this.version = opt.version;
    this.path = opt.path;
    this.manager = opt.manager;
    if (!this.manager) {
      console.log(warn("manager is mandatory when constructing block.class"));
    }
    code = opt.code;
    if (opt.root) {
      code = (typeof opt.root === 'string'
        ? document.querySelector(opt.root)
        : opt.root).innerHTML;
    }
    if (typeof code === 'function') {
      code = code();
    }
    if (typeof code === 'string') {
      this.code = sanitize(code);
      div = document.createElement("div");
      div.innerHTML = this.code;
      if (div.childNodes.length > 1) {
        console.warn("DOM definition of a block should contain only one root.");
      }
      node = div.childNodes[0];
    } else if (typeof code === 'object') {
      this.script = code.script;
      this.style = code.style;
      code = code.dom instanceof Function
        ? code.dom()
        : code.dom;
      this.code = sanitize(code);
      div = document.createElement("div");
      div.innerHTML = this.code;
      if (div.childNodes.length > 1) {
        console.warn("DOM definition of a block should contain only one root.");
      }
      node = div.childNodes[0];
    }
    if (!node) {
      node = document.createElement('div');
    }
    ['script', 'style', 'link'].map(function(n){
      var v;
      v = Array.from(node.querySelectorAll(n)).map(function(it){
        it.parentNode.removeChild(it);
        return it.textContent;
      }).join('\n');
      return this$[n] = v != null && v
        ? v
        : this$[n] || "";
    });
    this.node = node;
    this.init = proxise.once(function(){
      return this$._init();
    });
    return this;
  };
  block['class'].prototype = import$(Object.create(Object.prototype), {
    _init: function(){
      var this$ = this;
      return block.init().then(function(){
        var v, ref$, ret;
        this$['interface'] = this$.script instanceof Function
          ? this$.script()
          : typeof this$.script === 'object'
            ? this$.script
            : (v = eval(this$.script || '')) instanceof Function
              ? v()
              : v || {};
        if (!this$['interface']) {
          this$['interface'] = {};
        }
        (ref$ = this$['interface']).pkg || (ref$.pkg = {});
        if (!this$.name) {
          this$.name = this$['interface'].pkg.name;
        }
        if (!this$.version) {
          this$.version = this$['interface'].pkg.version;
        }
        if (!this$.path) {
          this$.path = this$['interface'].pkg.path;
        }
        this$.id = (this$.name || rid()) + "@" + (this$.version || rid()) + "/" + (this$.path || 'index.html');
        document.body.appendChild(this$.styleNode = document.createElement("style"));
        this$.styleNode.setAttribute('type', 'text/css');
        this$.styleNode.textContent = ret = csscope({
          scope: "*[scope~=" + this$.scope + "]",
          css: this$.style,
          scopeTest: "[scope]"
        });
        this$.factory = function(){
          var args, res$, i$, to$;
          res$ = [];
          for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
            res$.push(arguments[i$]);
          }
          args = res$;
          return this;
        };
        return this$.factory.prototype = import$((ref$ = Object.create(Object.prototype), ref$.init = function(){}, ref$.destroy = function(){}, ref$), this$['interface']);
      }).then(function(){
        this$['extends'] = [];
        if (!this$['interface'].pkg.extend) {
          return;
        }
        if (!this$.manager) {
          return new Error("no available manager to get extended block");
        }
        return this$.manager.get(this$['interface'].pkg.extend).then(function(it){
          this$.extend = it;
          this$.extendDom = !(this$['interface'].pkg.extend.dom != null) || this$['interface'].pkg.extend.dom;
          this$.extendStyle = !(this$['interface'].pkg.extend.style != null) || this$['interface'].pkg.extend.style;
          return this$.extend.init();
        }).then(function(){
          return this$['extends'] = [this$.extend].concat(this$.extend['extends']);
        });
      }).then(function(){
        var i18n, lng, res, results$ = [];
        i18n = this$['interface'].pkg.i18n || {};
        for (lng in i18n) {
          res = i18n[lng];
          results$.push(block.i18n.module.addResourceBundle(lng, this$.id, res, true, true));
        }
        return results$;
      }).then(function(){
        var k, v;
        this$.dependencies = Array.isArray(this$['interface'].pkg.dependencies)
          ? this$['interface'].pkg.dependencies
          : (function(){
            var ref$, results$ = [];
            for (k in ref$ = this['interface'].pkg.dependencies || {}) {
              v = ref$[k];
              results$.push(v);
            }
            return results$;
          }.call(this$));
        this$.dependencies.map(function(it){
          if (it.type) {
            return;
          }
          if (/\.js$/.exec(it.url || it.path || it)) {
            return it.type = 'js';
          } else if (/\.css$/.exec(it.url || it.path || it)) {
            return it.type = 'css';
          } else {
            return it.type = 'js';
          }
        });
        if (this$.extend) {
          this$._ctx = this$.extend.context();
        }
        return this$.manager.rescope.load(this$.dependencies.filter(function(it){
          return !it.type || it.type === 'js';
        }), this$._ctx);
      }).then(function(){
        return this$.manager.csscope.load(this$.dependencies.filter(function(it){
          return it.type === 'css' && it.global === true;
        }).map(function(it){
          return it.url || it;
        }));
      }).then(function(it){
        this$.csscopes.global = it || [];
        return this$.manager.csscope.load(this$.dependencies.filter(function(it){
          return it.type === 'css' && it.global !== true;
        }).map(function(it){
          return it.url || it;
        }));
      }).then(function(it){
        var ref$;
        this$.csscopes.local = it || [];
        if (!this$.extend) {
          return;
        }
        (ref$ = this$.csscopes).global = ref$.global.concat(this$.extend.csscopes.global || []);
        if (this$.extendStyle === true) {
          return (ref$ = this$.csscopes).local = ref$.local.concat(this$.extend.csscopes.local || []);
        } else if (this$.extendDom === 'overwrite') {
          return (ref$ = this$.csscopes).local = ref$.local.concat(this$.extend.csscopes.local.slice(1));
        }
      })['catch'](function(e){
        var node;
        console.error("[@plotdb/block] init block {name: " + this$.name + ", version: " + this$.version + ", path: " + (this$.path || '') + "}", e);
        node = document.createElement("div");
        node.innerText = "failed";
        return this$['interface'] = {}, this$.styleNode = {}, this$.factory = function(){
          return this;
        }, this$.dependencies = [], this$;
      });
    },
    context: function(){
      return this._ctx;
    },
    dom: function(){
      return this.node;
    },
    i18n: function(t){
      var id;
      id = this.id;
      return block.i18n.module.t([id + ":" + t].concat(this['extends'].map(function(it){
        return it.id + ":" + t;
      }), [t]));
    },
    create: function(opt){
      var this$ = this;
      opt == null && (opt = {});
      return this.init().then(function(){
        var ret;
        ret = new block.instance({
          block: this$,
          name: this$.name,
          version: this$.version,
          data: opt.data
        });
        return ret.init().then(function(){
          return ret;
        });
      });
    },
    resolvePlugAndCloneNode: function(child, byPass){
      var node;
      byPass == null && (byPass = false);
      if (!byPass) {
        node = this.dom().cloneNode(true);
        if (child) {
          Array.from(node.querySelectorAll('plug')).map(function(it){
            var name, n;
            name = it.getAttribute('name');
            n = child.querySelector(":scope :not([plug]) [plug=" + name + "], :scope > [plug=" + name + "]");
            if (n) {
              return it.replaceWith(n);
            }
          });
        }
      } else {
        node = child;
      }
      return this.extend && this.extendDom !== false ? this.extendDom === 'overwrite'
        ? this.extend.resolvePlugAndCloneNode(node, true)
        : this.extend.resolvePlugAndCloneNode(node) : node;
    }
  });
  block.instance = function(opt){
    var this$ = this;
    opt == null && (opt = {});
    this.name = opt.name;
    this.version = opt.version;
    this.block = opt.block;
    this.data = opt.data;
    this.init = proxise.once(function(){
      return this$._init();
    });
    return this;
  };
  block.instance.prototype = import$(Object.create(Object.prototype), {
    _init: function(){
      return this.block.init();
    },
    attach: function(opt){
      var root, node, exts, s, i$, to$, i, es;
      opt == null && (opt = {});
      if (opt.data) {
        this.data = opt.data;
      }
      root = opt.root;
      root = !root
        ? null
        : typeof root === 'string' ? document.querySelector(root) : root;
      block.global.csscope.apply(this.block.csscopes.global);
      if (!root) {
        node = null;
      } else {
        node = this.dom();
        exts = [this.block].concat(this.block['extends']);
        s = [this.block.scope];
        for (i$ = 0, to$ = exts.length - 1; i$ < to$; ++i$) {
          i = i$;
          es = exts[i].extendStyle;
          if (es === 'overwrite') {
            continue;
          } else if (es === false) {
            break;
          }
          s.push(exts[i + 1].scope);
        }
        node.setAttribute('scope', s.join(' '));
        node.classList.add.apply(node.classList, this.block.csscopes.local.map(function(it){
          return it.scope;
        }).concat(this.block.csscopes.global.map(function(it){
          return it.scope;
        })));
        if (opt.before) {
          root.insertBefore(node, opt.before);
        }
        root.appendChild(node);
      }
      return this.run({
        node: node,
        type: 'init'
      });
    },
    detach: function(){
      var node;
      node = this.dom();
      node.parentNode.removeChild(node);
      return this.run({
        node: node,
        type: 'destroy'
      });
    },
    'interface': function(){
      var i$, i, ret;
      for (i$ = this.obj.length; i$ >= 0; --i$) {
        i = i$;
        if (!(ret = (this.obj[i] || {})['interface'])) {
          continue;
        }
        return ret instanceof Function ? ret.apply(this.obj[i]) : ret;
      }
      return null;
    },
    update: function(ops){
      return this.datadom.update(ops);
    },
    _transform: function(node){
      var this$ = this;
      Array.from(node.querySelectorAll('[t]')).map(function(n){
        var v;
        if (!(v = n.getAttribute('t'))) {
          return;
        }
        v = this$.i18n(v);
        if (n.hasAttribute('t-attr')) {
          return n.setAttribute(n.getAttribute('t-attr'), v);
        } else {
          return n.textContent = v;
        }
      });
      return node;
    },
    dom: function(){
      var that;
      if (that = this.node) {
        return that;
      }
      this.node = this.block.resolvePlugAndCloneNode();
      return this._transform(this.node);
    },
    i18n: function(it){
      return this.block.i18n(it);
    },
    run: function(arg$){
      var node, type, cs, ps, c, this$ = this;
      node = arg$.node, type = arg$.type;
      cs = [];
      ps = [];
      c = this.block;
      if (!this.obj) {
        this.obj = [];
      }
      if (!this.pubsub) {
        this.pubsub = new pubsub();
      }
      while (c) {
        cs = [c].concat(cs);
        c = c.extend;
      }
      return new Promise(function(res, rej){
        var _;
        _ = function(list, idx, gtx, parent){
          var p, b, ref$;
          list == null && (list = []);
          idx == null && (idx = 0);
          gtx == null && (gtx = {});
          if (list.length <= idx) {
            p = Promise.all(ps).then(function(it){
              return res(it);
            })['catch'](function(it){
              return rej(it);
            });
            return p;
          }
          b = list[idx];
          return this$.block.manager.rescope.context((ref$ = b._ctx).local || (ref$.local = {}), function(ctx){
            var payload, o;
            import$(gtx, ctx);
            payload = {
              root: node,
              parent: parent,
              ctx: gtx,
              context: gtx,
              pubsub: this$.pubsub,
              i18n: {
                addResourceBundles: function(resources){
                  var lng, res, results$ = [];
                  resources == null && (resources = {});
                  for (lng in resources) {
                    res = resources[lng];
                    results$.push(block.i18n.addResourceBundle(lng, this$.block.id, res));
                  }
                  return results$;
                },
                t: function(it){
                  return this$.block.i18n(it);
                }
              },
              t: function(it){
                return this$.block.i18n(it);
              },
              data: this$.data
            };
            if (type === 'init') {
              this$.obj.push(o = new b.factory(payload));
            }
            ps.push((o = this$.obj[idx]) ? this$.obj[idx][type](payload) : null);
            return _(list, idx + 1, gtx, o);
          });
        };
        return _(cs, 0, {});
      });
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = block;
  }
  if (typeof window != 'undefined' && window !== null) {
    window.block = block;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
