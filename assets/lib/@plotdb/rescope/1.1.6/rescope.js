(function(){
  var rescope, winProps;
  rescope = function(opt){
    opt == null && (opt = {});
    this.opt = import$({
      inFrame: false
    }, opt);
    this.inFrame = !!this.opt.inFrame;
    this.global = opt.global || (typeof global != 'undefined' && global !== null ? global : window);
    this.scope = {};
    return this;
  };
  rescope.func = [];
  /*
  
  window members. adopted from:
   - DOM: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
   - Properties: https://developer.mozilla.org/en-US/docs/Web/API/Window
  
  used for list all un-enumerable attributes in window object.
  
  */
  winProps = {
    attr: ['applicationCache', 'caches', 'closed', 'console', 'controllers', 'crossOriginIsolated', 'crypto', 'customElements', 'defaultStatus', 'devicePixelRatio', 'dialogArguments', 'directories', 'document', 'event', 'frameElement', 'frames', 'fullScreen', 'history', 'indexedDB', 'innerHeight', 'innerWidth', 'isSecureContext', 'isSecureContext', 'length', 'localStorage', 'location', 'locationbar', 'menubar', 'mozAnimationStartTime', 'mozInnerScreenX', 'mozInnerScreenY', 'mozPaintCount', 'name', 'navigator', 'onabort', 'onafterprint', 'onanimationcancel', 'onanimationend', 'onanimationiteration', 'onappinstalled', 'onauxclick', 'onbeforeinstallprompt', 'onbeforeprint', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondragdrop', 'ondurationchange', 'onended', 'onerror', 'onfocus', 'onformdata', 'ongamepadconnected', 'ongamepaddisconnected', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadend', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmessageerror', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmozbeforepaint', 'onpaint', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstorage', 'onsubmit', 'ontouchcancel', 'ontouchstart', 'ontransitioncancel', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvrdisplayactivate', 'onvrdisplayblur', 'onvrdisplayconnect', 'onvrdisplaydeactivate', 'onvrdisplaydisconnect', 'onvrdisplayfocus', 'onvrdisplaypointerrestricted', 'onvrdisplaypointerunrestricted', 'onvrdisplaypresentchange', 'onwheel', 'opener', 'origin', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'performance', 'personalbar', 'pkcs11', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scrollbars', 'scrollMaxX', 'scrollMaxY', 'scrollX', 'scrollY', 'self', 'sessionStorage', 'sidebar', 'speechSynthesis', 'status', 'statusbar', 'toolbar', 'top', 'visualViewport', 'window', 'Methods', 'alert', 'atob', 'back', 'blur', 'btoa', 'cancelAnimationFrame', 'cancelIdleCallback', 'captureEvents', 'clearImmediate', 'clearInterval', 'clearTimeout', 'close', 'confirm', 'convertPointFromNodeToPage', 'convertPointFromPageToNode', 'createImageBitmap', 'dump', 'fetch', 'find', 'focus', 'forward', 'getComputedStyle', 'getDefaultComputedStyle', 'getSelection', 'home', 'matchMedia', 'minimize', 'moveBy', 'moveTo', 'open', 'openDialog', 'postMessage', 'print', 'prompt', 'queueMicrotask', 'releaseEvents', 'requestAnimationFrame', 'requestFileSystem', 'requestIdleCallback', 'resizeBy', 'resizeTo', 'routeEvent', 'scroll', 'scrollBy', 'scrollByLines', 'scrollByPages', 'scrollTo', 'setCursor', 'setImmediate', 'setInterval', 'setTimeout', 'showDirectoryPicker', 'showModalDialog', 'showOpenFilePicker', 'showSaveFilePicker', 'sizeToContent', 'stop', 'updateCommands', 'Events', 'event', 'afterprint', 'animationcancel', 'animationend', 'animationiteration', 'beforeprint', 'beforeunload', 'blur', 'copy', 'cut', 'DOMContentLoaded', 'error', 'focus', 'hashchange', 'languagechange', 'load', 'message', 'messageerror', 'offline', 'online', 'orientationchange', 'pagehide', 'pageshow', 'paste', 'popstate', 'rejectionhandled', 'storage', 'transitioncancel', 'unhandledrejection', 'unload', 'vrdisplayconnect', 'vrdisplaydisconnect', 'vrdisplaypresentchange'],
    dom: ['Attr', 'CDATASection', 'CharacterData', 'ChildNode', 'Comment', 'CustomEvent', 'Document', 'DocumentFragment', 'DocumentType', 'DOMError', 'DOMException', 'DOMImplementation', 'DOMString', 'DOMTimeStamp', 'DOMStringList', 'DOMTokenList', 'Element', 'Event', 'EventTarget', 'HTMLCollection', 'MutationObserver', 'MutationRecord', 'NamedNodeMap', 'Node', 'NodeFilter', 'NodeIterator', 'NodeList', 'ProcessingInstruction', 'Selection', 'Range', 'Text', 'TextDecoder', 'TextEncoder', 'TimeRanges', 'TreeWalker', 'URL', 'Window', 'Worker', 'XMLDocument']
  };
  rescope.prototype = import$(Object.create(Object.prototype), {
    peekScope: function(){
      console.log("in delegate iframe: " + !!this.global._rescopeDelegate);
      return this.global._rescopeDelegate;
    },
    init: function(){
      var this$ = this;
      if (this.inFrame) {
        return Promise.resolve();
      }
      return new Promise(function(res, rej){
        var node, code;
        node = document.createElement('iframe');
        node.setAttribute('name', "delegator-" + Math.random().toString(36).substring(2));
        node.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        import$(node.style, {
          opacity: 0,
          zIndex: -1,
          pointerEvents: 'none',
          top: "0px",
          left: "0px",
          width: '0px',
          height: '0px',
          position: 'absolute'
        });
        code = "<html><body>\n<script>\nfunction init() {\n  if(!window._scope) { window._scope = new rescope({inFrame:true,global:window}) }\n}\nfunction load(url,ctx) { return _scope.load(url,ctx); }\nfunction context(url,func) { _scope.context(url,func,true); }\n</script></body></html>";
        node.onerror = function(it){
          return rej(it);
        };
        node.onload = function(){
          var ref$, k;
          ref$ = this$.iframe = node.contentWindow;
          ref$.rescope = rescope;
          ref$._rescopeDelegate = true;
          this$.iframe.init();
          this$.frameScope = this$.iframe._scope.scope;
          winProps.all = Array.from(new Set((function(){
            var results$ = [];
            for (k in this.iframe) {
              results$.push(k);
            }
            return results$;
          }.call(this$)).concat(winProps.dom, winProps.attr)));
          return res();
        };
        node.src = URL.createObjectURL(new Blob([code], {
          type: 'text/html'
        }));
        return document.body.appendChild(node);
      });
    },
    context: function(des, func, untilResolved){
      untilResolved == null && (untilResolved = false);
      if (typeof des === 'string' || Array.isArray(des)) {
        return this.ctxFromUrl(des, func, untilResolved);
      } else {
        return this.ctxFromObj(des, func, untilResolved);
      }
    },
    ctxFromObj: function(context, func, untilResolved){
      var stack, k, ret, p, this$ = this;
      context == null && (context = {});
      untilResolved == null && (untilResolved = false);
      stack = {};
      for (k in context) {
        stack[k] = this.global[k];
        this.global[k] = context[k];
      }
      ret = func(context);
      p = untilResolved && ret && ret.then
        ? ret
        : Promise.resolve();
      return p.then(function(){
        var k, results$ = [];
        for (k in stack) {
          results$.push(this$.global[k] = stack[k]);
        }
        return results$;
      });
    },
    ctxFromUrl: function(url, func, untilResolved){
      var stacks, scopes, context, i$, to$, i, ref$, stack, scope, k, ret, p, this$ = this;
      untilResolved == null && (untilResolved = false);
      url = Array.isArray(url)
        ? url
        : [url];
      stacks = [];
      scopes = [];
      context = {};
      for (i$ = 0, to$ = url.length; i$ < to$; ++i$) {
        i = i$;
        ref$ = [{}, this.scope[url[i].url || url[i]] || {}], stack = ref$[0], scope = ref$[1];
        for (k in scope) {
          stack[k] = this.global[k];
          this.global[k] = scope[k];
          context[k] = scope[k];
        }
        stacks.push(stack);
        scopes.push(scope);
      }
      ret = func(context);
      p = untilResolved && ret && ret.then
        ? ret
        : Promise.resolve();
      return p.then(function(){
        var i$, i, lresult$, scope, stack, k, results$ = [];
        for (i$ = scopes.length - 1; i$ >= 0; --i$) {
          i = i$;
          lresult$ = [];
          scope = scopes[i];
          stack = stacks[i];
          for (k in scope) {
            lresult$.push(this$.global[k] = stack[k]);
          }
          results$.push(lresult$);
        }
        return results$;
      });
    },
    load: function(url, ctx){
      var _, this$ = this;
      ctx == null && (ctx = {});
      if (!url) {
        return Promise.resolve();
      }
      ctx.local || (ctx.local = {});
      ctx.frame || (ctx.frame = {});
      url = Array.isArray(url)
        ? url
        : [url];
      _ = function(){
        return Promise.resolve().then(function(){
          if (!this$.inFrame) {
            return this$.iframe.load(url, ctx);
          }
        }).then(function(){
          var _;
          _ = function(list, idx, ctx){
            var items, i$, to$, i;
            idx == null && (idx = 0);
            if (idx >= list.length) {
              return Promise.resolve(ctx);
            }
            items = [];
            for (i$ = idx, to$ = list.length; i$ < to$; ++i$) {
              i = i$;
              items.push(list[i]);
              if (list[i].async != null && !list[i].async) {
                break;
              }
            }
            if (!items.length) {
              return Promise.resolve(ctx);
            }
            return Promise.all(items.map(function(it){
              var url;
              url = it.url || it;
              return this$._load(url, ctx, (this$.frameScope || (this$.frameScope = {}))[url]);
            })).then(function(){
              return this$.context(items.map(function(it){
                return it.url || it;
              }), function(c){
                import$(ctx[this$.inFrame ? 'frame' : 'local'], c);
                return _(list, idx + items.length, ctx);
              }, true);
            });
          };
          return _(url, 0, ctx);
        }).then(function(){});
      };
      if (!ctx) {
        return _();
      }
      return new Promise(function(res, rej){
        return this$.context(ctx[this$.inFrame ? 'frame' : 'local'], function(){
          return _().then(function(it){
            return res(it);
          })['catch'](function(it){
            return rej(it);
          });
        }, true);
      });
    },
    _wrapperAlt: function(url, code, context, prescope){
      var this$ = this;
      context == null && (context = {});
      prescope == null && (prescope = {});
      return new Promise(function(res, rej){
        var _code, k, v, _postcode, _forceScope, id, script, hash, ref$;
        _code = (function(){
          var ref$, results$ = [];
          for (k in ref$ = context) {
            v = ref$[k];
            results$.push("var " + k + " = context." + k + ";this." + k + " = context." + k + ";");
          }
          return results$;
        }()).join('\n') + '\n';
        _postcode = (function(){
          var ref$, results$ = [];
          for (k in ref$ = prescope) {
            v = ref$[k];
            results$.push("if(typeof(" + k + ") != 'undefined') { this." + k + " = " + k + "; }");
          }
          return results$;
        }()).join('\n') + '\n';
        _forceScope = "/* intercept these variables so lib will inject anything into our scope */\nvar global = this;\nvar globalThis = this;\nvar self = this;\nvar window = this;\n/* yet we need window memebers so lib can work properly with builtin features */\nwindow.__proto__ = win;\n/* some props are not enumerable, so we list all of them directly in winProps.all */\nfor(var i = 0; i < winProps.all.length; i++) {\n  k = winProps.all[i];\n  /* but functions need window as `this` to be called. we indirectly do this for them. */\n  if(typeof(win[k]) == \"function\") {\n    track.push(k);\n    window[k] = (function(k){ return function() { return win[k].apply(win,arguments);} })(k);\n  } else {\n    /* and some members are from getter/setter. we proxy it via custom getter / setter object. */\n    desc = Object.getOwnPropertyDescriptor(win,k);\n    if(desc && desc.get) {\n      track.push(k);\n      Object.defineProperty(window, k, (function(n,desc) {\n        var ret = {\n          configurable: desc.configurable,\n          enumerable: desc.enumerable\n        };\n        if(desc.get) { ret.get = function() { return win[n]; } }\n        if(desc.set) { ret.set = function(it) { win[n] = it; } }\n        return ret;\n      }(k,desc)));\n    }\n  }\n}";
        id = "x" + Math.random().toString(36).substring(2);
        _code = "/* URL: " + url + " */\nrescope.func." + id + " = function(context, winProps) {\n  var win = window;\n  var track = [];\n  var ret = (function() {\n    " + _code + "\n    " + _forceScope + "\n    " + code + "\n    " + _postcode + "\n    return this;\n  }).apply({});\n  /* returned ret may contain members from window through __proto__.  */\n  /* we only need members from libs, so just ignore those from window object. */\n  for(k in ret) {\n    if((track.indexOf(k) == -1) && ret.hasOwnProperty(k)) { context[k] = ret[k]; }\n  }\n  return context;\n}";
        script = this$.global.document.createElement("script");
        hash = {};
        for (k in ref$ = this$.global) {
          v = ref$[k];
          hash[k] = v;
        }
        script.onerror = function(it){
          return rej(it);
        };
        script.onload = function(){
          (this$.func || (this$.func = {}))[url] = rescope.func[id];
          return res(import$({}, (this$.func || (this$.func = {}))[url](context, winProps)));
        };
        script.setAttribute('src', URL.createObjectURL(new Blob([_code], {
          type: 'text/javascript'
        })));
        return this$.global.document.body.appendChild(script);
      });
    },
    _wrapper: function(url, code, context, prescope){
      var _code, k, v, _postcode, _forceScope, ret;
      context == null && (context = {});
      prescope == null && (prescope = {});
      _code = "";
      _code = (function(){
        var ref$, results$ = [];
        for (k in ref$ = context) {
          v = ref$[k];
          results$.push("var " + k + " = context." + k + ";");
        }
        return results$;
      }()).join('\n') + '\n';
      _postcode = (function(){
        var ref$, results$ = [];
        for (k in ref$ = prescope) {
          v = ref$[k];
          results$.push("if(typeof(" + k + ") != 'undefined') { this." + k + " = " + k + "; }");
        }
        return results$;
      }()).join('\n') + '\n';
      _forceScope = "var global = this;\nvar globalThis = this;\nvar window = this;\nvar self = this;";
      _forceScope = "";
      _code = "(function() {\n  " + _code + "\n  " + _forceScope + "\n  " + code + "\n  " + _postcode + "\n  return this;\n}).apply(context);";
      ret = eval(_code);
      return import$({}, ret);
    },
    _load: function(url, ctx, prescope){
      var this$ = this;
      prescope == null && (prescope = {});
      if (this.inFrame) {
        return this._loadInFrame(url);
      }
      return ld$.fetch(url, {
        method: "GET"
      }, {
        type: 'text'
      }).then(function(code){
        return this$._wrapperAlt(url, code, ctx.local, prescope);
      }).then(function(c){
        return this$.scope[url] = c;
      });
    },
    _loadInFrame: function(url){
      var this$ = this;
      return new Promise(function(res, rej){
        var script, hash, k, ref$, v, fullUrl;
        script = this$.global.document.createElement("script");
        hash = {};
        for (k in ref$ = this$.global) {
          v = ref$[k];
          hash[k] = v;
        }
        script.onerror = function(it){
          return rej(it);
        };
        script.onload = function(){
          var scope, k, v, ref$;
          if (this$.scope[url]) {
            scope = this$.scope[url];
            for (k in scope) {
              v = scope[k];
              scope[k] = this$.global[k];
              this$.global[k] = hash[k];
            }
          } else {
            this$.scope[url] = scope = {};
            for (k in ref$ = this$.global) {
              v = ref$[k];
              if (hash[k] != null || !(this$.global[k] != null)) {
                continue;
              }
              scope[k] = this$.global[k];
              this$.global[k] = hash[k];
            }
          }
          return res(scope);
        };
        fullUrl = /(https?:)?\/\//.exec(url)
          ? url
          : window.location.origin + (url[0] === '/' ? '' : '/') + url;
        script.setAttribute('src', fullUrl);
        return this$.global.document.body.appendChild(script);
      });
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = rescope;
  }
  if (typeof window != 'undefined' && window !== null) {
    window.rescope = rescope;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
