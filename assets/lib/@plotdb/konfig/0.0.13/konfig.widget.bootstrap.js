konfig.bundle = (konfig.bundle || []).concat([{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"base","code":"<div><div class=\"d-flex\"><div class=\"flex-grow-1 d-flex align-items-center\"><div ld=\"name\"></div><div ld=\"hint\">?</div></div><plug name=\"ctrl\"></plug></div><plug name=\"config\"></plug><style type=\"text/css\">[ld=hint] {\n  margin-left: 0.5em;\n  width: 1.2em;\n  height: 1.2em;\n  border-radius: 50%;\n  background: rgba(0,0,0,0.1);\n  font-size: 10px;\n  line-height: 1.1em;\n  text-align: center;\n  cursor: pointer;\n}\n</style><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'base',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"boolean","code":"<div><div plug=\"config\"><div class=\"btn btn-outline-secondary d-block\" ld=\"switch\">&nbsp;</div></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'boolean',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"choice","code":"<div><div plug=\"config\"><select class=\"form-control\" ld=\"select\"><option ld-each=\"option\"></option></select></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'choice',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"color","code":"<div><div plug=\"config\"><div class=\"btn btn-outline-secondary d-block position-relative\"><span>&nbsp;</span><div ld=\"color\"></div></div></div><style type=\"text/css\">[ld=color] {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n  position: absolute;\n  width: calc(100% - 0.5em);\n  height: calc(100% - 0.5em);\n  border-radius: 0.25em;\n}\n</style><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'color',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"font","code":"<div><div plug=\"config\"></div><style type=\"text/css\">[ld=button] {\n  position: relative;\n}\n.choosefont .item .img {\n  background-image: url(\"/assets/lib/choosefont.js/main/fontinfo/sprite.min.png\");\n}\n</style><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'font',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"number","code":"<div><div plug=\"config\"><input class=\"ldrs\" data-class=\"form-control\" ld=\"ldrs\"/></div><div plug=\"ctrl\"><div ld=\"switch\">switch</div></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'number',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"palette","code":"<div><div ld-scope=\"ld-scope\" plug=\"config\"><div class=\"ldp\" ld=\"ldp\"><div class=\"colors\"><div class=\"color\" ld-each=\"color\"></div></div></div><div class=\"ldcv default-size\" ld=\"ldcv\"><div class=\"base\"><div class=\"inner ldpp\"><div class=\"ldpp\" ldpp=\"ldpp\"><div class=\"navbar text-center\"><div class=\"inner\" data-tag=\"menu\"><ul class=\"nav nav-pills float-right\"><div class=\"nav-item\"><a class=\"nav-link active\" data-panel=\"view\">View</a></div><div class=\"nav-item\"><a class=\"nav-link\" data-panel=\"mypal\">My Pals</a></div><div class=\"nav-item\"><a class=\"nav-link\" data-panel=\"edit\">Edit</a></div></ul><div class=\"nav nav-pills\"><div class=\"input-group\"><input class=\"form-control\" placeholder=\"Search...\" data-tag=\"search\"/><div class=\"input-group-append\" style=\"flex:1 1 auto\"><div class=\"btn btn-outline-dark dropdown-toggle\" data-toggle=\"dropdown\">Filter</div><div class=\"dropdown-menu shadow-sm\" data-tag=\"categories\"><a class=\"dropdown-item\" href=\"#\" data-cat=\"\">All</a><div class=\"dropdown-divider\"></div><a class=\"dropdown-item\" href=\"#\" data-cat=\"artwork\">Artwork</a><a class=\"dropdown-item\" href=\"#\" data-cat=\"brand\">Brand</a><a class=\"dropdown-item\" href=\"#\" data-cat=\"concept\">Concept</a><div class=\"dropdown-divider\"></div><a class=\"dropdown-item\" href=\"#\" data-cat=\"gradient\">Gradient</a><a class=\"dropdown-item\" href=\"#\" data-cat=\"qualitative\">Qualitative</a><a class=\"dropdown-item\" href=\"#\" data-cat=\"diverging\">Diverging</a><a class=\"dropdown-item\" href=\"#\" data-cat=\"colorbrew\">Colorbrew</a></div></div></div></div></div></div><div class=\"panels\"><div class=\"panel active clusterize-scroll\" data-panel=\"view\" style=\"max-height:600px\"><div class=\"inner clusterize-content\"></div></div><div class=\"panel clusterize-scroll\" data-panel=\"mypal\" style=\"max-height:600px\"><div class=\"inner clusterize-content\"></div><div class=\"btn btn-primary btn-block ld-over-inverse btn-load\">Load More<div class=\"ld ldld ldbtn sm\"></div></div></div><div class=\"panel\" data-panel=\"edit\"><div class=\"ldp\"><div class=\"name\"></div><div class=\"colors\"></div></div><div class=\"edit\"><div class=\"inner\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"ldcolorpicker no-border no-palette\"></div></div><div class=\"col-sm-6\"><div class=\"row mb-2\"><div class=\"col-sm-8\"><select class=\"form-control form-control-local-sm\" value=\"rgb\"><option value=\"rgb\">RGB</option><option value=\"hsl\">HSL</option><option value=\"hcl\">HCL</option></select></div><div class=\"col-sm-4 pl-0\"><input class=\"form-control form-control-local-sm value\" placeholder=\"Hex Value\" data-tag=\"hex\" style=\"margin:0\"/></div></div><div class=\"row config active\" data-tag=\"rgb\"><div class=\"col-sm-8\"><div class=\"label-group\"><span>Red</span></div><input class=\"ldrs sm\" data-tag=\"rgb-r\"/><div class=\"label-group\"><span>Green</span></div><input class=\"ldrs sm\" data-tag=\"rgb-g\"/><div class=\"label-group\"><span>Blue</span></div><input class=\"ldrs sm\" data-tag=\"rgb-b\"/></div><div class=\"col-sm-4\"><input class=\"value form-control form-control-local-sm\" data-tag=\"rgb-r\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"rgb-g\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"rgb-b\"/></div></div><div class=\"row config\" data-tag=\"hsl\"><div class=\"col-sm-8\"><div class=\"label-group\"><span>Hue</span></div><input class=\"ldrs sm\" data-tag=\"hsl-h\"/><div class=\"label-group\"><span>Saturation</span></div><input class=\"ldrs sm\" data-tag=\"hsl-s\"/><div class=\"label-group\"><span>Luminance</span></div><input class=\"ldrs sm\" data-tag=\"hsl-l\"/></div><div class=\"col-sm-4\"><input class=\"value form-control form-control-local-sm\" data-tag=\"hsl-h\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"hsl-s\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"hsl-l\"/></div></div><div class=\"row config\" data-tag=\"hcl\"><div class=\"col-sm-8\"><div class=\"label-group\"><span>Hue</span></div><input class=\"ldrs sm\" data-tag=\"hcl-h\"/><div class=\"label-group\"><span>Chroma</span></div><input class=\"ldrs sm\" data-tag=\"hcl-c\"/><div class=\"label-group\"><span>Luminance</span></div><input class=\"ldrs sm\" data-tag=\"hcl-l\"/></div><div class=\"col-sm-4\"><input class=\"value form-control form-control-local-sm\" data-tag=\"hcl-h\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"hcl-c\"/><input class=\"value form-control form-control-local-sm\" data-tag=\"hcl-l\"/></div></div></div></div></div></div><div class=\"foot\"><hr/><div class=\"float-right\"><div class=\"btn btn-primary mr-2\" data-action=\"use\">Use This Palette</div><div class=\"btn btn-outline-secondary ld-ext-right\" data-action=\"save\">Save as Asset <div class=\"ld ldld ldbtn sm\"></div></div></div><div class=\"btn btn-outline-secondary\" data-action=\"undo\">Undo <i class=\"i-undo\"></i></div></div></div></div></div></div></div></div></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'palette',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"paragraph","code":"<div><div plug=\"config\"><textarea class=\"form-control\" rows=\"1\" ld=\"input\"></textarea><div class=\"ldcv inline\" ld=\"ldcv\"><div class=\"base\" ld=\"panel\"><div class=\"inner\"><div class=\"p-2\"><textarea class=\"form-control\" ld=\"textarea\" rows=\"3\"></textarea></div><div class=\"px-2 pb-2 text-right\"><div class=\"btn btn-sm btn-outline-secondary\" data-ldcv-set=\"\">Cancel</div><div class=\"btn btn-sm btn-primary ml-2\" data-ldcv-set=\"ok\">OK</div></div></div></div></div></div><style type=\"text/css\">textarea[ld=input] {\n  resize: none;\n}\n.ldcv.inline {\n  position: absolute;\n}\n.ldcv.inline:before {\n  background: rgba(0,0,0,0.1);\n}\n.ldcv.inline:after {\n  display: none;\n}\n.ldcv.inline .base {\n  position: absolute;\n}\n</style><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'paragraph',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"popup","code":"<div><div plug=\"config\"><div class=\"btn btn-outline-secondary d-block position-relative\" ld=\"button\">...</div></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'popup',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"text","code":"<div><div plug=\"config\"><input class=\"form-control\" ld=\"input\"/></div><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'text',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"},{"name":"@plotdb/konfig.widget.bootstrap","version":"master","path":"upload","code":"<div><div plug=\"config\"><div class=\"btn btn-outline-secondary d-block\" ld=\"button\"><span>Upload</span><input type=\"file\" ld=\"input\"/></div></div><style type=\"text/css\">[ld=button] {\n  position: relative;\n}\n[ld=button] input {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  opacity: 0.001;\n  z-index: 1;\n  top: 0;\n  left: 0;\n}\n::-webkit-file-upload-button {\n  cursor: pointer;\n  height: 100%;\n  border: 0;\n}\n</style><script type=\"@plotdb/block\">(function(){\n  return {\n    pkg: {\n      extend: {\n        name: '@plotdb/konfig.widget.default',\n        version: 'master',\n        path: 'upload',\n        dom: 'overwrite'\n      }\n    }\n  };\n});</script></div>"}]);
