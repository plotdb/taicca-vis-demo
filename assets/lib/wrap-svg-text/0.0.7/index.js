(function(){
  var ns, flush, main;
  ns = "http://www.w3.org/2000/svg";
  flush = function(o){
    var text;
    if (isNaN(o.x + o.y) || !o.text) {
      return;
    }
    text = document.createElementNS(ns, 'text');
    text.appendChild(document.createTextNode(o.text));
    text.setAttribute('x', o.x - 1);
    text.setAttribute('y', o.y + 2);
    text.setAttribute('dominant-baseline', 'hanging');
    return text;
  };
  main = function(opt){
    var text, style, div, ref$, divbox, range, obj, texts, i$, to$, j, t, tt, j$, to1$, i, box, that, g, spans;
    opt == null && (opt = {});
    text = opt.text, style = opt.style;
    style = opt.style || {};
    text = opt.text || '';
    if (opt.node) {
      div = opt.node;
      if (!text) {
        text = div.textContent;
      }
      div.textContent = "";
    } else {
      div = document.createElement('div');
      import$((ref$ = div.style, ref$.opacity = 0, ref$["pointer-events"] = 'none', ref$["z-index"] = 0, ref$["position"] = 'absolute', ref$.top = 0, ref$.left = 0, ref$), style);
      document.body.appendChild(div);
    }
    if (opt.useRange) {
      div.innerText = text;
      divbox = div.getBoundingClientRect();
      range = document.createRange();
      obj = {
        text: "",
        x: NaN,
        y: NaN
      };
      texts = [];
      for (i$ = 0, to$ = div.childNodes.length; i$ < to$; ++i$) {
        j = i$;
        t = div.childNodes[j];
        tt = t.textContent;
        for (j$ = 0, to1$ = t.length; j$ < to1$; ++j$) {
          i = j$;
          range.setStart(t, i);
          range.setEnd(t, i + 1);
          box = range.getBoundingClientRect();
          if (obj.y === box.y - divbox.y) {
            obj.text += tt[i];
          } else {
            if (that = flush(obj)) {
              texts.push(that);
            }
            obj.text = tt[i];
            obj.x = box.x - divbox.x;
            obj.y = box.y - divbox.y;
          }
        }
      }
      if (that = flush(obj)) {
        texts.push(that);
      }
      g = document.createElementNS(ns, "g");
    } else {
      spans = text.split('').map(function(t){
        var span;
        div.appendChild(span = document.createElement('span'));
        span.appendChild(document.createTextNode(t));
        return span;
      });
      divbox = div.getBoundingClientRect();
      obj = {
        text: "",
        x: NaN,
        y: NaN
      };
      texts = [];
      spans.map(function(it){
        var box, that;
        box = it.getBoundingClientRect();
        if (obj.y === box.y - divbox.y) {
          return obj.text += it.textContent;
        } else {
          if (that = flush(obj)) {
            texts.push(that);
          }
          obj.text = it.textContent;
          obj.x = box.x - divbox.x;
          return obj.y = box.y - divbox.y;
        }
      });
      if (that = flush(obj)) {
        texts.push(that);
      }
      g = document.createElementNS(ns, "g");
    }
    texts.map(function(it){
      return g.appendChild(it);
    });
    if (!opt.node) {
      document.body.removeChild(div);
    } else {
      div.textContent = div.textContent;
    }
    return g;
  };
  if (typeof module != 'undefined' && module !== null) {
    module.exports = main;
  } else if (typeof window != 'undefined' && window !== null) {
    window.wrapSvgText = main;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
