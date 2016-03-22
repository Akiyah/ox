function urlParams() {
  var params = {};
  var pairs = location.search.substring(1).split('&');
  for(var i = 0; pairs[i]; i++) {
    var kv = pairs[i].split('=');
    params[kv[0]] = decodeURIComponent(kv[1]);
  }
  return params;
}

var DEFAULT_TEXTS = ['○', '×'];
var DEFAULT_COLORS = ['white', 'white', 'green', 'black', 'red'];
var DEFAULT_BACKGROUND_COLORS = ['red', 'blue', 'white', 'yellow', 'white'];

function createPage(params, i) {
  var page = {
    text:            DEFAULT_TEXTS[i],
    color:           DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    backgroundColor: DEFAULT_BACKGROUND_COLORS[i % DEFAULT_BACKGROUND_COLORS.length]
  };

  var key = 'page' + i;
  if (!(key in params)) {
    if (i < DEFAULT_TEXTS.length) {
      return page;
    } else {
      return null;
    }
  }

  var words = params[key].split(',');
  page['text']            = words[0] ? words[0] : page['text'];
  page['color']           = words[1] ? words[1] : page['color'];
  page['backgroundColor'] = words[2] ? words[2] : page['backgroundColor'];
  return page;
}

function createPages(params) {
  var pages = [];
  for (var i = 0; i < 10; i++) {
    var page = createPage(params, i);
    if (!page) {
      return pages;
    }
    pages.push(page);
  }
  return pages;
}

function resize() {
  var bodyWidth  = $('body').width();
  var bodyHeight = $('body').height();
  
  $('div.text_wrapper span').each(function() {
    var width  = $(this).width();
    var height = $(this).height();
    var fontSize = $(this).data('fontSize');
    fontSize *= Math.min(bodyWidth / width, bodyHeight / height);
    $(this).css('fontSize', fontSize + 'px');
    $(this).css('lineHeight', fontSize + 'px');
    $(this).data('fontSize', fontSize);
  });
}

function init() {
  var params = urlParams();
  var pages = createPages(params);
  for (var i = 0; i < pages.length; i++) {
    var text = $('<span>' + pages[i].text + '</span>');
    text.css('fontSize', '10px');
    text.css('lineHeight', '10px');
    text.data('fontSize', 10)
    var text_wrapper = $('<div class="text_wrapper"></div>');
    var section = $('<div class="section"></div>');
    section.css('color', pages[i].color);
    section.css('backgroundColor', pages[i].backgroundColor);

    text_wrapper.append(text);
    section.append(text_wrapper);
    $('#pagepiling').append(section);
  }
}

$(function() {
  init();
  resize();
  $('#pagepiling').pagepiling({});
});

$(window).on("orientationchange resize", resize);

