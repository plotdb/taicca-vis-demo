(function(){
  var config;
  config = {
    preset: {
      'default': {
        margin: {
          type: 'number'
        },
        font: {
          size: {
            type: 'number',
            min: 1,
            max: 256,
            step: 1,
            'default': 16
          }
        },
        color: {
          type: 'color'
        },
        palette: {
          type: 'palette'
        },
        background: {
          type: 'color'
        }
      },
      legend: {
        selectable: {
          type: 'boolean',
          'default': true
        }
      }
    }
  };
  if (typeof chart != 'undefined' && chart !== null) {
    (chart.utils || (chart.utils = {})).config = config;
  }
}).call(this);
